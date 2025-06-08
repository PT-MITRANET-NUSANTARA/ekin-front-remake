import { ColumnGroupType, ColumnType } from 'antd/es/table';

type DatatableColumn<T> = (ColumnGroupType<T> | ColumnType<T>) & { searchable?: boolean };

export default DatatableColumn;
