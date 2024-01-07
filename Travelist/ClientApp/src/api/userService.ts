import { PublicUser, User } from '../types/userTypes.ts';

export const login = async (formData: { email: string, password: string }): Promise<string> => {
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.text();
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch('/api/user/current', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json() as User;
  return data ;
};

export const getPublicUser = async (username: string): Promise<PublicUser> => {
  const response = await fetch(`/api/user/${username}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json() as PublicUser;
  return data;
};

export const fetchUser = async (username: string): Promise<PublicUser> => {
  const response = await fetch(`/api/User/${username}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json() as PublicUser;
  return data ;
};

export const deleteAccount = async (token: string, password: string): Promise<void> => {
  const response = await fetch('/api/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: `"${password}"`,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
};