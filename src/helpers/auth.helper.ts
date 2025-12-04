import type { UserResponse } from "@/api/generated/schemas";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "@/constants";

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const setUserData = (user: UserResponse) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getUserData = (): UserResponse | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

export const isUserLoggedIn = () => {
  return !!(getUserData() || getAuthToken());
};
