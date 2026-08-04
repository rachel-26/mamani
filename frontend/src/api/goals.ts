import client from './client';

export const getGoals = async () => {
  const response = await client.get('/goals');
  return response.data;
};

export const createGoal = async (data: any) => {
  const response = await client.post('/goals', data);
  return response.data;
};

export const updateGoal = async (id: string | number, data: any) => {
  const response = await client.put(`/goals/${id}`, data);
  return response.data;
};
