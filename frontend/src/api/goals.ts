import client from './client';

export interface GoalPayload {
  title: string;
  target_amount: number;
  saved_amount?: number;
  target_date?: string;
  is_short_term?: boolean;
  color_index?: number;
  image_url?: string;
}

export interface GoalUpdatePayload {
  saved_amount?: number;
  title?: string;
  target_amount?: number;
  target_date?: string;
}

export const getGoals = async () => {
  const response = await client.get('/goals');
  return response.data;
};

export const createGoal = async (data: GoalPayload) => {
  const response = await client.post('/goals', data);
  return response.data;
};

export const updateGoal = async (id: string | number, data: GoalUpdatePayload) => {
  const response = await client.put(`/goals/${id}`, data);
  return response.data;
};

export const depositToGoal = async (id: string | number, amount: number) => {
  const response = await client.patch(`/goals/${id}/deposit`, { amount });
  return response.data;
};

export const deleteGoal = async (id: string | number) => {
  await client.delete(`/goals/${id}`);
};
