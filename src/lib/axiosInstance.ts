import axios from "axios";
import { ApiResponse } from "@/types/response";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const createAxiosInstance = (
  getAccessToken: () => string | null,
  setAccessToken: (token: string | null) => void,
  onRequestFailed: () => void,
) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true, // 👈 so cookie gets sent on refresh
  });

  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(api(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post<
            ApiResponse<{ accessToken: string }>
          >(
            import.meta.env.VITE_SERVER_URL + "/auth/refresh",
            {},
            { withCredentials: true },
          );
          if (!response.data.success) throw new Error(response.data.message);
          const newToken = response.data.data.accessToken;

          // const newToken = await AppwriteService.createJWT();

          setAccessToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          onRequestFailed(); // Logout fallback
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(err);
    },
  );

  return api;
};
