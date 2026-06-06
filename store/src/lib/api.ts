import axios from 'axios';

/** Browser uses PUBLIC URL; server components in Docker use internal service URL when set. */
export function getApiRoot(): string {
  const internal = process.env.API_INTERNAL_URL?.replace(/\/$/, '');
  if (typeof window === 'undefined' && internal) {
    return internal;
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
}

export const api = axios.create({
  baseURL: `${getApiRoot()}/store`,
  headers: { 'Content-Type': 'application/json' },
});

let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
}
