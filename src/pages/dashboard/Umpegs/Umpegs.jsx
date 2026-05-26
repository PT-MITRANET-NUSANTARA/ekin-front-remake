import { useAuth, usePagination, useService } from '@/hooks';
import { UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Umpegs = () => {
  const { token } = useAuth();
  const { execute, ...getAllUmpegs } = useService(UnitKerjaService.getAll);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllUmpegs.totalData });

  const navigate = useNavigate();

  const fetchUmpegs = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchUmpegs();
  }, [fetchUmpegs, pagination.page, pagination.per_page, token]);

  const umpegs = getAllUmpegs.data ?? [];

  const column = [
    {
      title: 'Unit Organisasi',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<DatabaseOutlined />} color="primary" variant="outlined" onClick={() => navigate(window.location.pathname + '/' + record.id)} />
        </Space>
      )
    }
  ];

  return (
    <>
      <PageExplanation title={`${Modul.UMPEG}`} subTitle={'Kelola dan atur data umpeg dengan mudah. Klik ikon basis data untuk melihat detail.'} />
      <Card title={<DataTableHeader modul={Modul.UMPEG} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllUmpegs.isLoading}>
            <DataTable data={umpegs} columns={column} loading={getAllUmpegs.isLoading} map={(record) => ({ key: record.id, ...record })} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Umpegs;
