import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ActivitiesService, ProgramsService, UnitKerjaService } from '@/services';
import { Button, Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import { Activities as ActivityModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { activitiesFormFields } from './FormFields';
import { InputType, Role } from '@/constants';

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
    search: ''
    // unit_id: user?.isRole(Role.ADMIN) ? [] : user?.unor.id,
  });
  const pagination = usePagination({ totalData: getAllActivities.totalData });
  const navigate = useNavigate();

  const fetchActivities = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
      // unit_id: user?.isRole(Role.ADMIN) ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

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
      dataIndex: ['program', 'nama'],
      sorter: (a, b) => a.program.nama.length - b.program.nama.length,
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
                  },
                  {
                    key: 'indikator',
                    label: `Indikator Kinerja ${Modul.ACTIVITY}`,
                    children: (
                      <>
                        <List
                          size="small"
                          bordered
                          dataSource={record.indikator_kinerja}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta title={item.nama} description={`Target : ${item.target}, Satuan: ${item.satuan}`} />
                            </List.Item>
                          )}
                        />
                      </>
                    )
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
        ...(user.canAccess({ roles: [Role.ADMIN] })
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
                options: unitKerja.map((item) => ({
                  label: item.name,
                  value: item.id
                }))
              }
            ]
          : [])
      ],
      onSubmit: async (values) => {
        const payload = {
          ...values,
          indikator_kinerja: [],
          id_unit: user?.isRole(Role.ADMIN) ? values.unit_id : user?.unor.id,
          total_anggaran: parseInt(values.total_anggaran)
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

  // const filter = {
  //   formFields: [
  //     ...activiesFilterFields(),
  //     ...(user?.canAccess({ roles: [Role.ADMIN] })
  //       ? [
  //         {
  //           label: `Nama Unit`,
  //           name: 'unit_id',
  //           type: InputType.SELECT,
  //           options: unitKerja.map((item) => ({
  //             label: item.name,
  //             value: item.id
  //           }))
  //         }
  //       ]
  //       : [])
  //   ],
  //   initialData: {
  //     unit_id: filterValues.unit_id
  //   },
  //   isLoading: getAllActivities.isLoading,
  //   onSubmit: (values) => {
  //     setFilterValues({
  //       ...filterValues,
  //       unit_id: user.isRole(Role.ADMIN) ? values.unit_id : user?.unor.id
  //     });
  //   }
  // };

  return (
    <>
      <PageExplanation title={Modul.ACTIVITY} subTitle={'Kelola dan atur data aktivitas dengan mudah. Tambahkan, ubah, atau hapus aktivitas agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader modul={Modul.ACTIVITY} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllActivities.isLoading}>
            <DataTable data={activities} columns={column} loading={getAllActivities.isLoading} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Activities;
