import { useAuth, usePagination, useService } from '@/hooks';
import { JptService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Jpts = () => {
  const { token } = useAuth();
  const { execute, ...getAllJpts } = useService(JptService.getAll);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllJpts.totalData });

  const navigate = useNavigate();

  const fetchJpts = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchJpts();
  }, [fetchJpts, pagination.page, pagination.per_page, token]);

  const jpts = getAllJpts.data ?? [];

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
      <PageExplanation title={`${Modul.JPTS}`} subTitle={'Kelola dan atur data manajemen pimpinan dengan mudah. Klik ikon basis data untuk melihat detail.'} />
      <Card title={<DataTableHeader modul={Modul.JPTS} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllJpts.isLoading}>
            <DataTable data={jpts} columns={column} loading={getAllJpts.isLoading} map={(record) => ({ key: record.id, ...record })} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Jpts;
