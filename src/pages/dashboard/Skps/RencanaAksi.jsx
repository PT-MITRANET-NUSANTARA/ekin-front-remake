import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { RencanaAksiService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Drawer, Skeleton, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { rencanaAksiFormFields } from './FormFields';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/dist/style.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const RencanaAksi = () => {
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpByAssessmentPeriod);
  const storeRencanaAksi = useService(RencanaAksiService.store);
  const updateRencanaAksi = useService(RencanaAksiService.update);
  const deleteRencanaAksi = useService(RencanaAksiService.delete);
  const [drawer, setDrawer] = React.useState({ open: false, data: {}, placement: 'right' });

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp, token]);

  const detailSkp = getAllDetailSkp.data ?? {};

  const handleCreateRencanaAksi = () => {
    modal.create({
      title: `Tambah ${Modul.RENCANA_AKSI}`,
      formFields: rencanaAksiFormFields({ options: { rhks: detailSkp.rhk } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeRencanaAksi.execute({ ...values, skp_id: id, periode_penilaian_id: assessment_periode_id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token, id });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleUpdateRencanaAksi = () => {
    modal.edit({
      title: `Ubah ${Modul.RENCANA_AKSI}`,
      formFields: rencanaAksiFormFields({ options: { rhks: detailSkp.rhk } }),
      data: { desc: drawer.data.title, periode_start: drawer.data.start_time, periode_end: drawer.data.end_time, rhk_id: drawer.data.group },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateRencanaAksi.execute(drawer.data.id, { ...values, skp_id: id, periode_penilaian_id: assessment_periode_id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token, id });
          setDrawer({ ...drawer, open: false });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleDeleteRencanaAksi = () => {
    modal.delete.default({
      title: `Delete ${Modul.RENCANA_AKSI}`,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteRencanaAksi.execute(drawer.data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchDetailSkp({ token, id });
          setDrawer({ ...drawer, open: false });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const groups =
    detailSkp?.rhk?.map((rhk, index) => ({
      id: rhk.id,
      title: rhk.desc || `RHK ${index + 1}`
    })) ?? [];

  const items =
    detailSkp?.rhk?.flatMap((rhk) =>
      rhk.rencana_aksi.map((ra) => ({
        id: ra.id,
        group: rhk.id,
        title: ra.desc,
        start_time: moment(ra.periode_start),
        end_time: moment(ra.periode_end)
      }))
    ) ?? [];

  return (
    <>
      <Card>
        <Skeleton loading={getAllDetailSkp.isLoading}>
          <div className="mb-6 mt-4 flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-2">
              <Typography.Title level={5}>Rencana Aksi</Typography.Title>
            </div>
          </div>
          <Descriptions size="default" column={3} bordered className="mb-8">
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
          <div className="mb-8 mt-4 flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-2">
              <Typography.Title level={5}>Rencana Aksi</Typography.Title>
            </div>
            <div className="inline-flex items-center gap-x-2">
              {user?.newNip === detailSkp.user_id && (
                <Button variant="solid" color="primary" onClick={handleCreateRencanaAksi}>
                  Tambah Rencana Aksi
                </Button>
              )}
            </div>
          </div>

          <div className="col-span-9 items-start gap-2 px-4">
            <Timeline
              groups={groups}
              items={items}
              defaultTimeStart={new Date('2025-09-01')}
              defaultTimeEnd={new Date('2025-11-01')}
              onItemClick={(itemId) => {
                const item = items.find((i) => i.id === itemId);
                setDrawer({ data: item, open: true, placement: 'right' });
              }}
            />
          </div>
        </Skeleton>
      </Card>
      <Drawer title={drawer.data.desc} closable onClose={() => setDrawer((prev) => ({ ...prev, open: false }))} open={drawer.open} placement={drawer.placement} width={900} zIndex={900}>
        <Descriptions title="Detail Rencana Aksi" bordered column={2}>
          <Descriptions.Item label="Tanggal Berakhir" span={2}>
            <div className="flex items-center gap-x-2">
              {user?.newNip === detailSkp.user_id && (
                <>
                  {drawer.data.title}
                  <Button icon={<EditOutlined />} variant="text" color="primary" onClick={() => handleUpdateRencanaAksi()} />
                  <Button icon={<DeleteOutlined />} variant="text" color="danger" onClick={() => handleDeleteRencanaAksi()} />
                </>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Mulai">{moment(drawer.data.start_time).format('YYYY-MM-DD')}</Descriptions.Item>
          <Descriptions.Item label="Tanggal Berakhir">{moment(drawer.data.end_time).format('YYYY-MM-DD')}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default RencanaAksi;
