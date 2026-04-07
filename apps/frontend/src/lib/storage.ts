// Chaves do localStorage
export const STORAGE_KEYS = {
  INITIAL_BALANCE: 'vault_initial_balance',
  TRANSACTIONS: 'vault_transactions',
  CATEGORIES: 'vault_categories',
  GOALS: 'vault_goals',
  SETTINGS: 'vault_settings',
};

// Tipos
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate?: string;
  status: 'active' | 'completed';
}

export interface Settings {
  initialBalance: number;
  theme: 'dark' | 'light';
  currency: 'BRL';
}

// Categorias padrão
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Alimentação', icon: 'restaurant', color: '#b0c6ff', isDefault: true },
  { id: 'cat-2', name: 'Transporte', icon: 'directions_car', color: '#ffb59b', isDefault: true },
  { id: 'cat-3', name: 'Moradia', icon: 'home', color: '#a1b4eb', isDefault: true },
  { id: 'cat-4', name: 'Saúde', icon: 'medical_services', color: '#ff8a80', isDefault: true },
  { id: 'cat-5', name: 'Lazer', icon: 'sports_esports', color: '#b388ff', isDefault: true },
  { id: 'cat-6', name: 'Estudos', icon: 'school', color: '#82b1ff', isDefault: true },
  { id: 'cat-7', name: 'Salário', icon: 'payments', color: '#69f0ae', isDefault: true },
  { id: 'cat-8', name: 'Freelance', icon: 'work', color: '#ffd740', isDefault: true },
  { id: 'cat-9', name: 'Outros', icon: 'more_horiz', color: '#90a4ae', isDefault: true },
];

// Helpers de localStorage
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

// Funções específicas
export function getInitialBalance(): number {
  return getFromStorage<number>(STORAGE_KEYS.INITIAL_BALANCE, 0);
}

export function setInitialBalance(value: number): void {
  setToStorage(STORAGE_KEYS.INITIAL_BALANCE, value);
}

export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function setTransactions(transactions: Transaction[]): void {
  setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  setTransactions(transactions);
  return newTransaction;
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter(t => t.id !== id);
  setTransactions(transactions);
}

export function getCategories(): Category[] {
  const stored = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  if (stored.length === 0) {
    setToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return stored;
}

// Formatação de moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formatação sem símbolo (para inputs)
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Parse de valor monetário
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

// Calcular totais por período
export function calculateTotals(transactions: Transaction[], month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth();
  const targetYear = year ?? now.getFullYear();

  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
  });

  const income = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense, transactions: filtered };
}

// Gerar ID único
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
