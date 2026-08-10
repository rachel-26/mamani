import client from './client';

export interface TransactionPayload {
  title: string;
  category: string;
  amount: number;
  is_expense: boolean;
  notes?: string;
  account?: string;
  date?: string;
}

export const getTransactions = async (params?: {
  skip?: number;
  limit?: number;
  category?: string;
  is_expense?: boolean;
}) => {
  const response = await client.get('/transactions', { params });
  return response.data;
};

export const getTransactionSummary = async () => {
  const response = await client.get('/transactions/summary');
  return response.data;
};

export const createTransaction = async (data: TransactionPayload) => {
  const response = await client.post('/transactions', data);
  return response.data;
};

export const deleteTransaction = async (id: string | number) => {
  await client.delete(`/transactions/${id}`);
};
