import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AbsenceService, UserService } from '@/services';
import { Card, Skeleton, Space, Tag, Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import React from 'react';
import { Absence as AbsenceModel } from '@/models';
import { DataTable, DataTableHeader } from '@/components';
import { formFields, absenceFilterFields } from './FormFields';
import dayjs from 'dayjs';
import { AbsenceStatus } from '@/constants/AbsenceStatus';
import { useNavigate } from 'react-router-dom';
import { InputType } from '@/constants';

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
  const navigate = useNavigate();
  const { execute, ...getAllAbsence } = useService(AbsenceService.getAll);
  const deleteAbsence = useService(AbsenceService.delete);
  const storeAbsence = useService(AbsenceService.store);
  const updateAbsence = useService(AbsenceService.update);
  const { execute: executeGetUsers, ...getUsersByUnit } = useService(UserService.getUsersByUnit);
  const [filterValues, setFilterValues] = React.useState({
    search: '',
    id_user: user?.isAdmin || user?.umpegs?.length ? '' : user?.nipBaru
  });
  const pagination = usePagination({ totalData: getAllAbsence.totalData });
  const [users, setUsers] = React.useState([]);

  // Fungsi untuk navigasi ke halaman data harian
  const navigateToHarian = (userId, date) => {
    // Navigasi ke halaman data harian dengan parameter user_id dan date
    navigate(`/dashboard/harian?user_id=${userId}&date=${date}`);
  };

  const fetchAbsence = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user ? user.unor.id : '',
      user_id: user?.isAdmin || user?.umpegs?.length ? filterValues.id_user : user?.nipBaru
    });
  }, [execute, filterValues.search, filterValues.id_user, pagination.page, pagination.per_page, token, user]);

  const fetchUsers = React.useCallback(() => {
    if (user && user.unor && user.unor.id) {
      executeGetUsers({
        token: token,
        unitId: user.unor.id,
        search: '',
        page: 1,
        perPage: 100
      });
    }
  }, [executeGetUsers, token, user]);

  React.useEffect(() => {
    fetchAbsence();
    fetchUsers();
  }, [fetchAbsence, fetchUsers, pagination.page, pagination.per_page]);

  React.useEffect(() => {
    if (getUsersByUnit.data) {
      setUsers(getUsersByUnit.data);
    }
  }, [getUsersByUnit.data]);

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
                title: 'Ubah Absensi',
                formFields: formFields({ options: { users } }),
                data: { ...record, tanggal: dayjs(record.tanggal) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateAbsence.execute(record.id, { ...values, id_unit: user.unor.id, tanggal: values.tanggal.format('YYYY-MM-DD') }, token);
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
                title: 'Delete Absensi',
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
          <Button type="text" size="small" icon={<CalendarOutlined />} title="Aksi Harian" onClick={() => navigateToHarian(record.id_user, record.tanggal)} />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: 'Tambah Absensi',
      formFields: formFields({ options: { users } }),
      onSubmit: async (values) => {
        const formatted = {
          ...values,
          tanggal: values.tanggal.format('YYYY-MM-DD'),
          id_unit: user.unor.id
        };

        const { isSuccess, message } = await storeAbsence.execute(formatted, token);
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

  // Filter configuration
  const filter = {
    formFields: [
      ...(user?.isAdmin || user?.umpegs?.length
        ? [
            {
              label: `Pegawai`,
              name: 'id_user',
              type: InputType.SELECT,
              options: users.map((item) => ({
                label: `${item.nama} (${item.nip_baru})`,
                value: item.nip_baru
              }))
            }
          ]
        : [])
    ],
    initialData: {
      id_user: filterValues.id_user
    },
    isLoading: getAllAbsence.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        id_user: user?.isAdmin || user?.umpegs?.length ? values.id_user : user?.nipBaru
      });
    }
  };

  return (
    <Card>
      <DataTableHeader 
        modul="Absensi" 
        filter={filter} 
        onStore={onCreate} 
        onSearch={(values) => setFilterValues({ ...filterValues, search: values })} 
      />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllAbsence.isLoading}>
          <DataTable data={absences} columns={column} loading={getAllAbsence.isLoading} map={(absence) => ({ key: absence.id, ...absence })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Absence;
