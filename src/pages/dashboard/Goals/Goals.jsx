import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { GoalsService, RenstrasService } from '@/services';
import { Button, Card, Space, Tag } from 'antd';
import React from 'react';
import { Goals as GoalModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { goalFormFields } from './FormFields';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllGoals } = useService(GoalsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const deleteGoals = useService(GoalsService.delete);
  const storeGoals = useService(GoalsService.store);
  const updateGoals = useService(GoalsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllGoals.totalData });
  const navigate = useNavigate();

  const fetchGoals = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user ? user.unor.id : ''
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token, user]);

  React.useEffect(() => {
    fetchGoals();
    fetchRenstras({ token: token });
  }, [fetchGoals, fetchRenstras, pagination.page, pagination.per_page, token]);

  const goals = getAllGoals.data ?? [];
  const renstras = getAllRenstras.data ?? [];

  const column = [
    {
      title: 'Judul Tujuan',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.GOAL}`}
            model={GoalModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.GOAL}`,
                formFields: goalFormFields({ options: { renstras: renstras } }),
                data: { ...record, id_renstra: record.renstra.id },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateGoals.execute(record.id, { ...record, ...values, id_unit: record.id_unit.id_simpeg }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchGoals({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.GOAL}`}
            model={GoalModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.GOAL}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteGoals.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchGoals({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.GOAL}`}
            model={GoalModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data tujua',
                data: [
                  {
                    key: 'nama',
                    label: `Judul ${Modul.GOAL}`,
                    children: record.nama
                  },
                  {
                    key: 'renstra',
                    label: `Renstra ${Modul.GOAL}`,
                    children: (
                      <>
                        <Tag>{record.renstra.tanggal_mulai}</Tag>
                        Hingga <Tag>{record.renstra.tanggal_selesai}</Tag>
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
      title: `Tambah ${Modul.GOAL}`,
      formFields: goalFormFields({ options: { renstras: renstras } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeGoals.execute({ ...values, id_unit: user?.unor?.id, indikator_kinerja: [] }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchGoals({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.GOAL} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={goals} columns={column} loading={getAllGoals.isLoading} pagination={pagination} />
      </div>
    </Card>
  );
};

export default Goals;
