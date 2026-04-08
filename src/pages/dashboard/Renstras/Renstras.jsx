import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { MissionsService, RenstrasService, UnitKerjaService } from '@/services';
import { Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import { Renstras as RenstraModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { formFields } from './FormFields';
import dayjs from 'dayjs';
import { CheckCircleFilled } from '@ant-design/icons';
import { InputType, Role } from '@/constants';
import dateFormatter from '@/utils/dateFormatter';

const Renstras = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchMissions, ...getAllMissions } = useService(MissionsService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteRenstras = useService(RenstrasService.delete);
  const storeRenstras = useService(RenstrasService.store);
  const updateRenstras = useService(RenstrasService.update);
  const [filterValues, setFilterValues] = React.useState({
    search: ''
    // unit_id: user?.isRole(Role.ADMIN) ? [] : user?.unor.id,
  });
  const pagination = usePagination({ totalData: getAllRenstras.totalData });

  const fetchRenstras = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
      // unitId: user?.isRole(Role.ADMIN) ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    if (user) {
      fetchRenstras();
    }
    fetchMissions({ token: token });
    fetchUnitKerja({ token: token, search: '' });
  }, [fetchMissions, fetchRenstras, fetchUnitKerja, pagination.page, pagination.per_page, token, user]);

  const renstras = getAllRenstras.data ?? [];
  const missions = getAllMissions.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'deskripsi',
      sorter: (a, b) => a.deskripsi.length - b.deskripsi.length,
      searchable: true
    },
    {
      title: 'Periode Mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true,
      render: (record) => dateFormatter(record)
    },
    {
      title: 'Periode Selesai',
      dataIndex: 'tanggal_selesai',
      sorter: (a, b) => a.tanggal_selesai.length - b.tanggal_selesai.length,
      searchable: true,
      render: (record) => dateFormatter(record)
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.RENSTRA}`}
            model={RenstraModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.RENSTRA}`,
                formFields: formFields({ options: { missions: missions } }),
                data: { ...record, tanggal_mulai: dayjs(record.tanggal_mulai), tanggal_selesai: dayjs(record.tanggal_selesai), ids_misi: record.ids_misi.map((item) => ({ label: item.nama, value: item.id })) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateRenstras.execute(
                    record.id,
                    {
                      ...values,
                      tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DD'),
                      tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DD')
                    },
                    token
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRenstras({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.RENSTRA}`}
            model={RenstraModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RENSTRA}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteRenstras.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRenstras({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.RENSTRA}`}
            model={RenstraModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data rencana strategi',
                data: [
                  {
                    key: 'id_unit',
                    label: `Unit Kerja`,
                    children: record.id_unit.nama_unor
                  },
                  {
                    key: 'tanggal_mulai',
                    label: `Periode Mulai ${Modul.RENSTRA}`,
                    children: record.tanggal_mulai
                  },
                  {
                    key: 'tanggal_selesai',
                    label: `Periode Akhir ${Modul.RENSTRA}`,
                    children: record.tanggal_selesai
                  },
                  {
                    key: 'misi',
                    label: `Misi`,
                    children: (
                      <List
                        size="small"
                        dataSource={record.ids_misi}
                        renderItem={(item) => (
                          <List.Item>
                            <div className="inline-flex items-center gap-x-2">
                              <CheckCircleFilled className="text-blue-500" />
                              {item.nama}
                            </div>
                          </List.Item>
                        )}
                      />
                    )
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
      title: `Tambah ${Modul.RENSTRA}`,
      formFields: [
        ...formFields({ options: { missions: missions } }),
        ...(user?.canAccess({ roles: [Role.ADMIN] })
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
          tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DD'),
          tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DD'),
          id_unit: user?.isRole(Role.ADMIN) ? values.unit_id : user?.unor.id
        };
        const { isSuccess, message } = await storeRenstras.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRenstras({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  // const filter = {
  //   formFields: [
  //     ...renstraFilterFields(),
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
  //   isLoading: getAllRenstras.isLoading,
  //   onSubmit: (values) => {
  //     setFilterValues({
  //       ...filterValues,
  //       unit_id: user.isRole(Role.ADMIN) ? values.unit_id : user?.unor.id
  //     });
  //   }
  // };

  return (
    <>
      <PageExplanation title={Modul.RENSTRA} subTitle={'Kelola dan atur data rencana strategi dengan mudah. Tambahkan, ubah, atau hapus rencana strategi agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader modul={'Sinkronisasi Rencana Strategi Dengan Visi Misi Kepala Daerah'} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllRenstras.isLoading}>
            <DataTable data={renstras} columns={column} loading={getAllRenstras.isLoading} map={(renstra) => ({ key: renstra.id, ...renstra })} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Renstras;
