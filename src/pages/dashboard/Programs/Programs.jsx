import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { GoalsService, ProgramsService, UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import { Programs as ProgramModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { programFormFields, programsFilterFields } from './FormFields';
import { InputType } from '@/constants';

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
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllPrograms.totalData });
  const navigate = useNavigate();

  const fetchPrograms = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.unor.id]);

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
      dataIndex: ['id_tujuan', 'nama'],
      sorter: (a, b) => a.id_tujuan.nama.length - b.id_tujuan.nama.length,
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
      formFields: programFormFields({ options: { goals: goals } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storePrograms.execute({ ...values, id_unit: user?.unor?.id, indikator_kinerja: [], total_anggaran: parseInt(values.total_anggaran) }, token);
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

  const filter = {
    formFields: [
      ...programsFilterFields(),
      ...(user?.isAdmin
        ? [
            {
              label: `Nama Unit`,
              name: 'unit_id',
              type: InputType.SELECT,
              mode: 'multiple',
              options: unitKerja.map((item) => ({
                label: item.nama_unor,
                value: item.id_simpeg
              }))
            }
          ]
        : [])
    ],
    initialData: {
      ...(user?.isAdmin ? { unit_id: filterValues.unit_id } : { unit_id: user?.unor.id })
    },
    isLoading: getAllPrograms.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...(user?.isAdmin ? { unit_id: values.unit_id } : { unit_id: user?.unor.id })
      });
    }
  };

  return (
    <Card>
      <DataTableHeader filter={filter} modul={Modul.PROGRAM} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllPrograms.isLoading}>
          <DataTable data={programs} columns={column} loading={getAllPrograms.isLoading} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Programs;
