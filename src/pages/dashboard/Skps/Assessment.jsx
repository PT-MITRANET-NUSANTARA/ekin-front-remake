import { DataTable } from '@/components';
import { useAuth, useService } from '@/hooks';
import { AssessmentPeriodService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton, Select } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skpBawahanColumns } from './Columns';
import { CheckSquareOutlined } from '@ant-design/icons';
import dateFormatter from '@/utils/dateFormatter';
import { SKP_STATUS } from '@/constants/SkpStatus';

const Assessment = () => {
  const { token } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const navigate = useNavigate();
  const { execute: fetchDetailAssessmentPeriod, ...getDetailAssessmentPeriod } = useService(AssessmentPeriodService.getById);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchSkpBawahan, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);
  const [selectedJabatanIndex, setSelectedJabatanIndex] = React.useState(0);

  const assessmentPeriods = getDetailAssessmentPeriod.data ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};
  const skpBawahan = getAllSkpBawahan.data ?? [];
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];

  React.useEffect(() => {
    fetchDetailSkp({ token, id });
    fetchSkpBawahan({ token, id });
    fetchDetailAssessmentPeriod(token, assessment_periode_id);
  }, [assessment_periode_id, fetchDetailAssessmentPeriod, fetchDetailSkp, fetchSkpBawahan, id, token]);

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
      setSelectedJabatanIndex(0);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

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

          {/* Jabatan Selection */}
          {detailSkp?.jabatan && detailSkp.jabatan.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Pilih Jabatan</label>
              <Select
                style={{ width: '100%' }}
                value={currentJabatan?.id_posjab}
                onChange={(value) => {
                  const selectedIndex = detailSkp.jabatan.findIndex((j) => j.id_posjab === value);
                  const selected = detailSkp.jabatan[selectedIndex];
                  setSelectedJabatan(selected);
                  setSelectedJabatanIndex(selectedIndex);
                }}
                options={detailSkp.jabatan.map((jabatan) => ({
                  label: `${jabatan.nama_jabatan} - ${jabatan.unor?.nama ?? 'N/A'}`,
                  value: jabatan.id_posjab
                }))}
              />
            </div>
          )}
          <Descriptions title="Detail SKP" size="default" column={3} bordered className="mb-12">
            <Descriptions.Item label="Periode Mulai">{detailSkp.periode_start}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{detailSkp.periode_end}</Descriptions.Item>
            <Descriptions.Item label="Renstra">{detailSkp.renstra?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Pendekatan">{detailSkp.pendekatan}</Descriptions.Item>
            <Descriptions.Item label="Cascading">{detailSkp.cascading || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status SKP">
              {(() => {
                switch (detailSkp.status) {
                  case SKP_STATUS.DRAFT:
                    return <Badge status="processing" text="Draft" />;
                  case SKP_STATUS.SUBMITTED:
                    return <Badge status="warning" text="Submitted" />;
                  case SKP_STATUS.REJECTED:
                    return <Badge status="error" text="Rejected" />;
                  case SKP_STATUS.APPROVED:
                    return <Badge status="success" text="Approved" />;
                  default:
                    return <Badge status="default" text={detailSkp.status} />;
                }
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Nama ASN" span={3}>{currentJabatan?.nama_asn ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={3}>
              {currentJabatan?.unor?.nama ?? detailSkp?.unit?.nama_unor ?? ''}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Detail Periode Penilaian" size="default" column={3} bordered className="mb-12">
            <Descriptions.Item label="Nama Periode">{assessmentPeriods.nama}</Descriptions.Item>
            <Descriptions.Item label="Periode Mulai">{dateFormatter(assessmentPeriods.tanggal_mulai)}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{dateFormatter(assessmentPeriods.tanggal_selesai)}</Descriptions.Item>
          </Descriptions>
          <div className="mb-12 flex flex-row gap-x-4">
            <Descriptions title="Pejabat yang dinilai" size="small" column={1} bordered>
              <Descriptions.Item label="Nama">{currentJabatan?.asn?.nama_atasan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Nip">{currentJabatan?.asn?.nip_atasan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Jabatan">{currentJabatan?.nama_jabatan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Unit Kerja">{currentJabatan?.unor?.nama ?? '-'}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Pejabat penilai kinerja" size="small" column={1} bordered>
              <Descriptions.Item label="Nama">{currentJabatan?.unor?.atasan?.asn?.nama_atasan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Nip">{currentJabatan?.unor?.atasan?.asn?.nip_atasan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Jabatan">{currentJabatan?.unor?.atasan?.unor_jabatan ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Unit Kerja">{currentJabatan?.unor?.atasan?.nama ?? '-'}</Descriptions.Item>
            </Descriptions>
          </div>
        </Skeleton>

        <Skeleton loading={getAllSkpBawahan.isLoading}>
          <DataTable
            data={skpBawahan ?? []}
            columns={skpBawahanColumns({
              navigate,
              navItems: detailSkp.status === SKP_STATUS.APPROVED ? [
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
              ] : []
            })}
            loading={getAllSkpBawahan.isLoading}
          />
        </Skeleton>
      </Card>
    </div>
  );
};

export default Assessment;
