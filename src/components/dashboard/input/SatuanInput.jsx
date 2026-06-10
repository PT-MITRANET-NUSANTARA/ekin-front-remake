import { AutoComplete } from 'antd';
import { SATUAN_LIST } from '@/constants/Satuan';
import PropTypes from 'prop-types';

export default function SatuanInput({
  value,
  onChange,
  readOnly = false,
  ...rest
}) {
  const options = SATUAN_LIST.map((satuan) => ({
    label: satuan.label,
    value: satuan.value
  }));

  return (
    <AutoComplete
      placeholder="Masukan atau pilih satuan"
      size="large"
      disabled={readOnly}
      value={value}
      onChange={onChange}
      options={options}
      filterOption={(inputValue, option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      }
      {...rest}
    />
  );
}

SatuanInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
};
