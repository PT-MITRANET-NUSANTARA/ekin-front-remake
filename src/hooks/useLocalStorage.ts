import { useCallback, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (newData: T) => void] {
  const [data, setData] = useState<T>(() => {
    const storedData = localStorage.getItem(key);
    try {
      return storedData ? JSON.parse(storedData).data : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setLocalStorage = useCallback(
    (newData: T) => {
      localStorage.setItem(key, JSON.stringify({ data: newData }));
      setData(newData);
    },
    [key]
  );

  return [data, setLocalStorage] as const;
}
