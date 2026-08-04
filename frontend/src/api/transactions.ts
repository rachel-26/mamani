import client from './client';

export const getTransactions = async () => {
  const response = await client.get('/transactions');
  return response.data;
};

export const createTransaction = async (data: any) => {
  const response = await client.post('/transactions', data);
  return response.data;
};

export const deleteTransaction = async (id: string | number) => {
  const response = await client.delete(`/transactions/${id}`);
  return response.data;
};
