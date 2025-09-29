import { useStyle } from '@/hooks';
import { ConfigProvider as StyleProvider } from 'antd';
import PropTypes from 'prop-types';

export default function AntdConfigProviders({ children }) {
  const { styles } = useStyle();
  return (
    <StyleProvider
      theme={{
        token: {
          fontFamily: 'Plus Jakarta Sans',
          colorPrimary: '#5e9ea0',
          colorInfo: '#3ab7f2',
          colorSuccess: '#84bf31',
          colorWarning: '#ff9b44',
          colorError: '#ff607d'
        }
      }}
      button={{
        className: styles.customButton
      }}
      drawer={{
        padding: 0
      }}
    >
      {children}
    </StyleProvider>
  );
}
AntdConfigProviders.propTypes = {
  children: PropTypes.node.isRequired
};
