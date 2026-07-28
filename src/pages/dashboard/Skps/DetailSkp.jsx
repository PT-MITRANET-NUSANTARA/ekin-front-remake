import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { SkpsService } from '@/services';
import { Alert, Badge, Button, Card, Descriptions, Popconfirm, Skeleton, Table, Typography, Select, Modal, Space } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { lampiranFormFields } from './FormFields';
import { lampiranColumn, perilakuColumns } from './Columns';
import { DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageExplanation } from '@/components';
import { SKP_STATUS } from '@/constants/SkpStatus';

const DetailSkp = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getById);
  const updateSkp = useService(SkpsService.update);
  const deleteSKp = useService(SkpsService.delete);
  const submitSkp = useService(SkpsService.submitSkp);
  const approveSkp = useService(SkpsService.approveSkp);
  const rejectSkp = useService(SkpsService.rejectSkp);
  const pagination = usePagination({ totalData: getAllDetailSkp.totalData });
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);
  const [selectedJabatanIndex, setSelectedJabatanIndex] = React.useState(0);
  const [statusHistoryModal, setStatusHistoryModal] = React.useState(false);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
  const [reviewRemarks, setReviewRemarks] = React.useState('');

  // Define data variables first
  const detailSkp = getAllDetailSkp.data ?? {};
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token, id, page: pagination.page, per_page: pagination.per_page });
  }, [execute, id, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp, token]);

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
      setSelectedJabatanIndex(0);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

  const handleStoreLampiran = (type) => {
    modal.create({
      title: `Tambah ${type.replace('_', ' ')}`,
      formFields: lampiranFormFields,
      onSubmit: async (values) => {
        // Build lampirans object from current skpLampirans
        const lampirans = {
          SUMBER_DATA: detailSkp?.skpLampirans?.find(l => l.name === 'SUMBER_DATA')?.value ?? [],
          SKEMA: detailSkp?.skpLampirans?.find(l => l.name === 'SKEMA')?.value ?? [],
          KONSEKUENSI: detailSkp?.skpLampirans?.find(l => l.name === 'KONSEKUENSI')?.value ?? []
        };

        // Add new lampiran to the appropriate type
        lampirans[type] = [...(lampirans[type] ?? []), values.name];

        const { isSuccess, message } = await updateSkp.execute(detailSkp.id, { lampirans }, token);

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

  const handleDeleteLampiran = (type, index) => {
    modal.delete.default({
      title: `Hapus ${type.replace('_', ' ')}`,
      onSubmit: async () => {
        // Build lampirans object from current skpLampirans
        const lampirans = {
          SUMBER_DATA: detailSkp?.skpLampirans?.find(l => l.name === 'SUMBER_DATA')?.value ?? [],
          SKEMA: detailSkp?.skpLampirans?.find(l => l.name === 'SKEMA')?.value ?? [],
          KONSEKUENSI: detailSkp?.skpLampirans?.find(l => l.name === 'KONSEKUENSI')?.value ?? []
        };

        // Remove lampiran at specified index
        lampirans[type] = lampirans[type].filter((_, i) => i !== index);

        const { isSuccess, message } = await updateSkp.execute(detailSkp.id, { lampirans }, token);

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

  const handleAjukanSkp = async (data) => {
    const isOwner = data.nip === user?.nip_baru;
    const canSubmit = data.status === SKP_STATUS.DRAFT || data.status === SKP_STATUS.REJECTED;
    
    if (!isOwner || !canSubmit) {
      error('Gagal', 'Hanya pemilik SKP dalam status DRAFT atau REJECTED yang dapat mengajukan');
      return false;
    }

    const { isSuccess, message } = await submitSkp.execute(data.id, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchDetailSkp();
      return true;
    } else {
      error('Gagal', message);
      return false;
    }
  };

  const handleApproveSkp = async () => {
    const { isSuccess, message } = await approveSkp.execute(id, {}, token);
    if (isSuccess) {
      success('Berhasil', message);
      setReviewModalOpen(false);
      setReviewRemarks('');
      fetchDetailSkp();
    } else {
      error('Gagal', message);
    }
  };

  const handleRejectSkp = async () => {
    if (!reviewRemarks.trim()) {
      error('Gagal', 'Keterangan penolakan harus diisi');
      return;
    }
    const { isSuccess, message } = await rejectSkp.execute(id, { remarks: reviewRemarks }, token);
    if (isSuccess) {
      success('Berhasil', message);
      setReviewModalOpen(false);
      setReviewRemarks('');
      fetchDetailSkp();
    } else {
      error('Gagal', message);
    }
  };

  const handleDeleteSkp = (data) => {
    modal.delete.default({
      title: `Delete ${Modul.SKP}`,
      data: data,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSKp.execute(data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          navigate('/dashboard/skps');
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case SKP_STATUS.DRAFT:
        return <Badge status="processing" text="Draft" />;
      case SKP_STATUS.SUBMITTED:
        return <Badge status="warning" text="Submitted" />;
      case SKP_STATUS.REJECTED:
        return <Badge status="error" text="Rejected" />;
      case SKP_STATUS.APPROVED:
        return <Badge status="success" text="Approved" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const isSkpOwner = detailSkp.nip === user?.nip_baru;
  const isReviewer = detailSkp?.parentSkps?.some(
    (skp) => String(skp?.nip) === String(user?.nip_baru)
  ) ?? false;

  console.log('isReviewer:', isReviewer, 'parentSkps:', detailSkp.parentSkps, 'user nip:', user?.nip_baru, 'status:', detailSkp.status);
  
  // Get rejection or approval status info
  const getRejectionOrApprovalInfo = () => {
    if (detailSkp.status === SKP_STATUS.REJECTED || detailSkp.status === SKP_STATUS.APPROVED) {
      const statusHistory = detailSkp?.statuses ?? [];
      const rejectionOrApproval = statusHistory.find(
        (s) => s.value === detailSkp.status
      );
      return rejectionOrApproval;
    }
    return null;
  };

  const statusInfo = getRejectionOrApprovalInfo();

  return (
    <>
      <PageExplanation 
        title={Modul.SKP}
        subTitle="Kelola detail SKP (Sasaran Kinerja Pegawai) dan rencana hasil kerja Anda dengan mudah."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>,
          },
          {
            title: 'Detail SKP',
          },
        ]}
        actions={
          <Space size="middle">
            <Button 
              variant="solid" 
              color="primary" 
              icon={<DownloadOutlined />} 
              onClick={() => navigate(window.location.pathname + `/download`)}
            >
              Download SKP
            </Button>
            {isSkpOwner && (detailSkp.status === SKP_STATUS.DRAFT || detailSkp.status === SKP_STATUS.REJECTED) && (
              <Popconfirm 
                title="Apakah anda yakin ingin mengajukan SKP?" 
                onConfirm={() => handleAjukanSkp(detailSkp)}
              >
                <Button 
                  variant="solid" 
                  color="primary"
                >
                  Ajukan SKP
                </Button>
              </Popconfirm>
            )}
            {isSkpOwner && detailSkp.status === SKP_STATUS.DRAFT && (
              <Popconfirm 
                title="Apakah anda yakin ingin menghapus SKP?" 
                onConfirm={() => handleDeleteSkp(detailSkp)}
              >
                <Button 
                  variant="solid" 
                  color="danger"
                >
                  Hapus
                </Button>
              </Popconfirm>
            )}
            {isReviewer && detailSkp.status === 'SUBMITEED' && (
              <Button 
                variant="solid" 
                color="primary"
                onClick={() => setReviewModalOpen(true)}
              >
                Tinjau SKP
              </Button>
            )}
          </Space>
        }
      />

      {statusInfo && (
        <Alert
          message={detailSkp.status === SKP_STATUS.REJECTED ? '❌ SKP Ditolak' : '✅ SKP Disetujui'}
          type={detailSkp.status === SKP_STATUS.REJECTED ? 'error' : 'success'}
          description={
            <div className="flex flex-col gap-y-2 mt-1">
              {statusInfo?.remarks && (
                <div>
                  <strong>Keterangan:</strong> {statusInfo.remarks}
                </div>
              )}
              {statusInfo?.createdAt && (
                <div className="text-xs">
                  <strong>Tanggal:</strong> {dayjs(statusInfo.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </div>
              )}
            </div>
          }
          style={{ marginBottom: '16px' }}
        />
      )}

      <Card>
        <Skeleton loading={getAllDetailSkp.isLoading}>
          <div className="flex flex-col gap-y-6">
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
                    label: `${jabatan.nama_jabatan} - ${jabatan.unor.nama}`,
                    value: jabatan.id_posjab
                  }))}
                />
              </div>
            )}

            {/* Main Info */}
            <Descriptions size="default" column={3} bordered>
              <Descriptions.Item label="Periode Mulai">{dayjs(detailSkp.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Periode Akhir">{dayjs(detailSkp.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Renstra">{detailSkp.renstra?.name}</Descriptions.Item>
              <Descriptions.Item label="Pendekatan">{detailSkp.pendekatan}</Descriptions.Item>
              <Descriptions.Item label="Cascading">{detailSkp.cascading}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Button type="text" onClick={() => setStatusHistoryModal(true)} style={{ padding: 0 }}>
                  {getStatusBadge(detailSkp.status)}
                </Button>
              </Descriptions.Item>
            </Descriptions>

            {/* Employee Info */}
            <div className="flex flex-row gap-x-4">
              <Descriptions title="Pejabat yang dinilai" size="small" column={1} bordered>
                <Descriptions.Item label="Nama">{currentJabatan?.nama_asn ?? ''}</Descriptions.Item>
                <Descriptions.Item label="NIP">{currentJabatan?.nip_asn ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Jabatan">{currentJabatan?.nama_jabatan ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Unit Kerja">{currentJabatan?.unor?.nama ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Eselon">{currentJabatan?.eselon?.nama ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Golongan">{currentJabatan?.golongan_pns?.nama ?? ''}</Descriptions.Item>
              </Descriptions>
              <Descriptions title="Pejabat penilai kinerja" size="small" column={1} bordered>
                <Descriptions.Item label="Nama">{detailSkp?.parentSkps?.[0]?.jabatan?.[selectedJabatanIndex]?.nama_asn ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="NIP">{detailSkp?.parentSkps?.[0]?.jabatan?.[selectedJabatanIndex]?.nip_asn ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Jabatan">{detailSkp?.parentSkps?.[0]?.jabatan?.[selectedJabatanIndex]?.nama_jabatan ?? '-'}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* Perilaku Kinerja */}
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Perilaku Kinerja</Typography.Title>
              </div>
            </div>
            <Table bordered columns={perilakuColumns()} dataSource={detailSkp?.perilaku_id ?? []} pagination={false} />

            {/* Lampiran */}
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Sumber Data</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {detailSkp.nip === user?.nip_baru && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('SUMBER_DATA')}>
                    Tambah Sumber Data
                  </Button>
                )}
              </div>
            </div>
            <Table
              bordered
              columns={lampiranColumn(handleDeleteLampiran, 'SUMBER_DATA')}
              dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'SUMBER_DATA')?.value?.map((item) => ({ name: item })) ?? []}
              pagination={false}
            />

            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Skema</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {detailSkp.nip === user?.nip_baru && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('SKEMA')}>
                    Tambah Skema
                  </Button>
                )}
              </div>
            </div>
            <Table
              bordered
              columns={lampiranColumn(handleDeleteLampiran, 'SKEMA')}
              dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'SKEMA')?.value?.map((item) => ({ name: item })) ?? []}
              pagination={false}
            />

            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Konsekuensi</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {detailSkp.nip === user?.nip_baru && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('KONSEKUENSI')}>
                    Tambah Konsekuensi
                  </Button>
                )}
              </div>
            </div>
            <Table
              bordered
              columns={lampiranColumn(handleDeleteLampiran, 'KONSEKUENSI')}
              dataSource={detailSkp?.skpLampirans?.find(l => l.name === 'KONSEKUENSI')?.value?.map((item) => ({ name: item })) ?? []}
              pagination={false}
            />
          </div>
        </Skeleton>
      </Card>

      {/* Status History Modal */}
      <Modal
        title="Status History"
        open={statusHistoryModal}
        onCancel={() => setStatusHistoryModal(false)}
        footer={null}
        width={600}
      >
        <Table
          columns={[
            {
              title: 'Status',
              dataIndex: 'value',
              render: (status) => getStatusBadge(status)
            },
            {
              title: 'Tanggal',
              dataIndex: 'createdAt',
              render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss')
            },
            {
              title: 'Keterangan',
              dataIndex: 'remarks',
              render: (remarks) => remarks || '-'
            }
          ]}
          dataSource={detailSkp?.statuses ?? []}
          pagination={false}
          rowKey={(record) => record.id}
        />
      </Modal>

      <Modal
        title="Tinjau SKP"
        open={reviewModalOpen}
        onCancel={() => {
          setReviewModalOpen(false);
          setReviewRemarks('');
        }}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Keterangan Penolakan:</strong></p>
          <textarea
            style={{ 
              width: '100%', 
              minHeight: '100px', 
              padding: '8px', 
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              fontSize: '14px'
            }}
            placeholder="Masukkan keterangan penolakan (opsional untuk persetujuan, wajib untuk penolakan)"
            value={reviewRemarks}
            onChange={(e) => setReviewRemarks(e.target.value)}
          />
        </div>
        <Space style={{ marginTop: '20px' }}>
          <Button 
            variant="solid" 
            color="primary"
            onClick={handleApproveSkp}
          >
            Setujui
          </Button>
          <Button 
            variant="solid" 
            color="danger"
            onClick={handleRejectSkp}
          >
            Tolak
          </Button>
          <Button 
            onClick={() => {
              setReviewModalOpen(false);
              setReviewRemarks('');
            }}
          >
            Batal
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default DetailSkp;

