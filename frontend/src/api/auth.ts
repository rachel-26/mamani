import client from './client';

export interface LoginPayload { email: string; password: string; }
export interface SignupPayload { full_name: string; email: string; password: string; }

export const login = async (data: LoginPayload) => {
  // FastAPI's OAuth2PasswordRequestForm expects form data
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);

  const response = await client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data as { access_token: string; token_type: string };
};

export const signup = async (data: SignupPayload) => {
  const response = await client.post('/auth/signup', data);
  return response.data as { access_token: string; token_type: string };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
};

export const isAuthenticated = () => !!localStorage.getItem('token');
