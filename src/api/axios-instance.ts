import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getAuthToken } from "@/helpers";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse<T>) => data);

  // @ts-expect-error axios is not typed
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
