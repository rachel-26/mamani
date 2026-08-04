import client from './client';

export const getMe = async () => {
  const response = await client.get('/users/me');
  return response.data;
};

export const updateMe = async (data: any) => {
  const response = await client.put('/users/me', data);
  return response.data;
};
