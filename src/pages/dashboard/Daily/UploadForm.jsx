/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Form, Radio, Upload, Input, Button } from 'antd';
import { UploadOutlined, LinkOutlined } from '@ant-design/icons';
import React from 'react';

export const UploadForm = ({
  record,
  token,
  updateHarian,
  fetchDaily,
  pagination,
  filterValues = {},
  success,
  error,
  modal // ✅ tambahkan modal dari parent
}) => {
  const [form] = Form.useForm();
  const [uploadType, setUploadType] = React.useState('files');

  const handleUpdateLampiran = async (values) => {
    let payload = {};

    if (uploadType === 'files' && values.files?.fileList?.length) {
      payload = { file: values.files.fileList };
    } else if (uploadType === 'link' && values.tautan) {
      payload = { tautan: values.tautan };
    }

    const { isSuccess, message } = await updateHarian.execute(record.id, payload, token);

    if (isSuccess) {
      success('Berhasil', message);

      // 🔁 Fetch ulang data
      fetchDaily({
        token,
        page: pagination.page,
        per_page: pagination.per_page,
        search: filterValues?.search,
        unit_id: filterValues?.unit_id,
        user_id: filterValues?.user,
        date: filterValues?.date
      });

      // 🧹 Bersihkan form dan tutup modal
      form.resetFields();
      modal?.close?.();
    } else {
      error('Gagal', message);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdateLampiran}>
      <Form.Item label="Jenis Lampiran">
        <Radio.Group value={uploadType} onChange={(e) => setUploadType(e.target.value)} style={{ marginBottom: 16 }}>
          <Radio value="files">File</Radio>
          <Radio value="link">Tautan</Radio>
        </Radio.Group>

        {uploadType === 'files' && (
          <Form.Item name="files" noStyle>
            <Upload.Dragger multiple beforeUpload={() => false} listType="picture">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Klik atau seret file ke area ini untuk mengunggah</p>
            </Upload.Dragger>
          </Form.Item>
        )}

        {uploadType === 'link' && (
          <Form.Item name="tautan" rules={[{ type: 'url', message: 'Format tautan tidak valid' }]}>
            <Input prefix={<LinkOutlined />} placeholder="Masukkan tautan" />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={updateHarian.isLoading} className="w-full">
          Simpan
        </Button>
      </Form.Item>
    </Form>
  );
};

// ✅ PropTypes untuk validasi props
UploadForm.propTypes = {
  record: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  updateHarian: PropTypes.shape({
    execute: PropTypes.func.isRequired
  }).isRequired,
  fetchDaily: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    per_page: PropTypes.number
  }).isRequired,
  filterValues: PropTypes.shape({
    search: PropTypes.string,
    unit_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string
  }), // ✅ opsional
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
  modal: PropTypes.shape({
    close: PropTypes.func
  })
};
