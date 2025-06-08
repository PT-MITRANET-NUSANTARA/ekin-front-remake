import { useStyle } from '@/hooks';
import { ConfigProvider as StyleProvider } from 'antd';
import PropTypes from 'prop-types';

export default function AntdConfigProviders({ children }) {
  const { styles } = useStyle();
  return (
    <StyleProvider
      theme={{
        token: {
          fontFamily: 'Plus Jakarta Sans'
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
