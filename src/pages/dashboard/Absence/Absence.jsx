import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AbsenceService } from '@/services';
import { Card, List, Skeleton, Space, Tag } from 'antd';
import React from 'react';
import { Absence as AbsenceModel } from '@/models';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';
import dayjs from 'dayjs';
import { AbsenceStatus } from '@/constants/AbsenceStatus';

const getStatusColor = (status) => {
  switch (status) {
    case AbsenceStatus.HADIR:
      return 'success';
    case AbsenceStatus.SAKIT:
      return 'warning';
    case AbsenceStatus.IZIN:
      return 'processing';
    case AbsenceStatus.ALPHA:
      return 'error';
    case AbsenceStatus.TANPA_KETERANGAN:
      return 'default';
    case AbsenceStatus.DINAS:
      return 'blue';
    default:
      return 'default';
  }
};

const Absence = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllAbsence } = useService(AbsenceService.getAll);
  const deleteAbsence = useService(AbsenceService.delete);
  const storeAbsence = useService(AbsenceService.store);
  const updateAbsence = useService(AbsenceService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllAbsence.totalData });

  const fetchAbsence = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user ? user.unor.id : ''
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token, user]);

  React.useEffect(() => {
    fetchAbsence();
  }, [fetchAbsence, pagination.page, pagination.per_page]);

  const absences = getAllAbsence.data ?? [];
  


  const column = [
    {
      title: 'NIP',
      dataIndex: 'id_user',
      sorter: (a, b) => a.id_user.localeCompare(b.id_user),
      searchable: true
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      sorter: (a, b) => new Date(a.tanggal) - new Date(b.tanggal),
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      sorter: (a, b) => a.status.localeCompare(b.status),
      searchable: true
    },

    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      ellipsis: true,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title="Edit Absensi"
            model={AbsenceModel}
            onClick={() => {
              modal.edit({
                title: "Ubah Absensi",
                formFields: formFields({ options: {} }),
                data: { ...record, tanggal: dayjs(record.tanggal) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateAbsence.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAbsence();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title="Delete Absensi"
            model={AbsenceModel}
            onClick={() => {
              modal.delete.default({
                title: "Delete Absensi",
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteAbsence.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAbsence();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title="Detail Absensi"
            model={AbsenceModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data absensi',
                data: [
                  {
                    key: 'id_user',
                    label: 'NIP',
                    children: record.id_user
                  },
                  {
                    key: 'tanggal',
                    label: 'Tanggal',
                    children: record.tanggal
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    children: <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
                  },

                  {
                    key: 'keterangan',
                    label: 'Keterangan',
                    children: record.keterangan
                  }
                ]
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: "Tambah Absensi",
      formFields: formFields({ options: {} }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeAbsence.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAbsence();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul="Absensi" onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllAbsence.isLoading}>
          <DataTable 
            data={absences} 
            columns={column} 
            loading={getAllAbsence.isLoading} 
            map={(absence) => ({ key: absence.id, ...absence })} 
            pagination={pagination} 
          />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Absence;