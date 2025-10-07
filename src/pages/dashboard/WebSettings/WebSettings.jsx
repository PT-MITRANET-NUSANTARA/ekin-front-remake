import { useAuth, useNotification, useService } from '@/hooks';
import { WebSettingsService } from '@/services';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Menu, Skeleton, TimePicker } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React from 'react';

const WebSettings = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllWebSettings } = useService(WebSettingsService.getAll);
  const storeSettings = useService(WebSettingsService.store);
  const [activeMenu] = React.useState('websettings');
  const [form] = useForm();

  const fetchWebSettings = React.useCallback(() => {
    execute({
      token: token
    });
  }, [execute, token]);

  React.useEffect(() => {
    fetchWebSettings();
  }, [fetchWebSettings, token]);

  const websettings = React.useMemo(() => getAllWebSettings.data ?? {}, [getAllWebSettings.data]);

  React.useEffect(() => {
    if (websettings) {
      form.setFieldsValue({
        ...websettings,
        default_harian_time_start: dayjs(websettings.default_harian_time_start),
        default_harian_time_end: dayjs(websettings.default_harian_time_end),
        default_break_time_start: dayjs(websettings.default_break_time_start),
        default_break_time_end: dayjs(websettings.default_break_time_end)
      });
    }
  }, [form, websettings]);

  const menuItems = [
    {
      label: 'Web Settings',
      key: 'websettings',
      icon: <SettingOutlined />
    }
  ];

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      default_harian_time_start: values.default_harian_time_start.format(),
      default_harian_time_end: values.default_harian_time_end.format(),
      default_break_time_start: values.default_break_time_start.format(),
      default_break_time_end: values.default_break_time_end.format()
    };
    const { isSuccess, message } = await storeSettings.execute(payload, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchWebSettings({ token: token });
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  return (
    <div className="w-full gap-4">
      <Card>
        <Skeleton loading={getAllWebSettings.isLoading}>
          <Menu selectedKeys={[activeMenu]} mode="horizontal" items={menuItems} />
          <div className="p-4">
            <Form layout="vertical" form={form} className="mt-4" onFinish={handleSubmit}>
              <Form.Item className="mb-2">
                <b>Data Web Settings</b>
              </Form.Item>
              <Form.Item label="Id Admin" name="admin_id" rules={[{ required: true, message: 'Field id admin harus diisi' }]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Harian Time Start" name="default_harian_time_start">
                <TimePicker size="large" format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item label="Harian Time End" name="default_harian_time_end">
                <TimePicker size="large" format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item label="Break Time Start" name="default_break_time_start">
                <TimePicker size="large" format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item label="Break Time End" name="default_break_time_end">
                <TimePicker size="large" format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item label="Total Minutes" name="default_total_minuetes">
                <Input size="large" type="number" className="w-full" />
              </Form.Item>

              <Form.Item label="Bupati ID" name="bupati_id">
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={storeSettings.isLoading}>
                  Simpan
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default WebSettings;
