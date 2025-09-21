import { CrudModalType, InputType } from '@/constants';
import clientAsset from '@/utils/clientAsset';
import strings from '@/utils/strings';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { MapPicker, Select } from './input';
import { debounce } from 'lodash';
import { useAuth } from '@/hooks';

/**
 * @param {{
 *  formFields: import('@/types/FormField').default[];
 * }} props
 * @returns
 */
export default function CrudModal({ isModalOpen, data: initialData, close, title, formFields, onSubmit, onChange = () => {}, type = CrudModalType.SHOW, isLoading, ...props }) {
  const { token } = useAuth();
  const [form] = Form.useForm();
  const [realtimeData, setRealtimeData] = useState(initialData);
  const [searchOptions, setSearchOptions] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      form.setFieldsValue(initialData ?? {});
      setRealtimeData(initialData ?? {});
    }
  }, [isModalOpen, initialData, form]);

  useEffect(() => {
    onChange(realtimeData);
  }, [onChange, realtimeData]);

  const handleValuesChange = (changedValue) => {
    setRealtimeData((prevData) => ({ ...prevData, ...changedValue }));
  };

  const handleSearch = debounce(async (value, field) => {
    if (!value.trim()) {
      setSearchOptions([]);
      return;
    }

    if (field.fetchOptions) {
      const data = await field.fetchOptions({ token: token, search: value });
      setSearchOptions(
        data.data.map(
          field.mapOptions
            ? field.mapOptions
            : (item) => ({
                label: item.name,
                value: item.id
              })
        )
      );
    }
  }, 500);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }, [isModalOpen]);

  /**
   * @param {import('@/types/FormField').default} field
   * @returns
   */
  const renderFormInput = (field) => {
    field.readOnly = type === CrudModalType.SHOW || type === CrudModalType.DELETE;

    switch (field.type) {
      case InputType.TEXT:
        return <Input placeholder={`Masukan ${field.label}`} size="large" readOnly={field.readOnly} {...field.extra} />;

      case InputType.NUMBER:
        return <InputNumber placeholder={`Masukan ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" readOnly={field.readOnly} {...field.extra} />;

      case InputType.LONGTEXT:
        return <TextArea placeholder={field.label} rows={4} readOnly={field.readOnly} size="large" {...field.extra} />;

      case InputType.DATE:
        return <DatePicker className="w-full" size="large" placeholder={`Pilih ${field.label}`} readOnly={field.readOnly} {...field.extra} />;

      case InputType.UPLOAD:
        return (
          // FIXME: if readOnly, then show only the file/image and not the drag and drop area
          <Dragger accept={field.accept.join(', ')} name={field.name} maxCount={field.max} beforeUpload={field.beforeUpload} listType="picture" {...field.extra} {...(initialData ? { defaultFileList: field.getFileList(initialData) } : {})}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
            <p className="ant-upload-hint">{strings('accepted_file_types_s', field.accept.join(', '))}</p>
          </Dragger>
        );

      case InputType.SELECT:
        return <Select {...field} />;

      case InputType.SELECT_FETCH:
        return <Select showSearch placeholder={`Cari ${field.label}`} filterOption={false} onSearch={(value) => handleSearch(value, field)} options={searchOptions} />;

      case InputType.SELECT_LOGO:
        return (
          <div className="grid grid-cols-12 gap-3">
            {field.options.map((option, index) => (
              <div key={index} className="col-span-3 flex w-full items-center justify-center">
                <input disabled={field.readOnly} type="radio" id={option.value} name="logo" value={option.value} className="peer hidden" defaultChecked={initialData?.logo === option.value} />
                <label htmlFor={option.value} className="peer-checked:border-color-primary-500 flex aspect-square h-full w-full items-center justify-center rounded-full border-4 border-gray-200">
                  <img src={clientAsset(option.value)} alt={option.name} className="w-full p-1.5" />
                </label>
              </div>
            ))}
          </div>
        );

      case InputType.MAP_PICKER:
        return <MapPicker form={form} handleValuesChange={handleValuesChange} realtimeData={realtimeData} />;
      default:
        return null;
    }
  };

  return (
    <Modal title={![CrudModalType.CONFIRM_DELETE, CrudModalType.DELETE].includes(type) ? title : ''} open={isModalOpen} onClose={close} onCancel={close} footer={null} {...props}>
      {type === CrudModalType.CONFIRM_DELETE || type === CrudModalType.DELETE ? (
        <div className="flex flex-col items-center justify-center gap-y-2 py-4">
          <DeleteOutlined style={{ fontSize: '32px' }} />
          <p>{title}</p>
          <small className="mb-4 max-w-xs text-center">Data yang Anda hapus tidak dapat dipulihkan. Penghapusan ini juga akan berdampak pada data lain yang terkait.</small>
          <div className="flex items-center gap-x-2">
            <Button type="default" onClick={close}>
              Batal
            </Button>
            <Button danger type="primary" onClick={onSubmit} loading={isLoading}>
              Ya Hapus
            </Button>
          </div>
        </div>
      ) : (
        <Form form={form} layout="vertical" name="crudForm" className="mt-6 flex flex-col gap-y-2" onFinish={onSubmit} onValuesChange={handleValuesChange}>
          {formFields.map(({ renderIf, ...field }, index) => {
            if (renderIf && !renderIf(realtimeData)) return null;
            return (
              <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={field.rules} dependencies={field.dependencies}>
                {renderFormInput(field)}
              </Form.Item>
            );
          })}
          {type !== CrudModalType.SHOW && (
            <Form.Item className="mt-2">
              <div className="flex w-full items-center justify-end gap-x-2">
                <Button type="default" onClick={close}>
                  Batal
                </Button>
                {type === CrudModalType.DELETE ? (
                  <Button type="primary" danger htmlType="submit" loading={isLoading}>
                    Hapus
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Kirim
                  </Button>
                )}
              </div>
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}

CrudModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string,
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(Object.values(CrudModalType)),
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
