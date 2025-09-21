import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function usePagination({ page: defaultPage = 1, per_page: defaultPerPage = 10, totalData = 0 }: { page?: number; per_page?: number; totalData: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get('page') || defaultPage);
  const per_page = +(searchParams.get('per_page') || defaultPerPage);

  const onChange = useCallback(
    (page: number, per_page: number = 10) => {
      setSearchParams({ page: page.toString(), per_page: per_page.toString() });
    },
    [setSearchParams, per_page]
  );

  return {
    page,
    per_page,
    totalData,
    onChange
  };
}
