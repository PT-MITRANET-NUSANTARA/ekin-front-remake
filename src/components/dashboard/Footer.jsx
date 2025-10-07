import { Footer as AntdFooter } from 'antd/es/layout/layout';

const Footer = () => {
  return (
    <AntdFooter style={{ textAlign: 'center' }}>
      SID ©{new Date().getFullYear()} Created by <a href="https://instagram.com/msib7.kominfobpsdm">EKIN Team</a>
    </AntdFooter>
  );
};

export default Footer;
