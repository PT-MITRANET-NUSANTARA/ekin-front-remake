import { Action } from '@/constants';
import { useAuth } from '@/hooks';
import strings from '@/utils/strings';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

export default function Edit({ title = strings('edit'), onClick, model, action = Action.UPDATE }) {
  const { user } = useAuth();
  if (action !== Action.NONE && (!user || user.cant(action, model))) return null;

  return (
    <Tooltip title={title}>
      <Button variant="outlined" color="primary" icon={<EditOutlined />} onClick={onClick} />
    </Tooltip>
  );
}

Edit.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  action: PropTypes.oneOf(Object.values(Action))
};
