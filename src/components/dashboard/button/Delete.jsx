import { Action } from '@/constants';
import { useAuth } from '@/hooks';
import strings from '@/utils/strings';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

export default function Delete({ title = strings('delete'), onClick, model, action = Action.DELETE }) {
  const { user } = useAuth();
  if (action !== Action.NONE && (!user || user.cant(action, model))) return null;
  return (
    <Tooltip title={title}>
      <Button variant="outlined" color="danger" icon={<DeleteOutlined />} onClick={onClick} />
    </Tooltip>
  );
}

Delete.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  action: PropTypes.oneOf(Object.values(Action))
};
