import { InputType } from '@/constants';
import { SelectProps, UploadProps } from 'antd';
import { Rule } from 'antd/es/form';

export default interface FormField<T> extends SelectProps {
  label: string;
  name: keyof T;
  type: InputType;
  min?: number;
  max?: number;
  accept?: string[];
  beforeUpload?: UploadProps['beforeUpload'];
  getFileList?: (data: T) => {
    url: string;
    name: string;
  }[];
  rules?: Rule[];
  renderIf?: (data: Partial<T> | null) => boolean;
  dependencies?: (keyof T)[];
  showSearch?: boolean;
  readOnly?: boolean;
}
