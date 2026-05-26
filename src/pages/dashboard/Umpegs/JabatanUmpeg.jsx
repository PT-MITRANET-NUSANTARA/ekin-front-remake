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
  const { execute, ...getDetailUmpeg } = useService(UmpegService.getByUnitId);
  const { execute: fetchAllAsn, ...getAvailableJabatan } = useService(UnitKerjaService.getAllAsn);
  const storeUmpeg = useService(UmpegService.store);
  const updateUmpeg = useService(UmpegService.update);

  const asn = getAvailableJabatan.data ?? [];
  const detailUmpegList = Array.isArray(getDetailUmpeg.data) ? getDetailUmpeg.data : getDetailUmpeg.data ? [getDetailUmpeg.data] : [];
  const detailUmpeg = detailUmpegList[0] ?? {};
  const hasExistingUmpeg = Boolean(detailUmpeg?.id);

  const fetchUmpegDetail = React.useCallback(() => {
    execute(token, id);
  }, [execute, id, token]);

  const fetchAsn = React.useCallback(() => {
    fetchAllAsn(token, id);
  }, [fetchAllAsn, id, token]);

  React.useEffect(() => {
    fetchUmpegDetail();
    fetchAsn();
  }, [fetchAsn, fetchUmpegDetail]);

  const normalizeAsn = React.useCallback((item) => {
    const nip = item?.nip_asn ?? item?.nip ?? '';
    const name = item?.nama_asn ?? item?.nama ?? item?.name ?? '-';
    const jabatan = item?.nama_jabatan ?? item?.jabatan ?? item?.posjab?.[0]?.nama_jabatan ?? '-';

    return {
      ...item,
      nip,
      name,
      jabatan
    };
  }, []);

  const normalizedAsn = React.useMemo(() => asn.map(normalizeAsn), [asn, normalizeAsn]);

  const nipRows = React.useMemo(
    () =>
      (detailUmpeg?.nip ?? []).map((nip) => ({
        key: String(nip),
        nip,
        name: normalizedAsn.find((item) => String(item.nip) === String(nip))?.name ?? '-',
        jabatan: normalizedAsn.find((item) => String(item.nip) === String(nip))?.jabatan ?? '-'
      })),
    [detailUmpeg?.nip, normalizedAsn]
  );

  const column = [
    {
      title: 'NIP',
      dataIndex: 'nip',
      searchable: true
    },
    {
      title: 'Nama ASN',
      dataIndex: 'name',
      searchable: true
    },
    {
      title: 'Jabatan',
      dataIndex: 'jabatan',
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
                title: `Hapus ASN`,
                data: record,
                onSubmit: async () => {
                  const updatedNip = (detailUmpeg.nip ?? []).filter((nip) => String(nip) !== String(record.nip));

                  if (!hasExistingUmpeg) {
                    error('Gagal', 'Data UMPEG belum tersedia untuk unit ini.');
                    return false;
                  }

                  const { isSuccess, message } = await updateUmpeg.execute(
                    detailUmpeg.id,
                    {
                      name: detailUmpeg.name,
                      unitId: detailUmpeg.unitId ?? id,
                      nip: updatedNip
                    },
                    token
                  );

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUmpegDetail();
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
      formFields: jabatanFormFields({ options: { nips: normalizedAsn } }),
      onSubmit: async (values) => {
        const newNips = Array.isArray(values.nip) ? values.nip : [values.nip];
        const updatedNips = Array.from(new Set([...(detailUmpeg.nip ?? []), ...newNips]));
        const payload = {
          name: detailUmpeg?.name ?? asn?.[0]?.unor?.name ?? `UMPEG Unit ${id}`,
          unitId: detailUmpeg?.unitId ?? id,
          nip: updatedNips
        };

        const { isSuccess, message } = hasExistingUmpeg
          ? await updateUmpeg.execute(detailUmpeg.id, payload, token)
          : await storeUmpeg.execute(payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchUmpegDetail();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader modul={`list ASN - ${detailUmpeg?.name ?? 'Unit Organisasi'}`} onStore={onCreate}></DataTableHeader>}>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getDetailUmpeg.isLoading}>
          <DataTable data={nipRows} columns={column} loading={getDetailUmpeg.isLoading || getAvailableJabatan.isLoading} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Umpegs;
