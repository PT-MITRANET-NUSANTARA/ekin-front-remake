import { Delete } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { UnitKerjaService, VerificatorService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { useParams } from 'react-router-dom';
import { jabatanFormFields } from './FormFields';

const Umpegs = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { id, unor_id } = useParams();
  const { success, error } = useNotification();
  const { execute, ...getDetailVerificator } = useService(VerificatorService.getById);
  const { execute: fetchAvilableJabatans, ...getAvailableJabatan } = useService(UnitKerjaService.getAllJabatan);
  const updateUmpeg = useService(VerificatorService.update);

  const availableJabatans = getAvailableJabatan.data ?? [];
  const detailVerificator = getDetailVerificator.data ?? [];

  const fetchVerificatorDetail = React.useCallback(() => {
    execute(token, id);
  }, [execute, id, token]);

  React.useEffect(() => {
    fetchVerificatorDetail();
    fetchAvilableJabatans(token, unor_id);
  }, [detailVerificator.unit_id, fetchAvilableJabatans, fetchVerificatorDetail, id, token, unor_id]);

  const selectedJabatanDetail = detailVerificator?.jabatan_detail?.find((jd) => jd.unor_id === unor_id);

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
            title={`Delete ${Modul.VERIFICATOR}`}
            onClick={() => {
              modal.delete.default({
                title: `Hapus Jabatan`,
                data: record,
                onSubmit: async () => {
                  const currentJabatan = detailVerificator.jabatan ?? [];

                  const updatedJabatan = (() => {
                    return currentJabatan
                      .map((j) => {
                        const key = Object.keys(j)[0];
                        if (key === record.unor_id) {
                          const filtered = j[key].filter((jab) => jab !== record.jabatan);
                          return { [key]: filtered };
                        }
                        return j;
                      })
                      .filter((j) => {
                        const key = Object.keys(j)[0];
                        return j[key].length > 0; // hapus objek kosong
                      });
                  })();

                  const { isSuccess, message } = await updateUmpeg.execute(
                    id,
                    {
                      ...detailVerificator,
                      unit_id: detailVerificator.unit_id,
                      jabatan: updatedJabatan
                    },
                    token
                  );

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVerificatorDetail(token, id);
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
        const currentJabatan = detailVerificator.jabatan ?? [];

        const updatedJabatan = (() => {
          const idx = currentJabatan.findIndex((j) => Object.keys(j)[0] === unor_id);
          if (idx >= 0) {
            const clone = [...currentJabatan];
            const oldList = clone[idx][unor_id] || [];
            const newList = Array.isArray(values.jabatan) ? values.jabatan : [values.jabatan];
            clone[idx] = { [unor_id]: [...new Set([...oldList, ...newList])] };
            return clone;
          }
          return [...currentJabatan, { [unor_id]: Array.isArray(values.jabatan) ? values.jabatan : [values.jabatan] }];
        })();

        const { isSuccess, message } = await updateUmpeg.execute(
          id,
          {
            ...detailVerificator,
            unit_id: detailVerificator.unit_id,
            jabatan: updatedJabatan
          },
          token
        );

        if (isSuccess) {
          success('Berhasil', message);
          fetchVerificatorDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={selectedJabatanDetail?.unor_detail?.nama_unor} onStore={onCreate}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getDetailVerificator.isLoading}>
          <DataTable
            data={(selectedJabatanDetail?.jabatan_list ?? []).map((jabatan, idx) => ({
              key: idx,
              jabatan,
              unor_id: unor_id
            }))}
            columns={column}
            loading={getDetailVerificator.isLoading}
          />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Umpegs;
