import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RenstrasService, RktsService, SubActivitiesService } from '@/services';
import { Button, Card, List, Space } from 'antd';
import React from 'react';
import { Rkts as RktModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { rktFormFields } from './FormFields';

const SubActivities = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRkts } = useService(RktsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchSubActivities, ...getAllSubActivities } = useService(SubActivitiesService.getAll);
  const deleteRkt = useService(RktsService.delete);
  const storeRkt = useService(RktsService.store);
  const updateRkt = useService(RktsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllRkts.totalData });
  const navigate = useNavigate();

  const fetchRkts = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user ? user.unor.id : ''
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token, user]);

  React.useEffect(() => {
    fetchRkts();
    fetchRenstras({ token: token });
    fetchSubActivities({ token: token });
  }, [fetchRkts, fetchRenstras, pagination.page, pagination.per_page, token, fetchSubActivities]);

  const rkts = getAllRkts.data ?? [];
  const renstras = getAllRenstras.data ?? [];
  const subActivities = getAllSubActivities.data ?? [];

  const column = [
    {
      title: 'Rencana Kerja Tahunan',
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
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              const formData = {
                ...record,
                id_sub_kegiatan: record.id_sub_kegiatan.map((item) => item.id)
              };

              modal.edit({
                title: `Ubah ${Modul.RKT}`,
                formFields: rktFormFields({ options: { renstras, subActivities } }),
                data: formData,
                onSubmit: async (values) => {
                  const payload = {
                    ...record,
                    ...values,
                    id_unit: record.id_unit
                  };

                  const { isSuccess, message } = await updateRkt.execute(record.id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRkts({ token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />

          <Delete
            title={`Delete ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RKT}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteRkt.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRkts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data RKT',
                data: [
                  {
                    key: 'nama',
                    label: `Judul ${Modul.RKT}`,
                    children: record.nama
                  },
                  {
                    key: 'label',
                    label: `Label`,
                    children: record.label
                  },
                  {
                    key: 'total_anggaran',
                    label: `Total Anggaran`,
                    children: rupiahFormat(record.total_anggaran)
                  },
                  {
                    key: 'total_anggaran',
                    label: `Total Anggaran`,
                    children: <List size="small" bordered dataSource={record.id_sub_kegiatan} renderItem={(item) => <List.Item>{item.nama}</List.Item>} />
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
      title: `Tambah ${Modul.RKT}`,
      formFields: rktFormFields({ options: { renstras: renstras, subActivities: subActivities } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeRkt.execute({ ...values, id_unit: user?.unor?.id, input_indikator_kinerja: [], output_indikator_kinerja: [], outcome_indikator_kinerja: [] }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRkts({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.RKT} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={rkts} columns={column} loading={getAllRkts.isLoading} pagination={pagination} />
      </div>
    </Card>
  );
};

export default SubActivities;
