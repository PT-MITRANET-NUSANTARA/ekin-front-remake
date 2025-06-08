import { TableProps } from 'antd';

type DatatableColumns<T> = TableProps<T>['columns'] & { searchable?: boolean }[];

export default DatatableColumns;
