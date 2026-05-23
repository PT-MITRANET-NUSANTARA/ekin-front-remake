import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { RencanaAksiService, SkpsService } from '@/services';
import { Badge, Button, Card, Descriptions, Drawer, Skeleton, Typography } from 'antd';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rencanaAksiFormFields } from './FormFields';
import { PageExplanation } from '@/components';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/dist/style.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SKP_STATUS } from '@/constants/SkpStatus';
import dateFormatter from '@/utils/dateFormatter';
import { Select } from 'antd';

const RencanaAksi = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { id, assessment_periode_id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getDetailSkpByAssessmentPeriod);
  const { execute: executeRencanaAksi, ...getRencanaAksi } = useService(RencanaAksiService.getBySkp);
  const storeRencanaAksi = useService(RencanaAksiService.store);
  const updateRencanaAksi = useService(RencanaAksiService.update);
  const deleteRencanaAksi = useService(RencanaAksiService.delete);
  const [drawer, setDrawer] = React.useState({ open: false, data: {}, placement: 'right' });
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id, assessment_period_id: assessment_periode_id });
  }, [assessment_periode_id, execute, id, token]);

  const fetchRencanaAksi = React.useCallback(() => {
    executeRencanaAksi({ token: token, skpId: id });
  }, [id, executeRencanaAksi, token]);

  React.useEffect(() => {
    fetchDetailSkp();
    fetchRencanaAksi();
  }, [fetchDetailSkp, fetchRencanaAksi, token]);

  const detailSkp = getAllDetailSkp.data ?? {};
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];
  const rhkPeriodePenilaians = getRencanaAksi.data?.rhkPeriodePenilaians ?? [];
  const periodePenilaian = rhkPeriodePenilaians[0]?.periodePenilaian ?? {};

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

  const handleCreateRencanaAksi = () => {
    modal.create({
      title: `Tambah ${Modul.RENCANA_AKSI}`,
      formFields: rencanaAksiFormFields({ options: { rhkPeriodePenilaians }, dateRange: { start: periodePenilaian.startDate, end: periodePenilaian.endDate } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeRencanaAksi.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRencanaAksi();
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
      formFields: rencanaAksiFormFields({ options: { rhkPeriodePenilaians }, dateRange: { start: periodePenilaian.startDate, end: periodePenilaian.endDate } }),
      data: {
        desc: drawer.data.title,
        startDate: drawer.data.start_time,
        endDate: drawer.data.end_time,
        rhkPeriodePenilaianId: drawer.data.group,
        rencanaAksiId: drawer.data.id
      },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateRencanaAksi.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRencanaAksi();
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
        const rhkPeriodePenilaianId = drawer.data.group;
        const rencanaAksiId = drawer.data.id;
        const { isSuccess, message } = await deleteRencanaAksi.execute(
          { rhkPeriodePenilaianId, rencanaAksiId },
          token
        );
        if (isSuccess) {
          success('Berhasil', message);
          fetchRencanaAksi();
          setDrawer({ ...drawer, open: false });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const items = rhkPeriodePenilaians.flatMap((rp) =>
    (rp.rencanaAksis || []).map((ra) => ({
      id: ra.id,
      group: rp.id,
      title: ra.desc,
      start_time: moment(ra.startDate),
      end_time: moment(ra.endDate)
    }))
  );

  const groups = rhkPeriodePenilaians.map((rp, index) => ({
    id: rp.id,
    title: rp.rhk?.desc || `RHK ${index + 1}`
  }));

  return (
    <>
      <PageExplanation 
        title={`${Modul.SKP} - Rencana Aksi`}
        subTitle="Kelola rencana aksi untuk pencapaian SKP Anda."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>,
          },
          {
            title: 'Rencana Aksi',
          },
        ]}
      />

      <div className="flex flex-col gap-y-4">
      <Card>
        <Skeleton loading={getAllDetailSkp.isLoading || getRencanaAksi.isLoading}>
          {/* Assessment Period Detail */}
          {periodePenilaian?.id && (
            <Descriptions title="Detail Periode Penilaian" size="default" column={3} bordered className="mb-8">
              <Descriptions.Item label="Nama Periode">{periodePenilaian.name}</Descriptions.Item>
              <Descriptions.Item label="Periode Mulai">{dateFormatter(periodePenilaian.startDate)}</Descriptions.Item>
              <Descriptions.Item label="Periode Akhir">{dateFormatter(periodePenilaian.endDate)}</Descriptions.Item>
            </Descriptions>
          )}

          {/* Jabatan Selection */}
          {detailSkp?.jabatan && detailSkp.jabatan.length > 0 && (
            <div className="mb-6">
              <Typography.Title level={5}>Pilih Jabatan</Typography.Title>
              <Select
                style={{ width: '100%' }}
                value={currentJabatan?.id_posjab}
                onChange={(value) => {
                  const selected = detailSkp.jabatan.find((j) => j.id_posjab === value);
                  setSelectedJabatan(selected);
                }}
                options={detailSkp.jabatan.map((jabatan) => ({
                  label: `${jabatan.nama_jabatan} - ${jabatan.unor?.nama ?? 'N/A'}`,
                  value: jabatan.id_posjab
                }))}
              />
            </div>
          )}

          {/* SKP Information */}
          <Descriptions size="default" column={3} bordered className="mb-8">
            <Descriptions.Item label="Periode Mulai">{dateFormatter(detailSkp.startDate)}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{dateFormatter(detailSkp.endDate)}</Descriptions.Item>
            <Descriptions.Item label="Renstra">{detailSkp.renstra?.name ?? '-'}</Descriptions.Item>
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
          <div className="mb-6 mt-6 flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-2">
              <Typography.Title level={5}>Timeline Rencana Aksi</Typography.Title>
            </div>
            <div className="inline-flex items-center gap-x-2">
              {user?.newNip === detailSkp.user_id && (
                <Button variant="solid" color="primary" onClick={handleCreateRencanaAksi}>
                  Tambah Rencana Aksi
                </Button>
              )}
            </div>
          </div>

          <div className="col-span-9 items-start gap-2 px-4" style={{ height: '600px', marginBottom: '24px' }}>
            <Timeline
              groups={groups}
              items={items}
              defaultTimeStart={moment(periodePenilaian.startDate).toDate()}
              defaultTimeEnd={moment(periodePenilaian.endDate).toDate()}
              onItemClick={(itemId) => {
                const item = items.find((i) => i.id === itemId);
                setDrawer({ data: item, open: true, placement: 'right' });
              }}
              itemHeightRatio={0.65}
              stackItems={true}
            />
          </div>


        </Skeleton>
      </Card>
      </div>
      <Drawer title={drawer.data.title} closable onClose={() => setDrawer((prev) => ({ ...prev, open: false }))} open={drawer.open} placement={drawer.placement} width={900} zIndex={900}>
        <Descriptions title="Detail Rencana Aksi" bordered column={2}>
          <Descriptions.Item label="Deskripsi" span={2}>
            {drawer.data.title}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Mulai">
            {moment(drawer.data.start_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Berakhir">
            {moment(drawer.data.end_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="Aksi" span={2}>
            <div className="flex items-center gap-x-2">
              {user?.newNip === detailSkp.user_id && (
                <>
                  <Button icon={<EditOutlined />} variant="text" color="primary" onClick={() => handleUpdateRencanaAksi()} />
                  <Button icon={<DeleteOutlined />} variant="text" color="danger" onClick={() => handleDeleteRencanaAksi()} />
                </>
              )}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default RencanaAksi;
