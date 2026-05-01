import { PageExplanation } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RhkService, RktsService, SkpsService } from '@/services';
import { CheckCircleFilled, CloseCircleFilled, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Drawer, List, Skeleton, Tag, Typography, Popconfirm } from 'antd';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aspekFormFields, mphFormFields } from './FormFields';
import Modul from '@/constants/Modul';
import dayjs from 'dayjs';

const Mph = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRhks } = useService(SkpsService.getSkpRhks);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchRkts, ...getAllRkts } = useService(RktsService.getAll);
  const addRhk = useService(RhkService.addToSkp);
  const deleteRhk = useService(RhkService.delete);
  const updateRhk = useService(RhkService.updateInSkp);
  const updateAspek = useService(SkpsService.aspekUpdate);
  const pagination = usePagination({ totalData: getAllRhks.totalData });
  const [drawer, setDrawer] = React.useState({ open: false, data: {}, placement: 'right' });

  const isJpt = user?.roles?.includes('JPT');

  const fetchMatriks = React.useCallback(() => {
    execute({ token, id, page: pagination.page, per_page: pagination.per_page });
  }, [execute, id, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchMatriks();
    fetchDetailSkp({ token, id });
    fetchRkts({ token: token, page: 1, perPage: 1000 });
  }, [fetchMatriks, fetchDetailSkp, fetchRkts, id, token]);

  const rhksData = getAllRhks.data?.rhks ?? [];
  const parentSkpRhks = getAllRhks.data?.parentSkpRhk ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};
  const canEdit = detailSkp?.isJPT ?? false;

  React.useEffect(() => {
    console.log('Mph Debug:', { isJpt, user, canEdit, status: detailSkp?.status });
  }, [isJpt, user, canEdit, detailSkp?.status]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT':
        return <Badge status="processing" text="Draft" />;
      case 'SUBMITTED':
        return <Badge status="warning" text="Submitted" />;
      case 'REJECTED':
        return <Badge status="error" text="Rejected" />;
      case 'APPROVED':
        return <Badge status="success" text="Approved" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const handleUpdateAspek = (data) => {
    modal.edit({
      title: `Ubah ${Modul.ASPEK}`,
      formFields: aspekFormFields,
      data: { name: data?.indikator_kinerja?.name, target: data?.indikator_kinerja?.target, satuan: data?.indikator_kinerja?.satuan },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateAspek.execute(data.id, { indikator_kinerja: { ...values }, jenis: data.jenis, desc: data.desc }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMatriks();
          setDrawer({ ...drawer, open: false });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleEditRhk = (item) => {
    modal.edit({
      title: `Ubah ${Modul.RHK}`,
      formFields: mphFormFields({ options: { rkts: getAllRkts.data ?? [], isJPT: canEdit, parentRhks: parentSkpRhks } }),
      data: { 
        desc: item.desc, 
        jenis: item.jenis, 
        klasifikasi: item.klasifikasi, 
        penugasan: item.penugasan, 
        rkts: item.rhkRkts?.map(rkt => rkt.rktId) || [],
        parentRhkId: item.parentRhkId || undefined
      },
      onSubmit: async (values) => {
        const payload = {
          desc: values.desc,
          jenis: values.jenis,
          klasifikasi: values.klasifikasi,
          ...(canEdit && { penugasan: values.penugasan }),
          ...(canEdit && { rktIds: Array.isArray(values.rkts) ? values.rkts : (values.rkts ? [values.rkts] : []) }),
          ...(!canEdit && { parentRhkId: values.parentRhkId })
        };
        const { isSuccess, message } = await updateRhk.execute(id, item.id, payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMatriks();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleDeleteRhk = async (rhkId) => {
    if (!(canEdit && detailSkp.nip === user?.nip_baru)) {
      error('Gagal', 'Anda tidak memiliki izin untuk menghapus RHK ini');
      return;
    }
    const { isSuccess, message } = await deleteRhk.execute(rhkId, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchMatriks();
    } else {
      error('Gagal', message);
    }
  };

  return (
    <>
      <PageExplanation 
        title="Matriks Peran Hasil"
        subTitle="Kelola dan lihat hubungan antara RHK pimpinan dan RHK bawahan dalam matriks peran hasil."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>,
          },
          {
            title: <a onClick={() => navigate(window.location.pathname.split('/matriks')[0])}>Detail SKP</a>,
          },
          {
            title: 'Matriks Peran Hasil',
          },
        ]}
      />

      <Card title={<Typography.Title level={5} style={{ margin: 0 }}>SKP Information</Typography.Title>}>
        <Skeleton loading={getAllDetailSkp.isLoading}>
          <Descriptions size="default" column={3} bordered className="mb-6">
            <Descriptions.Item label="Periode Mulai">
              {dayjs(detailSkp.startDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">
              {dayjs(detailSkp.endDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Renstra">{detailSkp.renstra?.name}</Descriptions.Item>
            <Descriptions.Item label="Pendekatan">{detailSkp.pendekatan}</Descriptions.Item>
            <Descriptions.Item label="Cascading">{detailSkp.cascading}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusBadge(detailSkp.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Nama ASN" span={3}>
              {detailSkp.jabatan?.[0]?.nama_asn ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={3}>
              {detailSkp.jabatan?.[0]?.unor?.nama ?? '-'}
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </Card>

      <Card className="mt-4">
        <Skeleton loading={getAllRhks.isLoading}>
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-2">
              <Typography.Title level={5}>Matriks Peran Hasil</Typography.Title>
            </div>
          </div>
          <hr />
          <div className="flex flex-col divide-y">
            <div className="grid w-full grid-cols-12 divide-x py-6">
              <div className="col-span-3 flex items-center">
                <span className="font-bold">RHK Saya</span>
              </div>
              <div className="col-span-9 flex items-center justify-end gap-2 px-4">
                <div className="flex items-center gap-x-2">
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                      modal.create({
                        title: `Tambah ${Modul.RHK}`,
                        formFields: mphFormFields({ options: { rkts: getAllRkts.data ?? [], isJPT: canEdit, parentRhks: parentSkpRhks } }),
                        onSubmit: async (values) => {
                          const payload = {
                            desc: values.desc,
                            jenis: values.jenis,
                            klasifikasi: values.klasifikasi,
                            ...(canEdit && { penugasan: values.penugasan }),
                            ...(canEdit && { rktIds: Array.isArray(values.rkts) ? values.rkts : (values.rkts ? [values.rkts] : []) }),
                            ...(!canEdit && { parentRhkId: values.parentRhkId })
                          };
                          const { isSuccess, message } = await addRhk.execute(id, payload, token);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchMatriks();
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }
                      });
                    }}
                  >
                    Tambah RHK
                  </Button>
                </div>
              </div>
            </div>
            {rhksData?.map((item) => (
              <div key={item.id} className="grid w-full grid-cols-12 divide-x py-6">
                {/* Parent RHK */}
                <div className="col-span-3 px-4">
                  {item?.parentRhk ? (
                    <Card
                      hoverable
                      onClick={() => setDrawer({ data: item.parentRhk, open: true, placement: 'left' })}
                      className="bg-blue-50"
                    >
                      <div className="flex flex-col gap-y-2">
                        <p className="text-xs font-semibold text-blue-600">RHK PIMPINAN</p>
                        <p className="font-bold text-sm">{item.parentRhk.desc}</p>
                        <p className="text-xs text-gray-600">{item.parentRhk.skp?.jabatan?.[0]?.nama_asn || '-'}</p>
                        <hr />
                        <div className="mt-2 flex flex-wrap gap-y-1">
                          <Tag color="blue" className="text-xs">{item.parentRhk.klasifikasi}</Tag>
                          <Tag color="cyan" className="text-xs">{item.parentRhk.jenis}</Tag>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-gray-400">
                      <p className="text-sm">Tidak ada RHK pimpinan</p>
                    </div>
                  )}
                </div>

                {/* Own RHK */}
                <div className="col-span-3 px-4">
                  <Card
                    hoverable
                    onClick={() => setDrawer({ data: item, open: true, placement: 'left' })}
                    extra={
                      canEdit && detailSkp.nip === user?.nip_baru ? (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            icon={<EditOutlined />}
                            type="text"
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRhk(item);
                            }}
                          />
                          <Popconfirm
                            title="Hapus RHK?"
                            description="Apakah anda yakin ingin menghapus RHK ini?"
                            onConfirm={(e) => {
                              e.stopPropagation();
                              handleDeleteRhk(item.id);
                            }}
                            onCancel={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                        </div>
                      ) : null
                    }
                    className="bg-green-50"
                  >
                    <div className="flex flex-col gap-y-2">
                      <p className="text-xs font-semibold text-green-600">RHK SAYA</p>
                      <p className="font-bold text-sm">{item.desc}</p>
                      <p className="text-xs text-gray-600">{item.skp?.jabatan?.[0]?.nama_asn || '-'}</p>
                      <hr />
                      <div className="mt-2 flex flex-wrap gap-y-1">
                        <Tag color="blue" className="text-xs">{item.klasifikasi}</Tag>
                        <Tag color="cyan" className="text-xs">{item.jenis}</Tag>
                        {item.penugasan && <Tag color="gold" className="text-xs">{item.penugasan}</Tag>}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Child RHK */}
                <div className="col-span-6 grid grid-cols-12 items-start gap-2 px-4">
                  {item?.childRhks && item.childRhks.length > 0 ? (
                    item.childRhks.map((child_item) => (
                      <Card
                        key={child_item.id}
                        className="col-span-6 bg-orange-50"
                        hoverable
                        onClick={() => setDrawer({ data: child_item, open: true, placement: 'right' })}
                        extra={
                          canEdit && detailSkp.nip === user?.nip_baru ? (
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                icon={<EditOutlined />}
                                type="text"
                                color="primary"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditRhk(child_item);
                                }}
                              />
                              <Popconfirm
                                title="Hapus RHK?"
                                description="Apakah anda yakin ingin menghapus RHK ini?"
                                onConfirm={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRhk(child_item.id);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Popconfirm>
                            </div>
                          ) : null
                        }
                      >
                        <div className="flex flex-col gap-y-2">
                          <p className="text-xs font-semibold text-orange-600">RHK BAWAHAN</p>
                          <p className="font-bold text-sm">{child_item.desc}</p>
                          <p className="text-xs text-gray-600">{child_item.skp?.jabatan?.[0]?.nama_asn || '-'}</p>
                          <hr />
                          <div className="mt-2 flex flex-wrap gap-y-1">
                            <Tag color="blue" className="text-xs">{child_item.klasifikasi}</Tag>
                            <Tag color="cyan" className="text-xs">{child_item.jenis}</Tag>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-12 flex items-center justify-center py-8 text-gray-400">
                      <p className="text-sm">Tidak ada RHK bawahan</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Skeleton>
      </Card>
      <Drawer title={drawer.data.desc} closable onClose={() => setDrawer((prev) => ({ ...prev, open: false }))} open={drawer.open} placement={drawer.placement} width={900} zIndex={900}>
        <div className="flex flex-col gap-y-6">
          {/* User/Employee Information */}
          {drawer.data.skp?.jabatan?.[0] && (
            <>
              <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Data Pejabat
                </Typography.Title>
                <Descriptions column={3} bordered className="py-4">
                  <Descriptions.Item label="Nama">{drawer.data.skp.jabatan[0].nama_asn}</Descriptions.Item>
                  <Descriptions.Item label="NIP">{drawer.data.skp.jabatan[0].nip_asn}</Descriptions.Item>
                  <Descriptions.Item label="Jabatan">{drawer.data.skp.jabatan[0].nama_jabatan}</Descriptions.Item>
                  <Descriptions.Item label="Unit Kerja" span={2}>{drawer.data.skp.jabatan[0].unor?.nama}</Descriptions.Item>
                  <Descriptions.Item label="Eselon">{drawer.data.skp.jabatan[0].eselon?.nama}</Descriptions.Item>
                  <Descriptions.Item label="Golongan" span={2}>{drawer.data.skp.jabatan[0].golongan_pns?.nama}</Descriptions.Item>
                </Descriptions>
              </div>
              <hr />
            </>
          )}

          {/* RHK Detail Information */}
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Detail RHK
            </Typography.Title>
            <Descriptions column={3} bordered className="py-4">
              <Descriptions.Item label="Nama RHK" span={3}>
                {drawer.data.desc}
              </Descriptions.Item>
              <Descriptions.Item label="Klasifikasi">{drawer.data.klasifikasi}</Descriptions.Item>
              <Descriptions.Item label="Jenis">{drawer.data.jenis}</Descriptions.Item>
              {drawer.data.penugasan && <Descriptions.Item label="Penugasan">{drawer.data.penugasan}</Descriptions.Item>}
            </Descriptions>
          </div>

          {/* RKT Information */}
          {drawer.data.rhkRkts && drawer.data.rhkRkts.length > 0 && (
            <>
              <hr />
              <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Rencana Kerja Tahunan
                </Typography.Title>
                <List
                  className="py-4"
                  dataSource={drawer.data.rhkRkts}
                  renderItem={(item) => (
                    <List.Item>
                      <Descriptions column={2} bordered className="w-full">
                        <Descriptions.Item label="Nama RKT" span={2}>{item.rkt?.name}</Descriptions.Item>
                        <Descriptions.Item label="Unit ID">{item.rkt?.unitId}</Descriptions.Item>
                        <Descriptions.Item label="Anggaran">{item.rkt?.totalAnggaran?.toLocaleString('id-ID') || '-'}</Descriptions.Item>
                      </Descriptions>
                    </List.Item>
                  )}
                />
              </div>
            </>
          )}

          {/* Aspect Information */}
          {drawer.data.rhkAspeks && drawer.data.rhkAspeks.length > 0 && (
            <>
              <hr />
              <List
                className="py-4"
                size="large"
                header={
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Daftar Aspek
                  </Typography.Title>
                }
                dataSource={drawer.data.rhkAspeks}
                renderItem={(item) => (
                  <Descriptions column={2} bordered className="py-2">
                    <Descriptions.Item label="Nama Aspek">{item.desc}</Descriptions.Item>
                    <Descriptions.Item label="Jenis">{item.jenis}</Descriptions.Item>
                    <Descriptions.Item label="Indikator Kinerja" span={3}>
                      <div className="inline-flex items-center gap-x-2">
                        {item.indikator_kinerja ? (
                          <>
                            <CheckCircleFilled className="text-green-500" />
                            {item.indikator_kinerja.name} {item.indikator_kinerja.target} {item.indikator_kinerja.satuan}
                            {isJpt && detailSkp.nip === user?.nip_baru && (
                              <Button variant="text" color="primary" icon={<EditOutlined />} onClick={() => handleUpdateAspek(item)} />
                            )}
                          </>
                        ) : (
                          <>
                            <CloseCircleFilled className="text-red-500" />
                            Belum di tambahkan
                            <Button variant="text" color="primary" icon={<PlusOutlined />} onClick={() => handleUpdateAspek(item)}>
                              Tambah
                            </Button>
                          </>
                        )}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                )}
              />
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Mph;
