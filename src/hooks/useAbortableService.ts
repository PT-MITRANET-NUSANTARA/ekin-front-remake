import { HttpStatusCode } from '@/constants';
import env from '@/utils/env';
import { useCallback, useRef, useState } from 'react';

export interface Response<T> {
  code: number;
  status: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ServiceMethodReturnType<ApiData, Model> {
  abortController: AbortController;
  parser?: (data: ApiData) => Model;
  response: Promise<Response<ApiData>>;
  onResolved?: (data: { apiData?: ApiData; model?: Model }) => void;
}

export default function useAbortableService<P extends any[], ApiData, Model>(
  serviceMethod: (...params: P) => ServiceMethodReturnType<ApiData, Model>,
  { onUnauthorized }: { onUnauthorized?: () => void } = {}
): {
  data: Model | null;
  message: string;
  isSuccess: boolean;
  isLoading: boolean;
  totalData: number;
  execute: (...params: P) => Promise<{ data: Model | null; message: string; code: HttpStatusCode; isSuccess: boolean }>;
  abort: () => void;
} {
  const [data, setData] = useState<Model | null>(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const abortController = useRef<AbortController>();

  const execute = useCallback(
    async (...params: P) => {
      setMessage('');
      setIsLoading(true);
      const result: { data: Model | null; message: string; code: number; isSuccess: boolean } = {
        message: '',
        code: 0,
        isSuccess: false,
        data: null
      };
      const { abortController: controller, response, parser, onResolved } = serviceMethod(...params);
      abortController.current = controller;

      try {
        const awaitedResponse = await response;

        if (awaitedResponse.data) {
          const { data } = awaitedResponse;
          result.data = typeof parser === 'function' ? parser(data) : (data as Model);
        }

        setData(result.data);
        if (onResolved) onResolved({ apiData: awaitedResponse.data, model: result.data ?? undefined });

        setTotalData(awaitedResponse.pagination?.total || 0);
        result.message = awaitedResponse.message;
        result.code = awaitedResponse.code;
        if (onUnauthorized && result.code === HttpStatusCode.UNAUTHORIZED) onUnauthorized();
        result.isSuccess = awaitedResponse.status;
      } catch (error) {
        env.dev(() => {
          if (!(error instanceof Error)) return;
          if (error.name === 'AbortError') return;
          console.error(error);
        });
        // TODO: use enum for error messages
        result.message = error instanceof Error ? error.message : 'An error occurred';
        result.isSuccess = false;
      }
      setIsLoading(false);
      setMessage(result.message);
      setIsSuccess(result.isSuccess);

      return result;
    },
    [onUnauthorized]
  );

  const abort = useCallback(() => {
    if (abortController.current) abortController.current.abort();
  }, []);

  return { data, message, isSuccess, isLoading, totalData, execute, abort };
}
