import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { GoalsService, ProgramsService, UnitKerjaService } from '@/services';
import { Button, Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import { Programs as ProgramModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { programFormFields } from './FormFields';
import { InputType, Role } from '@/constants';

const Programs = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllPrograms } = useService(ProgramsService.getAll);
  const { execute: fetchGoals, ...getAllGoals } = useService(GoalsService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deletePrograms = useService(ProgramsService.delete);
  const storePrograms = useService(ProgramsService.store);
  const updatePrograms = useService(ProgramsService.update);
  const [filterValues, setFilterValues] = React.useState({
    search: ''
    // unit_id: user?.isRole(Role.ADMIN) ? [] : user?.unor.id,
  });
  const pagination = usePagination({ totalData: getAllPrograms.totalData });
  const navigate = useNavigate();

  const fetchPrograms = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
      // unit_id: user?.isRole(Role.ADMIN) ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchPrograms();
    fetchGoals({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchPrograms, fetchGoals, pagination.page, pagination.per_page, token, fetchUnitKerja]);

  const programs = getAllPrograms.data ?? [];
  const goals = getAllGoals.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Judul Program',
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
      title: 'Nama Tujuan',
      dataIndex: ['tujuan', 'nama'],
      sorter: (a, b) => a.tujuan.nama.length - b.tujuan.nama.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.PROGRAM}`}
            model={ProgramModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.PROGRAM}`,
                formFields: programFormFields({ options: { goals: goals } }),
                data: { ...record, id_tujuan: record.id_tujuan.id },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updatePrograms.execute(record.id, { ...record, ...values, id_unit: record.id_unit.id_simpeg, id_tujuan: values.id_tujuan }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPrograms({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.PROGRAM}`}
            model={ProgramModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.PROGRAM}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePrograms.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPrograms({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.PROGRAM}`}
            model={ProgramModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data program',
                data: [
                  {
                    key: 'nama',
                    label: `Judul ${Modul.PROGRAM}`,
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
                  },
                  {
                    key: 'indikator',
                    label: `Indikator Kinerja ${Modul.PROGRAM}`,
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
      title: `Tambah ${Modul.PROGRAM}`,
      formFields: [
        ...programFormFields({ options: { goals: goals } }),
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
        const { isSuccess, message } = await storePrograms.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPrograms({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  // const filter = {
  //   formFields: [
  //     ...programsFilterFields(),
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
  //   isLoading: getAllPrograms.isLoading,
  //   onSubmit: (values) => {
  //     setFilterValues({
  //       ...filterValues,
  //       unit_id: user.isRole(Role.ADMIN) ? values.unit_id : user?.unor.id
  //     });
  //   }
  // };

  return (
    <>
      <PageExplanation title={Modul.PROGRAM} subTitle={'Kelola dan atur data program dengan mudah. Tambahkan, ubah, atau hapus program agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader modul={Modul.PROGRAM} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllPrograms.isLoading}>
            <DataTable data={programs} columns={column} loading={getAllPrograms.isLoading} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Programs;
