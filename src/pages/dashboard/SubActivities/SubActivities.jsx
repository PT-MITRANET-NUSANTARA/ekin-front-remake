import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ActivitiesService, SubActivitiesService } from '@/services';
import { Button, Card, Space } from 'antd';
import React from 'react';
import { SubActivities as SubActivityModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { subActivitiesFormFields } from './FormFields';

const SubActivities = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllSubActivities } = useService(SubActivitiesService.getAll);
  const { execute: fetchActivities, ...getAllActivities } = useService(ActivitiesService.getAll);
  const deleteSubActivity = useService(SubActivitiesService.delete);
  const storeSubActivity = useService(SubActivitiesService.store);
  const updateSubActivity = useService(SubActivitiesService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllSubActivities.totalData });
  const navigate = useNavigate();

  const fetchSubActivities = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user ? user.unor.id : ''
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token, user]);

  React.useEffect(() => {
    fetchSubActivities();
    fetchActivities({ token: token });
  }, [fetchSubActivities, fetchActivities, pagination.page, pagination.per_page, token]);

  const subActivities = getAllSubActivities.data ?? [];
  const activities = getAllActivities.data ?? [];

  const column = [
    {
      title: 'Judul Sub Kegiatan',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Total Anggaran',
      dataIndex: 'total_anggaran',
      sorter: (a, b) => a.total_anggaran.length - b.total_anggaran.length,
      searchable: true,
      render: (record) => rupiahFormat(record, true)
    },
    {
      title: 'Nama Kegiatan',
      dataIndex: ['id_kegiatan', 'nama'],
      sorter: (a, b) => a.id_kegiatan.nama.length - b.id_kegiatan.nama.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.SUBACTIVITY}`}
            model={SubActivityModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.SUBACTIVITY}`,
                formFields: subActivitiesFormFields({ options: { activities: activities } }),
                data: { ...record, id_kegiatan: record.id_kegiatan.id },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateSubActivity.execute(record.id, { ...record, ...values, id_unit: record.id_unit.id_simpeg, id_kegiatan: values.id_kegiatan }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.SUBACTIVITY}`}
            model={SubActivityModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.SUBACTIVITY}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteSubActivity.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.SUBACTIVITY}`}
            model={SubActivityModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data kegiatan',
                data: [
                  {
                    key: 'nama',
                    label: `Judul ${Modul.SUBACTIVITY}`,
                    children: record.nama
                  },
                  {
                    key: 'total_anggaran',
                    label: `Total Anggaran`,
                    children: rupiahFormat(record.total_anggaran)
                  },
                  {
                    key: 'tujuan',
                    label: `Tujuan`,
                    children: record.id_tujuan.nama
                  }
                ]
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
      title: `Tambah ${Modul.SUBACTIVITY}`,
      formFields: subActivitiesFormFields({ options: { activities: activities } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeSubActivity.execute({ ...values, id_unit: user?.unor?.id, indikator_kinerja: [] }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSubActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.SUBACTIVITY} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={subActivities} columns={column} loading={getAllSubActivities.isLoading} pagination={pagination} />
      </div>
    </Card>
  );
};

export default SubActivities;
