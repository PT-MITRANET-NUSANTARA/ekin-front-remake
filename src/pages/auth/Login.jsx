import { useAuth, useNotification } from '@/hooks';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, isLoading } = useAuth();
  const { error } = useNotification();
  const [passwordVisible, setPasswordVisible] = useState(false);

  /**
   * @param {{
   *   email: string;
   *   password: string;
   *   remember: boolean;
   * }} values
   */
  const onFinish = async (values) => {
    const { isSuccess, message } = await login(values.email, values.password);
    if (!isSuccess) return error('Gagal', message);
  };

  return (
    <Card className="w-full max-w-md px-4">
      <div className="mb-5 mt-4 flex w-full flex-col items-center justify-center gap-y-2">
        <div className="mb-4 flex flex-col items-center justify-center gap-y-2 text-center">
          <h1 className="text-xl font-semibold">Selamat Datang!</h1>
          <p className="max-w-xs text-xs">Sistem Informasi berbasis website untuk memenuhi kebutuhan pengelolaan manajemen</p>
        </div>
      </div>
      <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Mohon masukkan username!'
            }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
        </Form.Item>
        <Form.Item label="Kata Sandi">
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Mohon masukkan kata sandi!'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Kata Sandi"
              size="large"
              suffix={passwordVisible ? <EyeOutlined onClick={() => setPasswordVisible(false)} /> : <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} />}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button block loading={isLoading} type="primary" htmlType="submit" size="large">
            Masuk
          </Button>
        </Form.Item>
        <Form.Item>
          <span className="m-0 block text-center">
            Bukan admin? Silahkan{' '}
            <Link className="text-color-primary-500 hover:text-color-primary-200 font-bold underline" to="/">
              Kembali ke beranda
            </Link>
          </span>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
