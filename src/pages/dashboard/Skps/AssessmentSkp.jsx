import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { Badge, Button, Card, Descriptions, Rate, Result, Skeleton, Table, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { lampiranColumn, perilakuColumns, RhkColumn } from './Columns';
import { SkpsService } from '@/services';
import { InputType } from '@/constants';
import isSkpBawahan from '@/utils/isSkpAtasan';
import getPredikat from '@/utils/getPredikat';

const AssessmentSkp = () => {
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpAssessment);
  const storePredikat = useService(SkpsService.storePenilaianSkp);

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp]);

  const detailSkp = getAllDetailSkp.data ?? {};

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

  const handleCreatePenilaian = () => {
    modal.create({
      title: `Buat Penilaian SKP`,
      formFields: [
        {
          label: `Penilaian SKP`,
          name: 'rating_predikat',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: `Penilaian SKP harus diisi`
            }
          ],
          size: 'large',
          options: [
            { label: 'SANGAT KURANG', value: 1 },
            { label: 'KURANG', value: 2 },
            { label: 'BUTUH PERBAIKAN', value: 3 },
            { label: 'BAIK', value: 4 },
            { label: 'ISTIMEWA', value: 5 }
          ]
        }
      ],
      onSubmit: async (values) => {
        const { isSuccess, message } = await storePredikat.execute({ ...values, skp_dinilai_id: detailSkp.id, skp_penilai_id: detailSkp.atasan_skp[0].id, periode_penilaian_id: assessment_periode_id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token: token, id: id, assessment_period_id: assessment_periode_id });
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
          {isSkpBawahan(detailSkp, user) && (
            <Button variant="solid" color="primary" onClick={handleCreatePenilaian}>
              {!detailSkp?.penilaian || !detailSkp.penilaian.rating_predikat || parseFloat(detailSkp.penilaian.rating_predikat) <= 0 ? 'Tambah Penilaian SKP' : 'Ubah Nilai'}
            </Button>
          )}
        </div>
      </div>
      <Card>
        {!!detailSkp?.penilaian && parseFloat(detailSkp?.penilaian?.rating_predikat || '0') > 0 && (
          <Result
            status="success"
            title="SKP Telah Dinilai"
            subTitle="SKP ini telah berhasil dilakukan penilaian dengan perolehan nilai"
            extra={
              <div>
                <Typography.Title level={3}>{getPredikat(detailSkp.penilaian.rating_predikat)}</Typography.Title>
                <Rate value={parseFloat(detailSkp.penilaian.rating_predikat)} disabled />
              </div>
            }
          />
        )}
      </Card>
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
            <div className="flex flex-row gap-x-4">
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
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={RhkColumn()} dataSource={flattenData(detailSkp?.rhk?.filter((item) => item.jenis === 'UTAMA') ?? [])} pagination={false} rowKey={(record) => `${record.rhkId}-${record.aspekId}`} />
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
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Sumber Daya</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.lampiran?.sumber_daya ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Skema</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.lampiran?.skema ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Konsekuensi</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.lampiran?.konsekuensi ?? []} pagination={false} />
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default AssessmentSkp;
