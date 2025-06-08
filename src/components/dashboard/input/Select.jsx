import strings from '@/utils/strings';
import { Select as SelectComponent } from 'antd';
import PropTypes from 'prop-types';

/**
 * @param {import('@/types').FormField} props
 */
export default function Select({ label, readOnly = false, options = [], ...props }) {
  if (readOnly) {
    props.style = { pointerEvents: 'none' };
  }
  return <SelectComponent filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} size="large" placeholder={strings('select_s', label)} readOnly={readOnly} options={options} {...props} />;
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ),
  readOnly: PropTypes.bool
};
