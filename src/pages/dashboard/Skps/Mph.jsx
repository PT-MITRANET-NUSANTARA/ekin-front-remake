import { Crud } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RhkService, SkpsService } from '@/services';
import { CheckCircleFilled, CloseCircleFilled, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Drawer, List, Popover, Skeleton, Tag, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { aspekFormFields, filterMphFormFields, mphFormFields } from './FormFields';
import Modul from '@/constants/Modul';

const Mph = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllMatriks } = useService(SkpsService.getMatriks);
  const { execute: fetchSkpBawahan, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);
  const storeRhk = useService(RhkService.store);
  const updateAspek = useService(SkpsService.aspekUpdate);
  const pagination = usePagination({ totalData: getAllMatriks.totalData });
  const [drawer, setDrawer] = React.useState({ open: false, data: {}, placement: 'right' });
  const [filterValues, setFilterValues] = React.useState({ skp_id: null });

  const fetchMatriks = React.useCallback(() => {
    execute({ token, id, page: pagination.page, per_page: pagination.per_page, skp_id: filterValues.skp_id });
  }, [execute, filterValues.skp_id, id, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchMatriks();
    fetchSkpBawahan({ token: token, id: id });
  }, [fetchMatriks, fetchSkpBawahan, id, token]);

  const matriksSkp = getAllMatriks.data ?? {};
  const skpBawahan = getAllSkpBawahan.data ?? [];

  const handleUpdateAspek = (data) => {
    modal.edit({
      title: `Ubah ${Modul.ASPEK}`,
      formFields: aspekFormFields,
      data: { name: data.indikator_name, target: data.indikator_target, satuan: data.indikator_satuan },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateAspek.execute(data.id, { indikator_kinerja: { ...values }, jenis: data.jenis, desc: data.desc }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMatriks({ token: token, page: pagination.page, per_page: pagination.per_page, skp_id: filterValues.skp_id });
          setDrawer({ ...drawer, open: false });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <Card>
        <Skeleton loading={getAllMatriks.isLoading}>
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-2">
              <Typography.Title level={5}>Matriks Peran Hasil</Typography.Title>
            </div>
          </div>
          <Descriptions size="default" column={3} bordered className="py-6">
            <Descriptions.Item label="Pendekatan">{matriksSkp.pendekatan}</Descriptions.Item>
            <Descriptions.Item label="Periode Mulai">{matriksSkp.periode_start}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{matriksSkp.periode_end}</Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={3}>
              {matriksSkp?.unit?.nama_unor ?? ''}
            </Descriptions.Item>
            <Descriptions.Item label="Status SKP" span={3}>
              {(() => {
                switch (matriksSkp.status) {
                  case 'DRAFT':
                    return <Badge status="processing" text="Draft" />;
                  case 'SUBMITTED':
                    return <Badge status="warning" text="Submitted" />;
                  case 'REJECTED':
                    return <Badge status="error" text="Rejected" />;
                  case 'APPROVED':
                    return <Badge status="success" text="Approved" />;
                  default:
                    return <Badge status="default" text={matriksSkp.status} />;
                }
              })()}
            </Descriptions.Item>
          </Descriptions>
          <hr />
          <div className="flex flex-col divide-y">
            <div className="grid w-full grid-cols-12 divide-x py-6">
              <div className="col-span-3 flex items-center">
                <span className="font-bold">RHK Pimpinan</span>
              </div>
              <div className="col-span-9 flex items-center justify-between gap-2 px-4">
                <span className="font-bold">RHK Bawahan</span>
                <div className="flex items-center gap-x-2">
                  <Popover
                    placement="leftBottom"
                    trigger="click"
                    content={
                      <Crud
                        formFields={filterMphFormFields({ options: { skpBawahan: skpBawahan ?? [] } })}
                        initialData={{ skp_id: filterValues.skp_id }}
                        isLoading={getAllMatriks.isLoading}
                        onSubmit={(values) => setFilterValues({ ...filterValues, skp_id: values.skp_id })}
                        type="create"
                      />
                    }
                  >
                    <Button icon={<FilterOutlined />} />
                  </Popover>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                      modal.create({
                        title: `Tambah ${Modul.RHK}`,
                        formFields: mphFormFields({ options: { skpBawahan: skpBawahan, matriksSkp: matriksSkp } }),
                        onSubmit: async (values) => {
                          const { isSuccess, message } = await storeRhk.execute({ ...values }, token);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchMatriks({ token: token, page: pagination.page, per_page: pagination.per_page });
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }
                      });
                    }}
                  >
                    Tambah RHK Bawahan
                  </Button>
                </div>
              </div>
            </div>
            {matriksSkp?.rhk?.map((item) => (
              <div key={item.id} className="grid w-full grid-cols-12 divide-x py-6">
                <div className="col-span-3 px-4">
                  <Card hoverable onClick={() => setDrawer({ data: item, open: true, placement: 'left' })}>
                    <div className="flex flex-col gap-y-2">
                      <p className="font-bold">{item.desc}</p>
                      <hr />
                      <div className="mt-2 flex flex-wrap gap-y-2">
                        <Tag color="blue">{item.klasifikasi}</Tag>
                        <Tag color="cyan">{item.jenis}</Tag>
                        <Tag color="gold">{item.penugasan}</Tag>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-span-9 grid grid-cols-12 items-start gap-2 px-4">
                  {item?.child_rhk?.map((child_item) => (
                    <Card key={child_item.id} className="col-span-4" hoverable onClick={() => setDrawer({ data: child_item, open: true, placement: 'right' })}>
                      <div className="flex flex-col gap-y-2">
                        <p className="font-bold">{child_item.desc}</p>
                        <hr />
                        <div className="mt-2 flex flex-wrap gap-y-2">
                          <Tag color="blue">{child_item.klasifikasi}</Tag>
                          <Tag color="cyan">{child_item.jenis}</Tag>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Skeleton>
      </Card>
      <Drawer title={drawer.data.desc} closable onClose={() => setDrawer((prev) => ({ ...prev, open: false }))} open={drawer.open} placement={drawer.placement} width={900}>
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
        <hr />
        <List
          className="py-4"
          size="large"
          header={
            <Typography.Title level={5} style={{ margin: 0 }}>
              Daftar Aspek
            </Typography.Title>
          }
          dataSource={drawer.data.aspek}
          renderItem={(item) => (
            <Descriptions column={2} bordered className="py-2">
              <Descriptions.Item label="Nama Aspek">{item.desc}</Descriptions.Item>
              <Descriptions.Item label="Jenis">{item.jenis}</Descriptions.Item>
              <Descriptions.Item label="Indikator Kinerja" span={3}>
                <div className="inline-flex items-center gap-x-2">
                  {item.indikator_kinerja ? (
                    <>
                      <CheckCircleFilled className="text-green-500" />
                      {item.indikator_kinerja.name} {item.indikator_kinerja.satuan} {item.indikator_kinerja.target}
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
      </Drawer>
    </>
  );
};

export default Mph;
