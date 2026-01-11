import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ActivitiesService, ProgramsService, UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import { Activities as ActivityModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { activiesFilterFields, activitiesFormFields } from './FormFields';
import { InputType } from '@/constants';

const Activities = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllActivities } = useService(ActivitiesService.getAll);
  const { execute: fetchPrograms, ...getAllGoals } = useService(ProgramsService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteActivity = useService(ActivitiesService.delete);
  const storeActivity = useService(ActivitiesService.store);
  const updateActivity = useService(ActivitiesService.update);
  const [filterValues, setFilterValues] = React.useState({
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    search: ''
  });
  const pagination = usePagination({ totalData: getAllActivities.totalData });
  const navigate = useNavigate();

  const fetchActivities = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.umpegs, user?.unor.id]);

  React.useEffect(() => {
    fetchActivities();
    fetchPrograms({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchActivities, fetchPrograms, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const activities = getAllActivities.data ?? [];
  const programs = getAllGoals.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Judul Kegiatan',
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
      title: 'Nama Program',
      dataIndex: ['id_program', 'nama'],
      sorter: (a, b) => a.id_program.nama.length - b.id_program.nama.length,
      searchable: true
    },
    {
      title: 'Unit ',
      dataIndex: ['id_unit', 'nama_unor'],
      sorter: (a, b) => a.id_unit.nama_unor.length - b.id_unit.nama_unor.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ACTIVITY}`}
            model={ActivityModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.ACTIVITY}`,
                formFields: activitiesFormFields({ options: { programs: programs } }),
                data: { ...record, id_program: record.id_program.id },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateActivity.execute(record.id, { ...record, ...values, id_unit: record.id_unit.id_simpeg }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.ACTIVITY}`}
            model={ActivityModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ACTIVITY}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteActivity.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.ACTIVITY}`}
            model={ActivityModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data kegiatan',
                data: [
                  {
                    key: 'id_unit',
                    label: `Unit Kerja`,
                    children: record.id_unit.nama_unor
                  },
                  {
                    key: 'nama',
                    label: `Judul ${Modul.ACTIVITY}`,
                    children: record.nama
                  },
                  {
                    key: 'total_anggaran',
                    label: `Total Anggaran`,
                    children: rupiahFormat(record.total_anggaran)
                  },
                  {
                    key: 'tujuan',
                    label: `Program`,
                    children: record.id_program.nama
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
      title: `Tambah ${Modul.ACTIVITY}`,
      formFields: [
        ...activitiesFormFields({ options: { programs: programs } }),
        ...(user?.isAdmin || user?.umpegs?.length
          ? [
              {
                label: `Nama Unit`,
                name: 'unit_id',
                type: InputType.SELECT,
                rules: [
                  {
                    required: true,
                    message: `Nama Unit harus diisi`
                  }
                ],
                options: user?.isAdmin
                  ? unitKerja.map((item) => ({
                      label: item.nama_unor,
                      value: item.id_simpeg
                    }))
                  : user.umpegs.map((item) => ({
                      label: item.unit.nama_unor,
                      value: item.unit.id_simpeg
                    }))
              }
            ]
          : [])
      ],
      onSubmit: async (values) => {
        const payload = {
          ...values,
          indikator_kinerja: [],
          id_unit: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user.unor.id
        };
        const { isSuccess, message } = await storeActivity.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchActivities({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: [
      ...activiesFilterFields(),
      ...(user?.isAdmin || user?.umpegs?.length
        ? [
            {
              label: `Nama Unit`,
              name: 'unit_id',
              type: InputType.SELECT,
              mode: 'multiple',
              options: user?.isAdmin
                ? unitKerja.map((item) => ({
                    label: item.nama_unor,
                    value: item.id_simpeg
                  }))
                : user.umpegs.map((item) => ({
                    label: item.unit.nama_unor,
                    value: item.unit.id_simpeg
                  }))
            }
          ]
        : [])
    ],
    initialData: {
      unit_id: filterValues.unit_id
    },
    isLoading: getAllActivities.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader filter={filter} modul={Modul.ACTIVITY} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllActivities.isLoading}>
          <DataTable data={activities} columns={column} loading={getAllActivities.isLoading} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Activities;
