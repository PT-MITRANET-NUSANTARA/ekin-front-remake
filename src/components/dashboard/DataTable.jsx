import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, Radio, Space, Table } from 'antd';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

export default function DataTable({ columns, data, loading, title = '', handleSelectedData, map = (data) => data, pagination, ...props }) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const mappedData = useMemo(() => data.map(map), [data, map]);
  const [drawer, setDrawer] = useState({ open: false });
  const [tableSettings, setTableSettings] = useState({ bordered: false, size: 'small', showHeader: true });

  const columnsWithNumber = [
    {
      title: 'No',
      dataIndex: 'index',
      render: (_, __, index) => ((pagination?.page || 1) - 1) * (pagination?.per_page || 10) + (index + 1),
      width: '5%',
      fixed: 'left'
    },
    ...columns
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, customRender) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      const highlightText =
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        );

      // If there's a custom render function (like for the status), apply it here
      return customRender ? customRender(text, record) : highlightText;
    }
  });

  // Exclude the action column from search props
  const enhancedColumns = columnsWithNumber
    .filter((col) => col.searchable !== false) // Exclude non-searchable columns
    .map((col) => ({
      ...col,
      ...(col.searchable ? getColumnSearchProps(col.dataIndex, col.render) : {})
    }));

  const columnsWithTitle = title ? [{ title, children: enhancedColumns }] : enhancedColumns;

  return (
    <div className="relative w-full">
      <button onClick={() => setDrawer({ open: true })} className="absolute right-0 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-l-lg bg-[#5e9ea0]/40 transition-colors hover:bg-[#5e9ea0]/100">
        <SettingOutlined className="text-white" />
      </button>

      <Table
        showHeader={tableSettings.showHeader}
        size={tableSettings.size}
        rowSelection={handleSelectedData ? { type: 'checkbox', onChange: handleSelectedData } : undefined}
        columns={columnsWithTitle}
        dataSource={mappedData}
        loading={loading}
        bordered={tableSettings.bordered}
        pagination={
          pagination
            ? {
                current: pagination.page,
                pageSize: pagination.per_page,
                total: pagination.totalData,
                onChange: pagination.onChange
              }
            : false
        }
        {...props}
      />
      <span className="mb-2 block text-xs italic text-gray-500">
        table set as bordered:<b> {String(tableSettings.bordered)}</b>, size: <b>{String(tableSettings.size)}</b>, show header: <b>{String(tableSettings.showHeader)}</b> (you can always change this in table settings)
      </span>
      <Drawer open={drawer.open} onClose={() => setDrawer({ open: false })} title="Table Settings" width={300}>
        <b>Ukuran Table:</b>
        <Radio.Group
          key="table-size"
          className="my-2"
          onChange={(e) =>
            setTableSettings((prev) => ({
              ...prev,
              size: e.target.value
            }))
          }
          value={tableSettings.size}
        >
          <Radio value="small">Small</Radio>
          <Radio value="middle">Middle</Radio>
          <Radio value="large">Large</Radio>
        </Radio.Group>
        <hr className="my-2" />
        <b>Border Table:</b>
        <Radio.Group
          key="table-bordered"
          className="my-2"
          onChange={(e) =>
            setTableSettings((prev) => ({
              ...prev,
              bordered: e.target.value
            }))
          }
          value={tableSettings.bordered}
        >
          <Radio value={true}>Border</Radio>
          <Radio value={false}>Tanpa Border</Radio>
        </Radio.Group>
        <hr className="my-2" />
        <b>Header Table:</b>
        <Radio.Group
          key="table-show-header"
          className="my-2"
          onChange={(e) =>
            setTableSettings((prev) => ({
              ...prev,
              showHeader: e.target.value
            }))
          }
          value={tableSettings.showHeader}
        >
          <Radio value={true}>Tampilkan</Radio>
          <Radio value={false}>Sembunyikan</Radio>
        </Radio.Group>
        <hr className="my-2" />
      </Drawer>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    per_page: PropTypes.number.isRequired,
    totalData: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }),
  title: PropTypes.string,
  handleSelectedData: PropTypes.func,
  map: PropTypes.func
};
