import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RhkService, RktsService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton, Table, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { aspekFormFields, rhkFormFields } from './FormFields';
import { perilakuColumns, RhkColumn } from './Columns';

const DetailSkp = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchRkts, ...getAllRkts } = useService(RktsService.getAll);
  const storeRhk = useService(RhkService.store);
  const updateAspek = useService(SkpsService.aspekUpdate);
  const deleteRhk = useService(RhkService.delete);
  const pagination = usePagination({ totalData: getAllDetailSkp.totalData });

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token, id, page: pagination.page, per_page: pagination.per_page });
  }, [execute, id, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchDetailSkp();
    fetchRkts({ token: token });
  }, [fetchDetailSkp, fetchRkts, token, user?.newNip]);

  const detailSkp = getAllDetailSkp.data ?? {};
  const rkts = getAllRkts.data ?? {};

  const flattenData = (rhkList) => {
    const rows = [];

    rhkList.forEach((rhk) => {
      rhk.aspek.forEach((aspek, idx) => {
        rows.push({
          rhkId: rhk.id,
          rhkDesc: rhk.desc,
          klasifikasi: rhk.klasifikasi,
          penugasan: rhk.penugasan,
          aspekId: aspek.id,
          aspekDesc: aspek.desc,
          aspekJenis: aspek.jenis,
          indikator_name: aspek.indikator_kinerja?.name ?? '',
          indikator_target: aspek.indikator_kinerja?.target ?? '',
          indikator_satuan: aspek.indikator_kinerja?.satuan ?? '',
          rhkRowSpan: idx === 0 ? rhk.aspek.length : 0
        });
      });
    });

    return rows;
  };

  const handleUpdateAspek = (record) => {
    modal.edit({
      title: `Ubah ${Modul.ASPEK}`,
      formFields: aspekFormFields,
      data: { name: record.indikator_name, target: record.indikator_target, satuan: record.indikator_satuan },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateAspek.execute(record.aspekId, { indikator_kinerja: { ...values }, jenis: record.aspekJenis, desc: record.aspekDesc }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleDeleteAspek = (record) => {
    modal.delete.default({
      title: `Hapus ${Modul.RHK}`,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteRhk.execute(record.rhkId, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="mt-4 flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-x-2"></div>
        <div className="inline-flex items-center gap-x-2">
          <Button variant="solid" color="primary">
            Ajukan SKP
          </Button>
          <Button variant="solid" color="danger">
            Hapus
          </Button>
        </div>
      </div>

      <Card>
        <Skeleton loading={!!user?.newNip && getAllDetailSkp.isLoading}>
          <div className="flex flex-col gap-y-6">
            <Descriptions size="default" column={3} bordered>
              <Descriptions.Item label="Pendekatan">{detailSkp.pendekatan}</Descriptions.Item>
              <Descriptions.Item label="Periode Mulai">{detailSkp.periode_start}</Descriptions.Item>
              <Descriptions.Item label="Periode Akhir">{detailSkp.periode_end}</Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={3}>
                {detailSkp?.unit?.nama_unor ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label="Status SKP" span={3}>
                {(() => {
                  switch (detailSkp.status) {
                    case 'DRAFT':
                      return <Badge status="processing" text="Draft" />;
                    case 'SUBMITTED':
                      return <Badge status="warning" text="Submitted" />;
                    case 'REJECTED':
                      return <Badge status="error" text="Rejected" />;
                    case 'APPROVED':
                      return <Badge status="success" text="Approved" />;
                    default:
                      return <Badge status="default" text={detailSkp.status} />;
                  }
                })()}
              </Descriptions.Item>
            </Descriptions>
            <div className="flex flex-row items-center gap-x-4">
              <Descriptions title="Pejabat yang dinilai" size="small" column={1} bordered>
                <Descriptions.Item label="Nama">{detailSkp?.posjab?.[0]?.nama_asn ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Nip">{detailSkp?.posjab?.[0]?.nip_asn ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Jabatan">{detailSkp?.posjab?.[0]?.nama_jabatan ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Unit Kerja">{detailSkp?.unit?.nama_unor ?? ''}</Descriptions.Item>
              </Descriptions>
              <Descriptions title="Pejabat penilai kinerja" size="small" column={1} bordered>
                <Descriptions.Item label="Nama">{detailSkp?.atasan_skp_id ? (detailSkp?.atasan_skp?.[detailSkp.atasan_skp.length - 1]?.posjab?.[0]?.nama_asn ?? '') : detailSkp?.posjab?.[0]?.unor?.atasan?.asn?.nama_atasan}</Descriptions.Item>
                <Descriptions.Item label="Nip">{detailSkp?.atasan_skp_id ? detailSkp?.atasan_skp?.[detailSkp.atasan_skp.length - 1].posjab?.[0]?.nip_asn : detailSkp?.posjab?.[0]?.unor?.atasan?.asn?.nip_atasan}</Descriptions.Item>
                <Descriptions.Item label="Jabatan">{detailSkp?.atasan_skp_id ? detailSkp?.atasan_skp?.[detailSkp.atasan_skp.length - 1].posjab?.[0]?.nama_jabatan : detailSkp?.posjab?.[0]?.unor?.atasan?.unor_jabatan}</Descriptions.Item>
                <Descriptions.Item label="Unit Kerja">{detailSkp?.atasan_skp_id ? detailSkp?.atasan_skp?.[detailSkp.atasan_skp.length - 1].unit?.nama_unor : detailSkp?.unit?.nama_unor}</Descriptions.Item>
              </Descriptions>
            </div>
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Rencana Hasil Kerja Utama</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {user?.isJpt && (
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                      modal.create({
                        title: `Tambah ${Modul.RHK}`,
                        formFields: rhkFormFields({ options: { rkts: rkts } }),
                        onSubmit: async (values) => {
                          const { isSuccess, message } = await storeRhk.execute({ ...values, skp_id: detailSkp.id }, token);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchDetailSkp({ token: token, page: pagination.page, per_page: pagination.per_page });
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }
                      });
                    }}
                  >
                    Tambah Data RHK
                  </Button>
                )}
              </div>
            </div>
            <Table
              bordered
              columns={RhkColumn(handleUpdateAspek, handleDeleteAspek, user?.isJpt ?? false)}
              dataSource={flattenData(detailSkp?.rhk?.filter((item) => item.jenis === 'UTAMA') ?? [])}
              pagination={false}
              rowKey={(record) => `${record.rhkId}-${record.aspekId}`}
            />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Rencana Hasil Kerja Tambahan</Typography.Title>
              </div>
            </div>
            <Table bordered columns={RhkColumn()} dataSource={flattenData(detailSkp?.rhk?.filter((item) => item.jenis === 'TAMBAHAN') ?? [])} pagination={false} rowKey={(record) => `${record.rhkId}-${record.aspekId}`} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Perilaku Kinerja</Typography.Title>
              </div>
            </div>
            <Table bordered columns={perilakuColumns()} dataSource={detailSkp?.perilaku_id ?? []} pagination={false} />
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default DetailSkp;
