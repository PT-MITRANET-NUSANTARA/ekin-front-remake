import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VisionsService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import { Visions as VisionModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';

const Visions = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllVisions } = useService(VisionsService.getAll);
  const deleteVision = useService(VisionsService.delete);
  const storeVision = useService(VisionsService.store);
  const updateVision = useService(VisionsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllVisions.totalData });

  const fetchVisions = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchVisions();
  }, [fetchVisions, pagination.page, pagination.per_page, token]);

  const visions = getAllVisions.data ?? [];

  const column = [
    {
      title: 'Judul Visi',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Deksripsi',
      dataIndex: 'deskripsi',
      sorter: (a, b) => a.deskripsi.length - b.deskripsi.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VISION}`}
            model={VisionModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.VISION}`,
                formFields: formFields,
                data: record,
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateVision.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVisions({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.VISION}`}
            model={VisionModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VISION}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVision.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVisions({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.VISION}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeVision.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVisions({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.VISION} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllVisions.isLoading}>
          <DataTable data={visions} columns={column} loading={getAllVisions.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Visions;
