import { Delete } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { JptService, UnitKerjaService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { jabatanFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const Jpts = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { id } = useParams();
  const { success, error } = useNotification();
  const { execute, ...getDetailJpt } = useService(JptService.getById);
  const { execute: fetchAllAsn, ...getAvailableJabatan } = useService(UnitKerjaService.getAllAsn);
  const updateJpt = useService(JptService.update);

  const asn = getAvailableJabatan.data ?? [];
  const detailJpt = getDetailJpt.data ?? [];

  const fetchJptDetail = React.useCallback(() => {
    execute(token, id);
  }, [execute, id, token]);

  React.useEffect(() => {
    fetchJptDetail();
    fetchAllAsn(token, detailJpt.unitId);
  }, [detailJpt.unitId, detailJpt.unit_id, fetchAllAsn, fetchJptDetail, id, token]);

  const column = [
    {
      title: 'Nama ASN',
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Delete
            title={`Delete ${Modul.JPTS}`}
            onClick={() => {
              modal.delete.default({
                title: `Hapus ASN`,
                data: record,
                onSubmit: async () => {
                  const updatedJabatan = (detailJpt.jabatan ?? []).filter((j) => j !== record.jabatan);

                  const { isSuccess, message } = await updateJpt.execute(id, { ...detailJpt, jabatan: updatedJabatan }, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchJptDetail(token, id);
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
      title: `Tambah ASN`,
      formFields: jabatanFormFields({ options: { nips: asn } }),
      onSubmit: async (values) => {
        const newNips = Array.isArray(values.nip) ? values.nip : [values.nip];

        const updatedJabatan = [...(detailJpt.nip ?? []), ...newNips];

        const { isSuccess, message } = await updateJpt.execute(id, { name: detailJpt.name, unitId: detailJpt.unitId, nip: updatedJabatan }, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchJptDetail(token, id);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader modul={`list ASN - ${detailJpt?.name}`} onStore={onCreate}></DataTableHeader>}>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getDetailJpt.isLoading}>
          <DataTable data={detailJpt?.nip ?? []} columns={column} loading={getDetailJpt.isLoading} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Jpts;
