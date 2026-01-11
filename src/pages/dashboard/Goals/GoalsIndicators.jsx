import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { GoalsService } from '@/services';
import { Card, Descriptions, Space, Tag } from 'antd';
import React from 'react';
import { Goals as GoalModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { indicatorFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const GoalsIndicators = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchGoalDetail, ...getDetailGoal } = useService(GoalsService.getById);
  const updateGoals = useService(GoalsService.update);
  const [indicators, setIndicators] = React.useState([]);

  React.useEffect(() => {
    fetchGoalDetail(token, id);
  }, [fetchGoalDetail, id, token]);

  const detailGoal = React.useMemo(() => getDetailGoal.data ?? [], [getDetailGoal.data]);

  React.useEffect(() => {
    if (detailGoal) {
      setIndicators(detailGoal.indikator_kinerja);
    }
  }, [detailGoal]);

  const column = [
    {
      title: 'Nama Indikator',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Target Indikator',
      dataIndex: 'target',
      sorter: (a, b) => a.target.length - b.target.length,
      searchable: true
    },
    {
      title: 'Satuan Indikator',
      dataIndex: 'satuan',
      sorter: (a, b) => a.satuan.length - b.satuan.length,
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
                title: `Ubah Indikator`,
                formFields: indicatorFormFields(),
                data: { ...record },
                onSubmit: async (values) => {
                  const updatedIndicators = indicators.map((item) => (item.id === record.id ? { ...item, ...values } : item));

                  const payload = {
                    nama: detailGoal.nama,
                    id_renstra: detailGoal.renstra.id,
                    id_unit: detailGoal.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updateGoals.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchGoalDetail(token, id);
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
                title: `Hapus Indikator`,
                data: record,
                onSubmit: async () => {
                  const updatedIndicators = indicators.filter((item) => item.id !== record.id);

                  const payload = {
                    nama: detailGoal.nama,
                    id_renstra: detailGoal.renstra.id,
                    id_unit: detailGoal.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updateGoals.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchGoalDetail(token, id);
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.GOAL}`,
      formFields: indicatorFormFields(),
      onSubmit: async (values) => {
        const payload = {
          nama: detailGoal.nama,
          id_renstra: detailGoal.renstra.id,
          id_unit: detailGoal.id_unit.id_simpeg,
          indikator_kinerja: [...(indicators || []), values]
        };

        const { isSuccess, message } = await updateGoals.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchGoalDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={detailGoal?.nama ?? ''} />
      <Descriptions size="default" column={2} bordered className="mb-4">
        <Descriptions.Item label="Unit Kerja">{detailGoal?.id_unit?.nama_unor}</Descriptions.Item>
        <Descriptions.Item label="Judul Tujuan">{detailGoal?.nama}</Descriptions.Item>
        <Descriptions.Item label="Renstra">
          <Tag>{detailGoal?.renstra?.tanggal_mulai}</Tag>
          Hingga <Tag>{detailGoal?.renstra?.tanggal_selesai}</Tag>
        </Descriptions.Item>
      </Descriptions>
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={indicators ?? []} columns={column} loading={getDetailGoal.isLoading} map={(goals) => ({ key: goals.id, ...goals })} />
      </div>
    </Card>
  );
};

export default GoalsIndicators;
