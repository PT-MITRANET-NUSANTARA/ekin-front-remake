import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { GoalsService, RenstrasService, UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space, Tag } from 'antd';
import React from 'react';
import { Goals as GoalModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { goalFormFields, goalsFilterFields } from './FormFields';
import { useNavigate } from 'react-router-dom';
import { InputType } from '@/constants';

const Goals = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllGoals } = useService(GoalsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);

  const deleteGoals = useService(GoalsService.delete);
  const storeGoals = useService(GoalsService.store);
  const updateGoals = useService(GoalsService.update);
  const [filterValues, setFilterValues] = React.useState({
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    search: ''
  });
  const pagination = usePagination({ totalData: getAllGoals.totalData });
  const navigate = useNavigate();

  const fetchGoals = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.umpegs, user?.unor.id]);

  React.useEffect(() => {
    fetchGoals();
    fetchRenstras({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchGoals, fetchRenstras, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const goals = getAllGoals.data ?? [];
  const renstras = getAllRenstras.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

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

  const filter = {
    formFields: [
      ...goalsFilterFields(),
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
    isLoading: getAllGoals.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.GOAL} filter={filter} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllGoals.isLoading}>
          <DataTable data={goals} columns={column} loading={getAllGoals.isLoading} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Goals;
