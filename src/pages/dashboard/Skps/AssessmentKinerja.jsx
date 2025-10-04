import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { FeedbackKinerjaService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Rate, Skeleton, Table, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RhkColumn } from './Columns';
import { DeleteOutlined, EditOutlined, PlusOutlined, StarFilled, WarningFilled } from '@ant-design/icons';
import { descFormField } from './FormFields';
import Modul from '@/constants/Modul';
import { InputType } from '@/constants';
import isSkpBawahan from '@/utils/isSkpAtasan';

const AssessmentKinerja = () => {
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpAssessment);
  const storeFeedbackKinerja = useService(FeedbackKinerjaService.store);
  const updateFeedbackKinerja = useService(FeedbackKinerjaService.update);
  const deleteFeedbackKinerja = useService(FeedbackKinerjaService.delete);
  const storePenilaian = useService(FeedbackKinerjaService.storePenilaian);

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp, id, token, user?.newNip]);

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
          feedback_aspek: aspek?.feedback_aspek?.desc ?? '',
          feedback_aspek_id: aspek?.feedback_aspek?.id ?? '',
          rhkRowSpan: idx === 0 ? rhk.aspek.length : 0
        });
      });
    });

    return rows;
  };

  const handleCreateFeedback = (data) => {
    modal.create({
      title: `Tambah ${Modul.FEEDBACK_KINERJA}`,
      formFields: descFormField(),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeFeedbackKinerja.execute({ ...values, aspek_id: data.aspekId, periode_penilaian_id: assessment_periode_id }, token);
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
      data: { ...data, desc: data.feedback_aspek },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateFeedbackKinerja.execute(data.feedback_aspek_id, values, token);
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
        const { isSuccess, message } = await deleteFeedbackKinerja.execute(data.feedback_aspek_id, token);
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
      title: `Buat penilaian kinerja`,
      formFields: [
        {
          label: `Penilaian Kinerja SKP`,
          name: 'rating_kinerja',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: `Penilaian Kinerja SKP harus diisi`
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
              {!detailSkp?.penilaian || !detailSkp.penilaian.rating_kinerja || parseFloat(detailSkp.penilaian.rating_kinerja) <= 0 ? 'Tambah Penilaian Kinerja' : 'Ubah Nilai'}
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
        const rating = parseFloat(detailSkp.penilaian.rating_kinerja || '0');
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
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Rencana Hasil Kerja Utama</Typography.Title>
              </div>
            </div>
            <Table
              bordered
              columns={[
                ...RhkColumn(),
                {
                  title: 'Feedback',
                  dataIndex: 'rhkId',
                  render: (_, record) => (
                    <div className="flex flex-col gap-y-2">
                      {record.feedback_aspek ? (
                        <p>{record.feedback_aspek}</p>
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
                            <Button className="w-fit" onClick={() => handleCreateFeedback(record)} icon={<PlusOutlined />} variant="outlined" color="primary" disabled={record.feedback_aspek} />
                            <Button className="w-fit" onClick={() => handleUpdateFeedback(record)} icon={<EditOutlined />} variant="outlined" color="primary" disabled={!record.feedback_aspek} />
                            <Button className="w-fit" onClick={() => handleDeleteFeedback(record)} icon={<DeleteOutlined />} variant="outlined" color="danger" disabled={!record.feedback_aspek} />
                          </div>
                        </>
                      )}
                    </div>
                  )
                }
              ]}
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
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default AssessmentKinerja;
