import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { MissionsService, RenstrasService, UnitKerjaService } from '@/services';
import { Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import { Renstras as RenstraModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { formFields, renstraFilterFields } from './FormFields';
import dayjs from 'dayjs';
import { CheckCircleFilled } from '@ant-design/icons';
import { InputType } from '@/constants';

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
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    search: ''
  });
  const pagination = usePagination({ totalData: getAllRenstras.totalData });

  const fetchRenstras = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.umpegs, user?.unor.id]);

  React.useEffect(() => {
    fetchRenstras();
    fetchMissions({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchMissions, fetchRenstras, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const renstras = getAllRenstras.data ?? [];
  const missions = getAllMissions.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Periode Mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true
    },
    {
      title: 'Periode Selesai',
      dataIndex: 'tanggal_selesai',
      sorter: (a, b) => a.tanggal_selesai.length - b.tanggal_selesai.length,
      searchable: true
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
                  const { isSuccess, message } = await updateRenstras.execute(record.id, values, token);
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
      formFields: formFields({ options: { missions: missions } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeRenstras.execute({ ...values, id_unit: user.unor.id }, token);
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

  const filter = {
    formFields: [
      ...renstraFilterFields(),
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
    isLoading: getAllRenstras.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.RENSTRA} filter={filter} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllRenstras.isLoading}>
          <DataTable data={renstras} columns={column} loading={getAllRenstras.isLoading} map={(renstra) => ({ key: renstra.id, ...renstra })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Renstras;
