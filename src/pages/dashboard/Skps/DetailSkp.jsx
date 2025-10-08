import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RhkService, RktsService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Popconfirm, Skeleton, Table, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { aspekFormFields, lampiranFormFields, rhkFormFields } from './FormFields';
import { lampiranColumn, perilakuColumns, RhkColumn } from './Columns';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DetailSkp = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchRkts, ...getAllRkts } = useService(RktsService.getAll);
  const updateSkp = useService(SkpsService.update);
  const deleteSKp = useService(SkpsService.delete);
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

  const handleDeleteRhk = (record) => {
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

  const handleStoreLampiran = (type) => {
    modal.create({
      title: `Tambah ${type.replace('_', ' ')}`,
      formFields: lampiranFormFields,
      onSubmit: async (values) => {
        const prevLampiran = detailSkp?.lampiran ?? {
          sumber_daya: [],
          skema: [],
          konsekuensi: []
        };

        const newLampiran = {
          ...prevLampiran,
          [type]: [...(prevLampiran[type] ?? []), values]
        };

        const { isSuccess, message } = await updateSkp.execute(detailSkp.id, { lampiran: newLampiran }, token);

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

  const handleDeleteLampiran = (type, index) => {
    modal.delete.default({
      title: `Hapus ${type.replace('_', ' ')}`,
      onSubmit: async () => {
        const prevLampiran = detailSkp?.lampiran ?? {
          sumber_daya: [],
          skema: [],
          konsekuensi: []
        };

        const newLampiran = {
          ...prevLampiran,
          [type]: prevLampiran[type].filter((_, i) => i !== index)
        };

        const { isSuccess, message } = await updateSkp.execute(detailSkp.id, { lampiran: newLampiran }, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const handleAjukanSkp = async (data) => {
    const { isSuccess, message } = await updateSkp.execute(data.id, { status: 'SUBMITTED' }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchDetailSkp({ token, page: pagination.page, per_page: pagination.per_page });
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  const handleDeleteSkp = (data) => {
    modal.delete.default({
      title: `Delete ${Modul.SKP_BAWAHAN}`,
      data: data,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSKp.execute(data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token, page: pagination.page, per_page: pagination.per_page });
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
          <Button variant="solid" color="primary" icon={<DownloadOutlined />} onClick={() => navigate(`/dashboard/skp-download/${id}`)}>
            Download SKP
          </Button>
          <Popconfirm title="Apakah anda yakin ingin mengajukan SKP?" onConfirm={() => handleAjukanSkp(detailSkp)}>
            <Button variant="solid" color="primary" disabled={detailSkp.status !== 'DRAFT' || !user?.isJpt}>
              Ajukan SKP
            </Button>
          </Popconfirm>
          <Popconfirm title="Apakah anda yakin ingin menghapus SKP?" onConfirm={() => handleDeleteSkp(detailSkp)}>
            <Button disabled={!user?.isJpt} variant="solid" color="danger">
              Hapus
            </Button>
          </Popconfirm>
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
              <div className="inline-flex items-center gap-x-2">
                {user?.isJpt && user?.newNip === detailSkp.user_id && (
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
              columns={[
                ...RhkColumn({ updateAspek: handleUpdateAspek, detailSkp: detailSkp, user: user }),
                {
                  title: 'Aksi',
                  dataIndex: 'rhkId',
                  render: (_, row) => {
                    const children =
                      deleteRhk && user?.isJpt && user?.newNip === detailSkp.user_id ? (
                        <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => handleDeleteRhk(row)}>
                          Hapus
                        </Button>
                      ) : null;

                    return {
                      children,
                      props: { rowSpan: row.rhkRowSpan }
                    };
                  }
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
            <Table
              bordered
              columns={[
                ...RhkColumn({ updateAspek: handleUpdateAspek, detailSkp: detailSkp, user: user }),
                {
                  title: 'Aksi',
                  dataIndex: 'rhkId',
                  render: (_, row) => {
                    const children =
                      deleteRhk && user?.isJpt && user?.newNip === detailSkp.user_id ? (
                        <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => handleDeleteRhk(row)}>
                          Hapus
                        </Button>
                      ) : null;

                    return {
                      children,
                      props: { rowSpan: row.rhkRowSpan }
                    };
                  }
                }
              ]}
              dataSource={flattenData(detailSkp?.rhk?.filter((item) => item.jenis === 'TAMBAHAN') ?? [])}
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
              <div className="inline-flex items-center gap-x-2">
                {user?.isJpt && user?.newNip === detailSkp.user_id && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('sumber_daya')}>
                    Tambah Sumber Daya
                  </Button>
                )}
              </div>
            </div>
            <Table bordered columns={lampiranColumn(handleDeleteLampiran, 'sumber_daya')} dataSource={detailSkp?.lampiran?.sumber_daya ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Skema</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {user?.isJpt && user?.newNip === detailSkp.user_id && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('skema')}>
                    Tambah Skema
                  </Button>
                )}
              </div>
            </div>
            <Table bordered columns={lampiranColumn(handleDeleteLampiran, 'skema')} dataSource={detailSkp?.lampiran?.skema ?? []} pagination={false} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <Typography.Title level={5}>Lampiran Konsekuensi</Typography.Title>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {user?.isJpt && user?.newNip === detailSkp.user_id && (
                  <Button variant="solid" color="primary" onClick={() => handleStoreLampiran('konsekuensi')}>
                    Tambah konsekuensi
                  </Button>
                )}
              </div>
            </div>
            <Table bordered columns={lampiranColumn(handleDeleteLampiran, 'konsekuensi')} dataSource={detailSkp?.lampiran?.konsekuensi ?? []} pagination={false} />
          </div>
        </Skeleton>
      </Card>
    </div>
  );
};

export default DetailSkp;
