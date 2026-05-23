import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RhkPenilaianService, RhkService, SkpsService, AssessmentPeriodService } from '@/services';
import { Badge, Button, Card, Descriptions, Skeleton, Table, Typography, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lampiranColumn, perilakuColumns } from './Columns';
import { InputType } from '@/constants';
import { SKP_STATUS } from '@/constants/SkpStatus';
import dateFormatter from '@/utils/dateFormatter';
import { PageExplanation } from '@/components';

const DetailSkpPenilaian = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpByAssessmentPeriod);
  const { execute: fetchAssessmentPeriod, ...getAssessmentPeriod } = useService(AssessmentPeriodService.getById);
  const { execute: fetchAvailableRhks, ...getAvailableRhks } = useService(RhkService.getBySkp);
  const storeRhkPenilaian = useService(RhkPenilaianService.store);
  const deleteRhkPenilaian = useService(RhkPenilaianService.delete);
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);
  const [selectedJabatanIndex, setSelectedJabatanIndex] = React.useState(0);

  const detailSkp = getAllDetailSkp.data ?? {};
  const assessmentPeriod = getAssessmentPeriod.data ?? {};
  const rhks = detailSkp.rhks ?? [];
  const availableRhks = getAvailableRhks.data?.rhks ?? [];
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  React.useEffect(() => {
    if (!token || !id || !assessment_periode_id) return;
    fetchDetailSkp();
    fetchAvailableRhks({ token: token, skp_id: id });
    fetchAssessmentPeriod(token, assessment_periode_id);
  }, [fetchDetailSkp, fetchAvailableRhks, fetchAssessmentPeriod, id, token, assessment_periode_id]);

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
      setSelectedJabatanIndex(0);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

  const flattenData = (rhkList) => {
    const rows = [];

    rhkList.forEach((rhk) => {
      const aspeks = rhk.rhkAspeks || [];
      aspeks.forEach((aspek, idx) => {
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
          rhkRowSpan: idx === 0 ? aspeks.length : 0
        });
      });
    });

    return rows;
  };

  const handleDeleteRhkPenilaian = (rhkId) => {
    modal.delete.default({
      title: 'Hapus RHK Penilaian',
      onSubmit: async () => {
        const { isSuccess, message } = await deleteRhkPenilaian.execute(rhkId, assessment_periode_id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <PageExplanation 
        title={`${Modul.SKP} - Penilaian`}
        subTitle="Lihat detail SKP dan kelola penilaian kinerja."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>,
          },
          {
            title: 'Penilaian',
          },
        ]}
      />

      <div className="flex flex-col gap-y-4">
        <Card>
          <Skeleton loading={getAllDetailSkp.isLoading}>
            <div className="flex flex-col gap-y-6">
              {/* Assessment Period Detail - Top */}
              <Descriptions title="Detail Periode Penilaian" size="default" column={3} bordered>
                <Descriptions.Item label="Nama Periode">{assessmentPeriod.name}</Descriptions.Item>
                <Descriptions.Item label="Periode Mulai">{dateFormatter(assessmentPeriod.startDate)}</Descriptions.Item>
                <Descriptions.Item label="Periode Akhir">{dateFormatter(assessmentPeriod.endDate)}</Descriptions.Item>
              </Descriptions>

              {/* Jabatan Selection */}
              {detailSkp?.jabatan && detailSkp.jabatan.length > 0 && (
                <div>
                  <Typography.Title level={5}>Pilih Jabatan</Typography.Title>
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

              {/* SKP Detail */}
              <Descriptions size="default" column={3} bordered>
                <Descriptions.Item label="Periode Mulai">{dateFormatter(detailSkp.startDate)}</Descriptions.Item>
                <Descriptions.Item label="Periode Akhir">{dateFormatter(detailSkp.endDate)}</Descriptions.Item>
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

            {/* Officers Information */}
            <div className="flex flex-row gap-x-4">
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
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Rencana Hasil Kerja Utama</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.RHK_PENILAIAN}`,
                      formFields: [
                        {
                          label: `RHK`,
                          name: 'rhk_id',
                          type: InputType.SELECT,
                          rules: [
                            {
                              required: true,
                              message: `Rencana hasil kerja harus diisi`
                            }
                          ],
                          size: 'large',
                          options: availableRhks.filter(r => r.jenis === 'Utama').map((item) => ({
                            label: item.desc,
                            value: item.id
                          }))
                        }
                      ],
                      onSubmit: async (values) => {
                        const { isSuccess, message } = await storeRhkPenilaian.execute({ skpId: id, rhkId: values.rhk_id, periodePenilaianId: assessment_periode_id }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchDetailSkp();
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  Tambah RHK Penilaian
                </Button>
              </div>
            </div>
            <Table
              bordered
              columns={[
                {
                  title: 'Rencana Hasil Kerja',
                  dataIndex: 'rhkDesc',
                  key: 'rhkDesc',
                  width: 150,
                  render: (text, record) => {
                    return {
                      children: (
                        <div className="flex flex-col gap-2">
                          <span>{text}</span>
                          {record.rhkRowSpan !== 0 && (
                            <Button
                              icon={<DeleteOutlined />}
                              variant="solid"
                              color="danger"
                              onClick={() => handleDeleteRhkPenilaian(record.rhkId)}
                              size="small"
                              className="w-fit"
                            >
                              Hapus
                            </Button>
                          )}
                        </div>
                      ),
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                },
                {
                  title: 'Klasifikasi',
                  dataIndex: 'klasifikasi',
                  key: 'klasifikasi',
                  width: 100,
                  render: (text, record) => {
                    return {
                      children: text,
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                },
                {
                  title: 'Aspek',
                  dataIndex: 'aspekJenis',
                  key: 'aspekJenis',
                  width: 120
                },
                ...(detailSkp.pendekatan === 'KUALITATIF' ? [{
                  title: 'Indikator Kinerja Individu',
                  dataIndex: 'aspekDesc',
                  key: 'aspekDesc',
                  width: 150
                }] : []),
                ...(detailSkp.pendekatan === 'KUANTITATIF' ? [{
                  title: 'Indikator Kinerja',
                  dataIndex: 'indikator_name',
                  key: 'indikator_name',
                  width: 150
                },
                {
                  title: 'Target',
                  dataIndex: 'indikator_target',
                  key: 'indikator_target',
                  width: 100,
                  render: (text, record) => `${text} ${record.indikator_satuan}`
                }] : []),
                {
                  title: 'Penugasan',
                  dataIndex: 'penugasan',
                  key: 'penugasan',
                  width: 150,
                  render: (text, record) => {
                    return {
                      children: text,
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                }
              ]}
              dataSource={flattenData(detailSkp?.rhks?.filter((item) => item.jenis === 'Utama') ?? [])}
              pagination={false}
              rowKey={(record) => `${record.rhkId}-${record.aspekId}`}
            />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Rencana Hasil Kerja Tambahan</Typography.Title>
              </div>
            </div>
            <Table
              bordered
              columns={[
                {
                  title: 'Rencana Hasil Kerja',
                  dataIndex: 'rhkDesc',
                  key: 'rhkDesc',
                  width: 150,
                  render: (text, record) => {
                    return {
                      children: (
                        <div className="flex flex-col gap-2">
                          <span>{text}</span>
                          {record.rhkRowSpan !== 0 && (
                            <Button
                              icon={<DeleteOutlined />}
                              variant="solid"
                              color="danger"
                              onClick={() => handleDeleteRhkPenilaian(record.rhkId)}
                              size="small"
                              className="w-fit"
                            >
                              Hapus
                            </Button>
                          )}
                        </div>
                      ),
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                },
                {
                  title: 'Klasifikasi',
                  dataIndex: 'klasifikasi',
                  key: 'klasifikasi',
                  width: 100,
                  render: (text, record) => {
                    return {
                      children: text,
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                },
                {
                  title: 'Aspek',
                  dataIndex: 'aspekJenis',
                  key: 'aspekJenis',
                  width: 120
                },
                ...(detailSkp.pendekatan === 'KUALITATIF' ? [{
                  title: 'Indikator Kinerja Individu',
                  dataIndex: 'aspekDesc',
                  key: 'aspekDesc',
                  width: 150
                }] : []),
                ...(detailSkp.pendekatan === 'KUANTITATIF' ? [{
                  title: 'Indikator Kinerja',
                  dataIndex: 'indikator_name',
                  key: 'indikator_name',
                  width: 150
                },
                {
                  title: 'Target',
                  dataIndex: 'indikator_target',
                  key: 'indikator_target',
                  width: 100,
                  render: (text, record) => `${text} ${record.indikator_satuan}`
                }] : []),
                {
                  title: 'Penugasan',
                  dataIndex: 'penugasan',
                  key: 'penugasan',
                  width: 150,
                  render: (text, record) => {
                    return {
                      children: text,
                      props: { rowSpan: record.rhkRowSpan }
                    };
                  }
                }
              ]}
              dataSource={flattenData(detailSkp?.rhks?.filter((item) => item.jenis === 'Tambahan') ?? [])}
              pagination={false}
              rowKey={(record) => `${record.rhkId}-${record.aspekId}`}
            />
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
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'SUMBER_DATA')?.value ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Skema</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'SKEMA')?.value ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Konsekuensi</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2"></div>
            </div>
            <Table bordered columns={lampiranColumn()} dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'KONSEKUENSI')?.value ?? []} pagination={false} />
            </div>
          </Skeleton>
        </Card>
      </div>
    </>
  );
};

export default DetailSkpPenilaian;
