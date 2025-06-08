import { CrudModalContext } from '@/context';
import { useContext } from 'react';

export default function useCrudModal() {
  const context = useContext(CrudModalContext);

  if (!context) {
    throw new Error('useCrudModal must be used within a CrudModalProvider');
  }

  return context;
}
