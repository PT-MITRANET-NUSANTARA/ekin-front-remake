import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { SubActivitiesService } from '@/services';
import { Card, Space } from 'antd';
import React from 'react';
import { SubActivities as SubActivityModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { indicatorFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const SubAcitivitiesIndicators = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchSubActivityDetail, ...getDetailSubActivity } = useService(SubActivitiesService.getById);
  const updateSubAcitivites = useService(SubActivitiesService.update);
  const [indicators, setIndicators] = React.useState([]);

  React.useEffect(() => {
    fetchSubActivityDetail(token, id);
  }, [fetchSubActivityDetail, id, token]);

  const detailSubActivity = React.useMemo(() => getDetailSubActivity.data ?? [], [getDetailSubActivity.data]);

  React.useEffect(() => {
    if (detailSubActivity) {
      setIndicators(detailSubActivity.indikator_kinerja);
    }
  }, [detailSubActivity]);

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
            title={`Edit ${Modul.SUBACTIVITY}`}
            model={SubActivityModel}
            onClick={() => {
              modal.edit({
                title: `Ubah Indikator`,
                formFields: indicatorFormFields(),
                data: { ...record },
                onSubmit: async (values) => {
                  const updatedIndicators = indicators.map((item) => (item.id === record.id ? { ...item, ...values } : item));

                  const payload = {
                    nama: detailSubActivity.nama,
                    id_kegiatan: detailSubActivity.id_kegiatan.id,
                    total_anggaran: detailSubActivity.total_anggaran,
                    id_unit: detailSubActivity.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updateSubAcitivites.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubActivityDetail(token, id);
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.SUBACTIVITY}`}
            model={SubActivityModel}
            onClick={() => {
              modal.delete.default({
                title: `Hapus Indikator`,
                data: record,
                onSubmit: async () => {
                  const updatedIndicators = indicators.filter((item) => item.id !== record.id);

                  const payload = {
                    nama: detailSubActivity.nama,
                    id_kegiatan: detailSubActivity.id_kegiatan.id,
                    total_anggaran: detailSubActivity.total_anggaran,
                    id_unit: detailSubActivity.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updateSubAcitivites.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubActivityDetail(token, id);
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
      title: `Tambah ${Modul.SUBACTIVITY}`,
      formFields: indicatorFormFields(),
      onSubmit: async (values) => {
        const payload = {
          nama: detailSubActivity.nama,
          id_kegiatan: detailSubActivity.id_kegiatan.id,
          total_anggaran: detailSubActivity.total_anggaran,
          id_unit: detailSubActivity.id_unit.id_simpeg,
          indikator_kinerja: [...(indicators || []), values]
        };

        const { isSuccess, message } = await updateSubAcitivites.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchSubActivityDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={detailSubActivity?.nama ?? ''} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={indicators ?? []} columns={column} loading={getDetailSubActivity.isLoading} map={(goals) => ({ key: goals.id, ...goals })} />
      </div>
    </Card>
  );
};

export default SubAcitivitiesIndicators;
