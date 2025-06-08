import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function usePagination({ page: defaultPage = 1, perPage: defaultPerPage = 10, totalData = 0 }: { page?: number; perPage?: number; totalData: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get('page') || defaultPage);
  const perPage = +(searchParams.get('per_page') || defaultPerPage);

  const onChange = useCallback(
    (page: number, perPage: number = 10) => {
      setSearchParams({ page: page.toString(), per_page: perPage.toString() });
    },
    [setSearchParams, perPage]
  );

  return {
    page,
    perPage,
    totalData,
    onChange
  };
}
