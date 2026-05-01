import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { SkpsService, UnitKerjaService } from '@/services';
import { Badge, Card, Descriptions, Skeleton, Input, Button, Select } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skpBawahanColumns } from './Columns';
import dayjs from 'dayjs';
import { InputType } from '@/constants';

const SkpBawahan = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchBawahan, ...getAllBawahan } = useService(UnitKerjaService.getJabatanWithBawahan);
  const createBawahan = useService(SkpsService.createBawahan);
  const deleteSkp = useService(SkpsService.delete);
  const updateSkp = useService(SkpsService.update);
  const pagination = usePagination({ totalData: getAllSkpBawahan.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const [selectedJabatan, setSelectedJabatan] = React.useState(null);
  const [selectedJabatanIndex, setSelectedJabatanIndex] = React.useState(0);

  const fetchSkpBawahan = React.useCallback(() => {
    execute({ token, id, page: pagination.page, perPage: pagination.per_page, search: filterValues.search });
  }, [execute, id, token, pagination.page, pagination.per_page, filterValues.search]);

  const skpBawahan = getAllSkpBawahan.data ?? [];
  const detailSkp = getAllDetailSkp.data ?? {};
  const bawahanList = getAllBawahan.data ?? [];
  const currentJabatan = selectedJabatan || detailSkp?.jabatan?.[0];
  const currentUnitId = detailSkp?.unitId?.[selectedJabatanIndex];

  React.useEffect(() => {
    if (!token || !id) return;
    fetchSkpBawahan();
    fetchDetailSkp({ token, id });
  }, [fetchSkpBawahan, fetchDetailSkp, id, token]);

  React.useEffect(() => {
    if (detailSkp?.jabatan && detailSkp.jabatan.length > 0 && !selectedJabatan) {
      setSelectedJabatan(detailSkp.jabatan[0]);
      setSelectedJabatanIndex(0);
    }
  }, [detailSkp?.jabatan, selectedJabatan]);

  React.useEffect(() => {
    if (!currentUnitId || !token) return;
    fetchBawahan(token, currentUnitId);
  }, [currentUnitId, token, fetchBawahan]);

  const handleDeleteSkpBawahan = (record) => {
    modal.delete.default({
      title: `Delete ${Modul.SKP_BAWAHAN}`,
      data: record,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSkp.execute(record.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkpBawahan();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleCreateSkpBawahan = () => {
    const filteredBawahan = bawahanList.filter(b => b.nip !== user?.nip_baru);

    modal.create({
      title: `Buat ${Modul.SKP_BAWAHAN}`,
      formFields: [
        {
          label: 'Pilih Bawahan',
          name: 'bawahanNip',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: 'Bawahan harus dipilih'
            }
          ],
          size: 'large',
          options: filteredBawahan.map((item) => ({
            label: `${item.name} (${item.jabatan})`,
            value: item.nip
          }))
        },
        {
          label: 'Pendekatan',
          name: 'pendekatan',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: 'Pendekatan harus dipilih'
            }
          ],
          size: 'large',
          options: [
            {
              label: 'Kualitatif',
              value: 'KUALITATIF'
            },
            {
              label: 'Kuantitatif',
              value: 'KUANTITATIF'
            }
          ]
        }
      ],
      onSubmit: async (values) => {
        const { isSuccess, message } = await createBawahan.execute(id, values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkpBawahan();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

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

  return (
    <>
      <PageExplanation 
        title={Modul.SKP_BAWAHAN}
        subTitle="Kelola data SKP bawahan dan pantau perkembangan kinerja tim Anda."
        breadcrumb={[
          {
            title: <a onClick={() => navigate('/dashboard/skps')}>SKP</a>,
          },
          {
            title: 'SKP Bawahan',
          },
        ]}
      />

      <Card title={<DataTableHeader modul={Modul.SKP_BAWAHAN}></DataTableHeader>}>
        <Skeleton loading={getAllDetailSkp.isLoading}>
          {/* Jabatan Selection */}
          {detailSkp?.jabatan && detailSkp.jabatan.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Pilih Jabatan</label>
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
              {currentJabatan?.nama_asn ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={3}>
              {currentJabatan?.unor?.nama ?? '-'}
            </Descriptions.Item>
          </Descriptions>

          {/* Pejabat Penilai Kinerja from Parent SKP */}
          {detailSkp?.parentSkps && detailSkp.parentSkps.length > 0 && (
            <div className="flex flex-row gap-x-4 mt-6">
              <Descriptions title="Pejabat penilai kinerja" size="small" column={1} bordered>
                <Descriptions.Item label="Nama">
                  {detailSkp.parentSkps[0]?.jabatan?.[selectedJabatanIndex]?.nama_asn ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="NIP">
                  {detailSkp.parentSkps[0]?.jabatan?.[selectedJabatanIndex]?.nip_asn ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Jabatan">
                  {detailSkp.parentSkps[0]?.jabatan?.[selectedJabatanIndex]?.nama_jabatan ?? '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Skeleton>
      </Card>

      <Card className="mt-4">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daftar SKP Bawahan</h3>
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={handleCreateSkpBawahan}
                loading={getAllBawahan.isLoading}
              >
                Buat SKP Bawahan
              </Button>
              <Button
                onClick={() => navigate(window.location.pathname + '/' + id)}
              >
                Kembali
              </Button>
            </div>
          </div>
          <Input.Search
            placeholder="Cari SKP Bawahan..."
            onSearch={(value) => {
              setFilterValues({ search: value });
              pagination.setPage(1);
            }}
            enterButton
          />
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllSkpBawahan.isLoading}>
            <DataTable
              data={skpBawahan}
              columns={skpBawahanColumns({
                deleteSkpBawahan: handleDeleteSkpBawahan,
                navigate: navigate,
                navItems: [
                  {
                    label: 'Detail',
                    path: (record) => `/dashboard/skps/${record.id}`
                  }
                ]
              })}
              pagination={{
                current: pagination.page,
                pageSize: pagination.per_page,
                total: getAllSkpBawahan.totalData,
                onChange: pagination.onChange
              }}
            />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default SkpBawahan;
