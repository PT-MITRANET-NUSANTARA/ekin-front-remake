import { createContext } from 'react';

const CrudModalContext = createContext({
  create: () => {},
  show: {
    default: () => {},
    paragraph: () => {},
    list: () => {},
    table: () => {}
  },
  edit: () => {},
  delete: {
    default: () => {},
    batch: () => {},
    confirm: () => {}
  },
  close: () => {},
  setIsLoading: () => {},
  setFormFields: () => {}
});

export default CrudModalContext;
