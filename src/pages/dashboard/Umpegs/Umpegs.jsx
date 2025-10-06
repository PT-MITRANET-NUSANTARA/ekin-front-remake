import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { UmpegService, UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { unorFormFields } from './FormFields';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Umpegs = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllUmpegs } = useService(UmpegService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteUmpeg = useService(UmpegService.delete);
  const storeUmpeg = useService(UmpegService.store);
  const updateUmpeg = useService(UmpegService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllUmpegs.totalData });

  const navigate = useNavigate();

  const fetchUmpegs = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchUmpegs();
    fetchUnitKerja({ token: token });
  }, [fetchUmpegs, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const umpegs = getAllUmpegs.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Nama Unit',
      dataIndex: ['unit', 'nama_unor'],
      sorter: (a, b) => a.unit.nama_unor.length - b.unit.nama_unor.length,
      searchable: true
    },
    {
      title: 'Jabatan',
      dataIndex: 'jabatan',
      sorter: (a, b) => a.jabatan.length - b.jabatan.length,
      searchable: true,
      render: (record) => (
        <ol className="list-inside list-disc">
          {record.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.UMPEG}`}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.UMPEG}`,
                formFields: unorFormFields({ options: { unors: unitKerja } }),
                data: { ...record },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateUmpeg.execute(record.id, { ...values }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUmpegs({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.UMPEG}`}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.UMPEG}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteUmpeg.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUmpegs({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button icon={<DatabaseOutlined />} color="primary" variant="outlined" onClick={() => navigate(window.location.pathname + '/' + record.id)} />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.UMPEG}`,
      formFields: unorFormFields({ options: { unors: unitKerja } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeUmpeg.execute({ ...values, jabatan: [] }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchUmpegs({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.UMPEG} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllUmpegs.isLoading}>
          <DataTable data={umpegs} columns={column} loading={getAllUmpegs.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Umpegs;
