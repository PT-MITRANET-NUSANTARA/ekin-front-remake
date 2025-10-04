import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { FeedbackPerilakuService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Rate, Skeleton, Table } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { perilakuColumns } from './Columns';
import { DeleteOutlined, EditOutlined, PlusOutlined, StarFilled, WarningFilled } from '@ant-design/icons';
import Modul from '@/constants/Modul';
import { descFormField } from './FormFields';
import { InputType } from '@/constants';
import isSkpBawahan from '@/utils/isSkpAtasan';

const AssessmentPerilaku = () => {
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpAssessment);
  const storeFeedbackPerilaku = useService(FeedbackPerilakuService.store);
  const updateFeedbackPerilaku = useService(FeedbackPerilakuService.update);
  const deleteFeedbackPerilaku = useService(FeedbackPerilakuService.delete);
  const storePenilaian = useService(FeedbackPerilakuService.storePenilaian);

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp]);

  const detailSkp = getAllDetailSkp.data ?? {};

  const handleCreateFeedback = (data) => {
    modal.create({
      title: `Tambah ${Modul.FEEDBACK_PERILAKU}`,
      formFields: descFormField(),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeFeedbackPerilaku.execute({ ...values, perilaku_id: data.id, periode_penilaian_id: assessment_periode_id }, token);
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

  const handleUpdateFeedback = (data) => {
    modal.edit({
      title: `Edit ${Modul.FEEDBACK_KINERJA}`,
      formFields: descFormField(),
      data: { ...data, desc: data.feedback_perilaku.desc },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateFeedbackPerilaku.execute(data.feedback_perilaku.id, values, token);
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

  const handleDeleteFeedback = (data) => {
    modal.delete.default({
      title: `Hapus ${Modul.FEEDBACK_KINERJA}`,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteFeedbackPerilaku.execute(data.feedback_perilaku.id, token);
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

  const handleCreatePenilaian = () => {
    modal.create({
      title: `Buat Penilaian Perilaku`,
      formFields: [
        {
          label: `Penilaian Kinerja SKP`,
          name: 'rating_perilaku',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: `Penilaian Perilaku SKP harus diisi`
            }
          ],
          size: 'large',
          options: [
            { label: <Rate value={5} disabled />, value: 5 },
            { label: <Rate value={4} disabled />, value: 4 },
            { label: <Rate value={3} disabled />, value: 3 },
            { label: <Rate value={2} disabled />, value: 2 },
            { label: <Rate value={1} disabled />, value: 1 }
          ]
        }
      ],
      onSubmit: async (values) => {
        const { isSuccess, message } = await storePenilaian.execute({ ...values, skp_dinilai_id: detailSkp.id, skp_penilai_id: detailSkp.atasan_skp[0].id, periode_penilaian_id: assessment_periode_id }, token);
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
              {!detailSkp?.penilaian || !detailSkp.penilaian.rating_perilaku || parseFloat(detailSkp.penilaian.rating_perilaku) <= 0 ? 'Tambah Penilaian Perilaku' : 'Ubah Nilai'}
            </Button>
          )}
        </div>
      </div>
      {(() => {
        if (!detailSkp?.penilaian) {
          return (
            <Card>
              <div>
                Penilaian SKP ini <b>belum ada</b>.
              </div>
            </Card>
          );
        }
        const rating = parseFloat(detailSkp.penilaian.rating_perilaku || '0');
        if (rating > 0) {
          return (
            <Card>
              <div>
                Kinerja dalam SKP ini telah dilakukan penilaian, dengan perolehan nilai <StarFilled className="text-yellow-400" /> <b>{rating}/5</b>
              </div>
            </Card>
          );
        }
        return (
          <Card>
            <div>
              Perilaku dalam SKP ini <b>belum dinilai</b>.
            </div>
          </Card>
        );
      })()}

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
            <Table
              bordered
              columns={[
                ...perilakuColumns(),
                {
                  title: 'Feedback',
                  dataIndex: 'rhkId',
                  render: (_, record) => (
                    <div className="flex flex-col gap-y-2">
                      {record.feedback_perilaku ? (
                        <p>{record.feedback_perilaku.desc}</p>
                      ) : (
                        <div className="inline-flex items-center gap-x-2">
                          <WarningFilled className="text-yellow-500" />
                          Feedback Belum Di Tambahkan !
                        </div>
                      )}
                      {isSkpBawahan(detailSkp, user) && (
                        <>
                          <hr />
                          <div className="flex items-center gap-x-2">
                            <Button className="w-fit" onClick={() => handleCreateFeedback(record)} icon={<PlusOutlined />} variant="outlined" color="primary" disabled={record.feedback_perilaku} />
                            <Button className="w-fit" onClick={() => handleUpdateFeedback(record)} icon={<EditOutlined />} variant="outlined" color="primary" disabled={!record.feedback_perilaku} />
                            <Button className="w-fit" onClick={() => handleDeleteFeedback(record)} icon={<DeleteOutlined />} variant="outlined" color="danger" disabled={!record.feedback_perilaku} />
                          </div>
                        </>
                      )}
                    </div>
                  )
                }
              ]}
              dataSource={detailSkp?.perilaku_id ?? []}
              pagination={false}
            />
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default AssessmentPerilaku;
