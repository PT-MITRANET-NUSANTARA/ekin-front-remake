import { Action } from '@/constants';
import { useAuth } from '@/hooks';
import strings from '@/utils/strings';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

export default function Verify({ title = strings('verify'), onClick, model, action = Action.VERIFY }) {
  const { user } = useAuth();
  if (action !== Action.NONE && (!user || user.cant(action, model))) return null;

  return (
    <Tooltip title={title}>
      <Button type="primary" className="outlined" onClick={onClick} size="middle" icon={<CheckOutlined />} />
    </Tooltip>
  );
}

Verify.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  action: PropTypes.oneOf(Object.values(Action))
};
