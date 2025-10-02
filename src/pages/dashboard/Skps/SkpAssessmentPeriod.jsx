import { DataTable } from '@/components';
import { useAuth, usePagination, useService } from '@/hooks';
import { AssessmentPeriodService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SkpAssessmentPeriod = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { execute, ...getAllAssessmentPeriods } = useService(AssessmentPeriodService.getAll);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const pagination = usePagination({ totalData: getAllAssessmentPeriods.totalData });

  const assessmentPeriods = getAllAssessmentPeriods.data ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};

  const fetchAssessmentPeriods = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      renstra_id: detailSkp.renstra_id
    });
  }, [detailSkp.renstra_id, execute, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchDetailSkp({ token, id });
  }, [fetchDetailSkp, id, token]);

  React.useEffect(() => {
    if (detailSkp?.posjab?.[0]) {
      fetchAssessmentPeriods();
    }
  }, [detailSkp?.posjab, fetchAssessmentPeriods]);

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
    <Card>
      <div className="flex flex-col gap-y-6">
        <Skeleton loading={getAllDetailSkp.isLoading}>
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
        </Skeleton>
        <Skeleton loading={getAllAssessmentPeriods.isLoading}>
          <DataTable data={assessmentPeriods} columns={column} loading={getAllAssessmentPeriods.isLoading} map={(period) => ({ key: period.id, ...period })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default SkpAssessmentPeriod;
