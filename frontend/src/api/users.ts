import client from './client';

export interface UserUpdatePayload {
  full_name?: string;
  phone?: string;
  currency?: string;
  avatar_url?: string;
}

export const getMe = async () => {
  const response = await client.get('/users/me');
  return response.data;
};

export const updateMe = async (data: UserUpdatePayload) => {
  const response = await client.put('/users/me', data);
  return response.data;
};
