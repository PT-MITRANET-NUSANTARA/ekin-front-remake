import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="mx-auto flex min-h-screen w-full max-w-screen-xl items-center">
        <div className="flex w-full flex-col gap-y-2">
          <Typography.Title>E-Kinerja Kab. Pohuwato</Typography.Title>
          <p className="mb-4 text-gray-600">Aplikasi untuk memantau, menilai, dan melaporkan kinerja aparatur Pemerintah Kabupaten Pohuwato secara digital dan transparan.</p>
          <Button onClick={() => navigate('/auth/login')} size="large" variant="solid" color="primary" className="w-fit">
            Masuk untuk mulai
          </Button>
        </div>
        <div className="flex w-full items-center justify-center">
          <img src="/image_asset/ekin_logo.png" className="w-1/2" />
        </div>
      </section>
    </>
  );
};

export default Home;
