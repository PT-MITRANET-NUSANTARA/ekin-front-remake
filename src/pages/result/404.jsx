import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Maaf, Halaman yang anda akses tidak tersedia."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Beranda
          </Button>
        }
      />
    </div>
  );
};

export default Notfound;
