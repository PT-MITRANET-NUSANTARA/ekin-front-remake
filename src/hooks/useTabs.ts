import { ReactNode, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Tabs = Record<string, ReactNode>;

export default function useTabs<T extends Tabs>(tabs: T, defaultTab?: keyof T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const keys = Object.keys(tabs) as (keyof T)[];
  const [tab, setTab] = useState<keyof T>(searchParams.get('tab') ?? (defaultTab || keys[0]));

  const tabItems = keys.map((key) => ({
    key,
    label: key,
    children: tabs[key]
  }));

  const setActive = useCallback((key: keyof T) => {
    setSearchParams((prev) => ({
      ...prev,
      tab: key
    }));

    setTab(key);
  }, []);

  return [tab, setActive, tabItems] as const;
}
