-- =============================================================================
-- QUERIES ÚTEIS - Finanças Pessoais
-- Consultas para validação, relatórios e debugging
-- =============================================================================

-- =============================================================================
-- 1. RESUMO MENSAL POR USUÁRIO
-- =============================================================================

-- Resumo do mês atual para um usuário específico
SELECT 
  u.display_name,
  DATE_TRUNC('month', t.occurred_on) as mes,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as receitas,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as despesas,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as saldo
FROM transactions t
JOIN users u ON t.user_id = u.id
WHERE u.email = 'maria.silva@email.com'
  AND DATE_TRUNC('month', t.occurred_on) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.display_name, DATE_TRUNC('month', t.occurred_on);

-- =============================================================================
-- 2. GASTOS POR CATEGORIA (TOP 5)
-- =============================================================================

SELECT 
  c.name as categoria,
  SUM(t.amount) as total,
  COUNT(*) as qtd_lancamentos,
  ROUND(SUM(t.amount) * 100.0 / SUM(SUM(t.amount)) OVER(), 2) as percentual
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
  AND t.user_id = '11111111-1111-1111-1111-111111111111'
  AND DATE_TRUNC('month', t.occurred_on) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.name
ORDER BY total DESC
LIMIT 5;

-- =============================================================================
-- 3. EVOLUÇÃO MENSAL (ÚLTIMOS 6 MESES)
-- =============================================================================

SELECT 
  TO_CHAR(DATE_TRUNC('month', t.occurred_on), 'YYYY-MM') as mes,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as receitas,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as despesas,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as saldo
FROM transactions t
WHERE t.user_id = '11111111-1111-1111-1111-111111111111'
  AND t.occurred_on >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', t.occurred_on)
ORDER BY mes;

-- =============================================================================
-- 4. PROGRESSO DAS METAS
-- =============================================================================

SELECT 
  g.name as meta,
  g.target_amount as alvo,
  g.current_amount as atual,
  ROUND((g.current_amount / g.target_amount) * 100, 2) as percentual,
  g.target_amount - g.current_amount as faltante,
  g.due_date as prazo,
  g.status
FROM goals g
WHERE g.user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY 
  CASE g.status 
    WHEN 'active' THEN 1 
    WHEN 'completed' THEN 2 
    ELSE 3 
  END,
  g.due_date NULLS LAST;

-- =============================================================================
-- 5. MÉDIA DIÁRIA DE GASTOS
-- =============================================================================

SELECT 
  ROUND(AVG(daily_expense), 2) as media_diaria,
  ROUND(MAX(daily_expense), 2) as maior_dia,
  ROUND(MIN(daily_expense), 2) as menor_dia
FROM (
  SELECT 
    t.occurred_on,
    SUM(t.amount) as daily_expense
  FROM transactions t
  WHERE t.type = 'expense'
    AND t.user_id = '11111111-1111-1111-1111-111111111111'
    AND DATE_TRUNC('month', t.occurred_on) = DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY t.occurred_on
) daily;

-- =============================================================================
-- 6. COMPARATIVO RECEITA VS DESPESA POR CATEGORIA
-- =============================================================================

SELECT 
  c.name as categoria,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as receitas,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as despesas,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as liquido
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
  AND DATE_TRUNC('month', t.occurred_on) = DATE_TRUNC('month', CURRENT_DATE)
WHERE c.user_id = '11111111-1111-1111-1111-111111111111'
GROUP BY c.name
ORDER BY liquido DESC;

-- =============================================================================
-- 7. USUÁRIOS COM MAIS LANÇAMENTOS (ADMIN)
-- =============================================================================

SELECT 
  u.display_name,
  u.email,
  COUNT(t.id) as total_lancamentos,
  COUNT(DISTINCT DATE_TRUNC('month', t.occurred_on)) as meses_ativos
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.display_name, u.email
ORDER BY total_lancamentos DESC;

-- =============================================================================
-- 8. LANÇAMENTOS RECENTES (ÚLTIMOS 10)
-- =============================================================================

SELECT 
  t.occurred_on as data,
  c.name as categoria,
  t.type as tipo,
  t.amount as valor,
  t.description as descricao
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY t.occurred_on DESC, t.created_at DESC
LIMIT 10;

-- =============================================================================
-- 9. VERIFICAÇÃO DE INTEGRIDADE
-- =============================================================================

-- Categorias órfãs (sem usuário)
SELECT c.* FROM categories c
LEFT JOIN users u ON c.user_id = u.id
WHERE u.id IS NULL;

-- Transações com categoria inválida
SELECT t.* FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE c.id IS NULL;

-- Transações com usuário diferente da categoria
SELECT t.*, c.user_id as cat_user_id
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id != c.user_id;

-- =============================================================================
-- 10. ESTATÍSTICAS GERAIS DO SISTEMA (ADMIN)
-- =============================================================================

SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM categories) as total_categorias,
  (SELECT COUNT(*) FROM transactions) as total_lancamentos,
  (SELECT COUNT(*) FROM goals) as total_metas,
  (SELECT COUNT(*) FROM goals WHERE status = 'completed') as metas_concluidas,
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income') as total_receitas,
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense') as total_despesas;
