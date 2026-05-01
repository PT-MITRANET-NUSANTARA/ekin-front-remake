import { DataTableHeader, PageExplanation } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { SkpsService, RenstrasService, UnitKerjaService } from '@/services';
import { CheckSquareOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, TableOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Skeleton, Space, Pagination } from 'antd';
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
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteSkp = useService(SkpsService.delete);
  const storeSkp = useService(SkpsService.store);
  const updateSkp = useService(SkpsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllSkps.totalData });
  const navigate = useNavigate();

  const fetchSkps = React.useCallback(() => {
    execute({
      token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    if (!token) return;
    fetchSkps();
    fetchRenstras({ token });
    fetchUnitKerja({ token });
  }, [token, fetchSkps, fetchRenstras, fetchUnitKerja]);

  const skps = getAllSkps.data ?? [];
  const renstras = getAllRenstras.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const onEdit = (data) => {
    modal.edit({
      title: `Ubah ${Modul.SKP}`,
      formFields: formFields({ options: { renstras: renstras, unitKerja: unitKerja } }),
      data: data,
      onSubmit: async (values) => {
        // Transform data for API - send as ISO datetime strings
        const apiData = {
          startDate: dayjs(values.startDate).startOf('day').toISOString(),
          endDate: dayjs(values.endDate).endOf('day').toISOString(),
          unitId: String(values.unitId),
          renstraId: String(values.renstraId)
        };

        const { isSuccess, message } = await updateSkp.execute(data.id, apiData, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkps();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onDelete = (data) => {
    modal.delete.default({
      title: `Delete ${Modul.SKP}`,
      data: data,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSkp.execute(data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkps();
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
      formFields: formFields({ options: { renstras: renstras, unitKerja: unitKerja } }),
      onSubmit: async (values) => {
        // Transform data for API - send as ISO datetime strings
        const apiData = {
          startDate: dayjs(values.startDate).startOf('day').toISOString(),
          endDate: dayjs(values.endDate).endOf('day').toISOString(),
          unitId: String(values.unitId),
          renstraId: String(values.renstraId)
        };

        const { isSuccess, message } = await storeSkp.execute(apiData, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkps();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const renderSkpCard = (item) => {
    const isJpt = user?.roles?.includes('JPT');
    const isDraft = item.status === 'DRAFT';

    return (
      <Card key={item.id} className="mb-4">
        <div>
          <Descriptions size="small" column={2} bordered>
            <Descriptions.Item label="NIP">{item.nip}</Descriptions.Item>
            <Descriptions.Item label="Status">
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
            <Descriptions.Item label="Periode Mulai">{dayjs(item.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Periode Akhir">{dayjs(item.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Pendekatan">{item.pendekatan}</Descriptions.Item>
            <Descriptions.Item label="Cascading">{item.cascading}</Descriptions.Item>
            <Descriptions.Item label="Jabatan" span={2}>
              {item.jabatan?.[0]?.nama_jabatan || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={2}>
              {item.renstra?.name || '-'}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-4 flex w-full items-center justify-between">
            <Space size="small" wrap>
              <Button type="primary" size="small" icon={<InfoCircleOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id)}>
                Detail SKP
              </Button>

              <Button size="small" icon={<TableOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/matriks')}>
                Matriks Peran Hasil
              </Button>

              {item.status === 'APROVED' && (
                <>
                  <Button size="small" icon={<UserSwitchOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/skp_bawahan')}>
                    SKP Bawahan
                  </Button>
                  {user?.pimpinan && (
                    <>
                    
                    </>
                  )}
                  <Button size="small" icon={<CheckSquareOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/assessment_periods')}>
                    Penilaian
                  </Button>
                </>
              )}
            </Space>

            <Space size="small">
              {isJpt && (
                <>
                  {/* Edit button commented out */}
                  {/* <Button
                    disabled={item.status !== 'DRAFT'}
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button> */}
                  <Button danger size="small" icon={<DeleteOutlined />} onClick={() => onDelete(item)}>
                    Hapus
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <PageExplanation title={Modul.SKP} subTitle={'Kelola dan atur data SKP (Sasaran Kinerja Pegawai) dengan mudah. Tambahkan, ubah, atau hapus data agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader modul={Modul.SKP} {...(user?.roles?.includes('JPT') ? { onStore: onCreate } : {})} onSearch={(values) => setFilterValues({ search: values })} />}>
        <Skeleton loading={getAllSkps.isLoading}>
          <div className="flex w-full max-w-full flex-col gap-y-4">
            {skps.map((item) => renderSkpCard(item))}
            {skps.length === 0 && <div className="py-8 text-center text-gray-500">Tidak ada data SKP tersedia</div>}
          </div>
          {skps.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Pagination current={pagination.page} pageSize={pagination.per_page} total={pagination.totalData} onChange={pagination.onChange} />
            </div>
          )}
        </Skeleton>
      </Card>
    </>
  );
};

export default Skps;
