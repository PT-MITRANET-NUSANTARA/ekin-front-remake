import { useCallback, useState } from 'react';

export default function useSessionStorage<T>(key: string, initialValue: T): [T, (newData: T) => void] {
  const [data, setData] = useState<T>(() => {
    const storedData = sessionStorage.getItem(key);
    try {
      return storedData ? JSON.parse(storedData).data : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setSessionStorage = useCallback(
    (newData: T) => {
      sessionStorage.setItem(key, JSON.stringify({ data: newData }));
      setData(newData);
    },
    [key]
  );

  return [data, setSessionStorage] as const;
}
