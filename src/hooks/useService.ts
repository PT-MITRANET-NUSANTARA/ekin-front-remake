import { HttpStatusCode } from '@/constants';
import env from '@/utils/env';
import { useCallback, useState } from 'react';

export interface Response<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface UseServiceReturnType<T, P extends any[]> {
  data: T | null;
  message: string;
  isSuccess: boolean;
  isLoading: boolean;
  totalData: number;
  execute: (...params: P) => Promise<{ data: T | null; message: string; code: HttpStatusCode; isSuccess: boolean }>;
}

/**
 * @deprecated use useAbortableService instead cause this hook doesn't support aborting request
 */
export default function useService<T, P extends any[]>(serviceMethod: (...params: P) => Promise<Response<T>>, onUnauthorized?: () => void): UseServiceReturnType<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);

  const execute = useCallback(
    async (...params: P) => {
      setMessage('');
      setIsLoading(true);
      let message = '';
      let code = 0;
      let isSuccess = false;
      let data = null;
      try {
        const response = await serviceMethod(...params);
        if (response.data) {
          data = response.data;
        }
        setData(response.data);
        setTotalData(response.pagination?.total || 0);
        message = response.message;
        code = response.statusCode;
        if (onUnauthorized && code === HttpStatusCode.UNAUTHORIZED) onUnauthorized();
        isSuccess = response.status;
      } catch (error) {
        env.dev(() => {
          if (!(error instanceof Error)) return;
          if (error.name === 'AbortError') return;
          console.error(error);
        });
        // TODO: use enum for error messages
        message = error instanceof Error ? error.message : 'An error occurred';
        isSuccess = false;
      } finally {
        setIsLoading(false);
      }
      setMessage(message);
      setIsSuccess(isSuccess);

      return { data, message, code, isSuccess };
    },
    [onUnauthorized]
  );

  return { data, message, isSuccess, isLoading, totalData, execute };
}
