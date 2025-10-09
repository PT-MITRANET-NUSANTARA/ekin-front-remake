/* eslint-disable no-unused-vars */
import { Select, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks';

export default function SelectWithParent({
  form,
  field,
  parentName,
  fetchOptions,
  mapOptions,
  readOnly,
  value, // Form.Item akan injek nilai ini
  onChange, // Form.Item akan injek onChange ini
  ...rest
}) {
  const { token } = useAuth();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const prevParentRef = useRef();
  // gunakan useWatch untuk memantau perubahan parent
  const parentValue = Form.useWatch(parentName, form);

  useEffect(() => {
    let mounted = true;
    // jika parent berubah dan sebelumnya ada value child -> reset child
    if (prevParentRef.current !== undefined && prevParentRef.current !== parentValue) {
      form.setFieldsValue({ [field.name]: undefined });
    }
    prevParentRef.current = parentValue;

    // set options sesuai parentValue
    if (!parentValue) {
      setOptions([]);
      setLoading(false);
      return;
    }

    if (typeof fetchOptions === 'function') {
      setLoading(true);
      (async () => {
        try {
          const res = await fetchOptions({ token, parentValue });
          if (!mounted) return;
          const mapped = (res?.data || res)?.map ? (res.data || res).map(mapOptions ? mapOptions : (item) => ({ label: item.name, value: item.id })) : [];
          setOptions(mapped);
        } catch (err) {
          // optional: handle/log error
          setOptions([]);
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    } else {
      setOptions([]);
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [parentValue, fetchOptions, mapOptions, token, form, field.name]);

  const disabled = !parentValue || readOnly;

  return <Select size="large" placeholder={`Pilih ${field.label}`} disabled={disabled} options={options} showSearch filterOption={false} loading={loading} value={value} onChange={onChange} {...(field.extra || {})} {...rest} />;
}

SelectWithParent.propTypes = {
  form: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  parentName: PropTypes.string.isRequired,
  fetchOptions: PropTypes.func,
  mapOptions: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func
};
