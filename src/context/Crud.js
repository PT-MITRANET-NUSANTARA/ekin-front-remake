import { createContext } from 'react';

const Crud = createContext({
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

export default Crud;
