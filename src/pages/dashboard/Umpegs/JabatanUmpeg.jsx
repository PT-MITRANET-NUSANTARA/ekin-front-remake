import { Delete } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { UmpegService, UnitKerjaService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { jabatanFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const Umpegs = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { id } = useParams();
  const { success, error } = useNotification();
  const { execute, ...getDetailUmpeg } = useService(UmpegService.getById);
  const { execute: fetchAvilableJabatans, ...getAvailableJabatan } = useService(UnitKerjaService.getAllJabatan);
  const updateUmpeg = useService(UmpegService.update);

  const availableJabatans = getAvailableJabatan.data ?? [];
  const detailUmpeg = getDetailUmpeg.data ?? [];

  const fetchUmpegDetail = React.useCallback(() => {
    execute(token, id);
  }, [execute, id, token]);

  React.useEffect(() => {
    fetchUmpegDetail();
    fetchAvilableJabatans(token, detailUmpeg.unit_id);
  }, [detailUmpeg.unit_id, fetchAvilableJabatans, fetchUmpegDetail, id, token]);

  const column = [
    {
      title: 'Jabatan',
      dataIndex: 'jabatan',
      render: (value) => (Array.isArray(value) ? value.join(', ') : value),
      sorter: (a, b) => (a.jabatan?.length || 0) - (b.jabatan?.length || 0),
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Delete
            title={`Delete ${Modul.UMPEG}`}
            onClick={() => {
              modal.delete.default({
                title: `Hapus Jabatan`,
                data: record,
                onSubmit: async () => {
                  const updatedJabatan = (detailUmpeg.jabatan ?? []).filter((j) => j !== record.jabatan);

                  const { isSuccess, message } = await updateUmpeg.execute(id, { ...detailUmpeg, jabatan: updatedJabatan }, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUmpegDetail(token, id);
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
      title: `Tambah Jabatan`,
      formFields: jabatanFormFields({ options: { jabatans: availableJabatans } }),
      onSubmit: async (values) => {
        const updatedJabatan = [...(detailUmpeg.jabatan ?? []), ...(Array.isArray(values.jabatan) ? values.jabatan : [values.jabatan])];

        const { isSuccess, message } = await updateUmpeg.execute(id, { ...detailUmpeg, jabatan: updatedJabatan }, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchUmpegDetail(token, id);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={detailUmpeg?.unit?.nama_unor} onStore={onCreate}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getDetailUmpeg.isLoading}>
          <DataTable
            data={(detailUmpeg?.jabatan ?? []).map((j, idx) => ({
              key: idx,
              jabatan: j
            }))}
            columns={column}
            loading={getDetailUmpeg.isLoading}
          />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Umpegs;
