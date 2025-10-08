import { DataTable } from '@/components';
import { useAuth, useService } from '@/hooks';
import { AssessmentPeriodService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skpBawahanColumns } from './Columns';
import { CheckSquareOutlined } from '@ant-design/icons';

const Assessment = () => {
  const { token } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const navigate = useNavigate();
  const { execute: fetchDetailAssessmentPeriod, ...getDetailAssessmentPeriod } = useService(AssessmentPeriodService.getById);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchSkpBawahan, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);

  const assessmentPeriods = getDetailAssessmentPeriod.data ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};
  const skpBawahan = getAllSkpBawahan.data ?? [];

  React.useEffect(() => {
    fetchDetailSkp({ token, id });
    fetchSkpBawahan({ token, id });
    fetchDetailAssessmentPeriod(token, assessment_periode_id);
  }, [assessment_periode_id, fetchDetailAssessmentPeriod, fetchDetailSkp, fetchSkpBawahan, id, token]);

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <Skeleton loading={getAllDetailSkp.isLoading}>
          <div className="mb-6 flex gap-x-2">
            <Button variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/penilaian_kinerja')}>
              Penilaian Kinerja
            </Button>
            <Button variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/penilaian_perilaku')}>
              Penilaian Perilaku
            </Button>
            <Button variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/rencana_aksi')}>
              Rencana Aksi
            </Button>
            <Button variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/detail')}>
              Detail
            </Button>
            <Button variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/curva')}>
              Kurva Penilaian
            </Button>
          </div>
          <Descriptions title="Detail SKP" size="default" column={3} bordered className="mb-12">
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
          <Descriptions title="Detail Periode Penilaian" size="default" column={3} bordered className="mb-12">
            <Descriptions.Item label="Nama Periode">{assessmentPeriods.nama}</Descriptions.Item>
            <Descriptions.Item label="Periode Mulai">{assessmentPeriods.tanggal_mulai}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{assessmentPeriods.tanggal_selesai}</Descriptions.Item>
          </Descriptions>
          <div className="mb-12 flex flex-row gap-x-4">
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
        </Skeleton>

        <Skeleton loading={getAllSkpBawahan.isLoading}>
          <DataTable
            data={skpBawahan ?? []}
            columns={skpBawahanColumns({
              navigate,
              navItems: [
                {
                  label: 'Detail',
                  path: (record) => `/dashboard/skps/${record.id}/assessment_periods/${assessment_periode_id}/assessment/detail`
                },
                {
                  label: 'Rencana Aksi',
                  path: (record) => `/dashboard/skps/${record.id}/assessment_periods/${assessment_periode_id}/assessment/rencana_aksi`,
                  icon: <CheckSquareOutlined />
                },
                {
                  label: 'Kinerja',
                  path: (record) => `/dashboard/skps/${record.id}/assessment_periods/${assessment_periode_id}/assessment/penilaian_kinerja`
                },
                {
                  label: 'Perilaku',
                  path: (record) => `/dashboard/skps/${record.id}/assessment_periods/${assessment_periode_id}/assessment/penilaian_perilaku`
                },
                {
                  label: 'Predikat',
                  path: (record) => `/dashboard/skps/${record.id}/assessment_periods/${assessment_periode_id}/assessment/predikat`
                }
              ]
            })}
            loading={getAllSkpBawahan.isLoading}
          />
        </Skeleton>
      </Card>
    </div>
  );
};

export default Assessment;
