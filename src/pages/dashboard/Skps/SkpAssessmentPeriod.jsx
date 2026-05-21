import { DataTable, PageExplanation } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, usePagination, useService } from '@/hooks';
import { AssessmentPeriodService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton, Select } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import dateFormatter from '@/utils/dateFormatter';

const SkpAssessmentPeriod = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { execute, ...getAllAssessmentPeriods } = useService(AssessmentPeriodService.getAll);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const pagination = usePagination({ totalData: getAllAssessmentPeriods.totalData });
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);
  const [selectedJabatanIndex, setSelectedJabatanIndex] = React.useState(0);

  const assessmentPeriods = getAllAssessmentPeriods.data ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];
  const currentUnitId = detailSkp?.unitId?.[selectedJabatanIndex];

  const fetchAssessmentPeriods = React.useCallback(() => {
    const params = {
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      renstra_id: detailSkp.renstra_id
    };
    
    const unitId = currentJabatan?.unor?.induk?.id_simpeg;
    if (unitId) {
      params.unitIds = Array.isArray(unitId) ? unitId : [String(unitId)];
    }
    
    execute(params);
  }, [detailSkp.renstra_id, execute, pagination.page, pagination.per_page, token, currentJabatan]);

  React.useEffect(() => {
    fetchDetailSkp({ token, id });
  }, [fetchDetailSkp, id, token]);

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
      setSelectedJabatanIndex(0);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

  React.useEffect(() => {
    if (detailSkp?.posjab?.[0] || currentUnitId) {
      fetchAssessmentPeriods();
    }
  }, [detailSkp?.posjab, currentUnitId, fetchAssessmentPeriods]);

  const column = [
    {
      title: 'Nama Periode',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tanggal_selesai',
      sorter: (a, b) => a.tanggal_selesai.length - b.tanggal_selesai.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => ({
        children: (
          <Button className="w-fit" variant="solid" color="primary" onClick={() => navigate(window.location.pathname + '/' + record.id + '/assessment')}>
            Penilaian
          </Button>
        )
      })
    }
  ];

  return (
    <>
      <PageExplanation
        title={`${Modul.SKP} - Periode Penilaian`}
        subTitle="Kelola periode penilaian SKP dan lakukan penilaian kinerja."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>
          },
          {
            title: 'Periode Penilaian'
          }
        ]}
      />

      <Card>
        <div className="flex flex-col gap-y-6">
          <Skeleton loading={getAllDetailSkp.isLoading}>
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

            <Descriptions size="default" column={3} bordered>
              <Descriptions.Item label="Pendekatan">{detailSkp.pendekatan}</Descriptions.Item>
              <Descriptions.Item label="Periode Mulai">{detailSkp.periode_start}</Descriptions.Item>
              <Descriptions.Item label="Periode Akhir">{detailSkp.periode_end}</Descriptions.Item>
              <Descriptions.Item label="Renstra" span={3}>
                {detailSkp.renstra?.name ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={3}>
                {currentJabatan?.unor?.nama ?? detailSkp?.unit?.nama_unor ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Jabatan" span={3}>
                {currentJabatan?.nama_jabatan ?? '-'}
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
          </Skeleton>

          {/* Assessment Periods Table */}
          <Skeleton loading={getAllAssessmentPeriods.isLoading}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Periode Penilaian</h3>
              <Button onClick={() => navigate('/dashboard/skps/' + id)}>Kembali</Button>
            </div>
            <DataTable
              data={assessmentPeriods}
              columns={column}
              loading={getAllAssessmentPeriods.isLoading}
              map={(period) => ({ key: period.id, ...period })}
              pagination={pagination}
            />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default SkpAssessmentPeriod;
