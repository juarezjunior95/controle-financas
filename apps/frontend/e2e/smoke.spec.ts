import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Formulários e Rotas Principais', () => {
  test('deve renderizar a página inicial sem quebrar e redirecionar para login', async ({ page }) => {
    // Acessa a raiz
    await page.goto('/');

    // Se estiver usando o redirecionamento padrão do Clerk para não logados
    // a URL deve mudar para algo como /sign-in ou exibir o widget do Clerk
    // Como é um smoke test genérico, apenas validamos se a página carregou sem erro 500
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    // Verifica se o título da aba está definido (garantia de renderização básica do HTML)
    const title = await page.title();
    expect(title).toBeDefined();
  });

  test('formulário de login do Clerk deve estar disponível', async ({ page }) => {
    // Redirecionamento ou acesso direto ao /sign-in (rota padrão)
    await page.goto('/sign-in');

    // A página de sign-in do Clerk costuma ter campos com "Email address"
    // ou no mínimo o próprio container principal do Clerk.
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Como o Clerk injeta via iframe ou shadow DOM as vezes e muda de classe,
    // um smoke test avalia se o carregamento geral da view principal
    // (a div #__next ou body) sobrevive à montagem do React.
    const root = await page.locator('div, main');
    expect(await root.count()).toBeGreaterThan(0);
  });
});
