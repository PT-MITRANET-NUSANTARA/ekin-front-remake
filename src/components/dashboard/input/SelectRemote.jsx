import { Select, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks';
import { fetchAllPaginatedData } from '@/utils/fetchAllPaginatedData';

/**
 * Select component that fetches all paginated data from a remote service
 * Useful for dropdowns with many options (>10 items per page)
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the select
 * @param {Function} props.fetchFn - Async function(params) that returns { data, pagination }
 * @param {Function} props.mapOptions - Function to map API data to select options (default: item => ({ label: item.name, value: item.id }))
 * @param {Object} props.filterParams - Additional filter parameters to pass to fetchFn
 * @param {number} props.perPage - Items per page for pagination (default: 100)
 * @param {boolean} props.readOnly - Whether the select is disabled
 * @param {any} props.value - Form value (injected by Form.Item)
 * @param {Function} props.onChange - Change handler (injected by Form.Item)
 */
export default function SelectRemote({
  label,
  fetchFn,
  mapOptions,
  filterParams = {},
  perPage = 100,
  readOnly = false,
  value,
  onChange,
  ...rest
}) {
  const { token } = useAuth();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!token || !fetchFn) {
      setOptions([]);
      return;
    }

    const loadAllOptions = async () => {
      try {
        setLoading(true);
        const allData = await fetchAllPaginatedData(
          (params) => fetchFn({ ...params, token }),
          filterParams,
          perPage
        );

        if (!mountedRef.current) return;

        // Map data to options
        const mapped = allData.map(mapOptions ? mapOptions : (item) => ({
          label: item.name || item.nama,
          value: item.id
        }));

        setOptions(mapped);
      } catch (err) {
        console.error('Error loading remote select options:', err);
        if (mountedRef.current) {
          setOptions([]);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadAllOptions();
  }, [token, fetchFn, mapOptions, filterParams, perPage]);

  const disabled = readOnly || loading;

  return (
    <Select
      size="large"
      placeholder={`Pilih ${label || ''}`}
      disabled={disabled}
      options={options}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      loading={loading}
      value={value}
      onChange={onChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...rest}
    />
  );
}

SelectRemote.propTypes = {
  label: PropTypes.string,
  fetchFn: PropTypes.func.isRequired,
  mapOptions: PropTypes.func,
  filterParams: PropTypes.object,
  perPage: PropTypes.number,
  readOnly: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func
};
