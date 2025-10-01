import { DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RenstrasService, SkpsService } from '@/services';
import { CheckSquareOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, TableOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Skeleton } from 'antd';
import React from 'react';
import { formFields } from './FormFields';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const Skps = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllSkps } = useService(SkpsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const deleteSkp = useService(SkpsService.delete);
  const storeSkp = useService(SkpsService.store);
  const updateSkp = useService(SkpsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllSkps.totalData });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user?.newNip) return;

    execute({
      token,
      user_id: user.newNip,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });

    fetchRenstras({ token: token });
  }, [execute, fetchRenstras, filterValues.search, pagination.page, pagination.per_page, token, user.newNip]);

  const skps = getAllSkps.data ?? [];
  const renstras = getAllRenstras.data ?? [];

  const onEdit = (data) => {
    modal.edit({
      title: `Ubah ${Modul.SKP}`,
      formFields: formFields,
      data: { ...data, tanggal_mulai: dayjs(data.periode_start), tanggal_selesai: dayjs(data.periode_end) },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateSkp.execute(data.id, { ...values, id_user: user.newNip }, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onDelete = (data) => {
    modal.delete.default({
      title: `Delete ${Modul.VISION}`,
      data: data,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSkp.execute(data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.SKP}`,
      formFields: formFields({ options: { renstras: renstras } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeSkp.execute({ ...values, id_user: user.newNip }, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.SKP} {...(user?.isJpt ? { onStore: onCreate } : {})} onSearch={(values) => setFilterValues({ search: values })} />
      <Skeleton loading={getAllSkps.isLoading}>
        <div className="flex w-full max-w-full flex-col gap-y-6 overflow-x-auto">
          {skps.map((item) => (
            <Card key={item.id}>
              <Descriptions size="default" column={3} bordered>
                <Descriptions.Item label="Pendekatan">{item.pendekatan}</Descriptions.Item>
                <Descriptions.Item label="Periode Mulai">{item.periode_start}</Descriptions.Item>
                <Descriptions.Item label="Periode Akhir">{item.periode_end}</Descriptions.Item>
                <Descriptions.Item label="Unit Kerja" span={3}>
                  {item.unit_id.nama_unor}
                </Descriptions.Item>
                <Descriptions.Item label="Status SKP" span={3}>
                  {(() => {
                    switch (item.status) {
                      case 'DRAFT':
                        return <Badge status="processing" text="Draft" />;
                      case 'SUBMITTED':
                        return <Badge status="warning" text="Submitted" />;
                      case 'REJECTED':
                        return <Badge status="error" text="Rejected" />;
                      case 'APPROVED':
                        return <Badge status="success" text="Approved" />;
                      default:
                        return <Badge status="default" text={item.status} />;
                    }
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Status Pegawai">{item.posjab?.[0]?.jabatan_status.nama ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Jabatan" span={2}>
                  {item.posjab?.[0]?.nama_jabatan ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Pegawai">{item.posjab?.[0]?.jenis_asn ?? ''}</Descriptions.Item>
              </Descriptions>
              <div className="mt-4 flex w-full items-center justify-between">
                <div className="inline-flex items-center gap-x-2">
                  <Button size="small" variant="filled" color="primary" icon={<InfoCircleOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id)}>
                    Detail SKP
                  </Button>
                  <Button size="small" variant="filled" color="primary" icon={<TableOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/matriks')}>
                    Matriks Peran Hasil
                  </Button>
                  <Button size="small" variant="filled" color="primary" icon={<UserSwitchOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/skp_bawahan')}>
                    SKP Bawahan
                  </Button>
                  <Button size="small" variant="filled" color="primary" icon={<CheckSquareOutlined />}>
                    Penilaian
                  </Button>
                </div>
                <div className="inline-flex items-center gap-x-2">
                  <Button disabled={item.status !== 'DRAFT'} variant="solid" color="primary" icon={<EditOutlined />} onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="solid" color="danger" icon={<DeleteOutlined />} onClick={() => onDelete(item)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Skeleton>
    </Card>
  );
};

export default Skps;
