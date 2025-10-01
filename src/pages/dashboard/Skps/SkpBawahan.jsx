import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AuthService, SkpsService } from '@/services';
import { Badge, Card, Descriptions, Skeleton } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skpBawahanColumns, subOrdinateColumn } from './Columns';
import { InputType } from '@/constants';

const SkpBawahan = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);
  const { execute: fetchDetailSkp, ...getAllDetailSkp } = useService(SkpsService.getById);
  const { execute: fetchSubordinate, ...getAllSubOrdinate } = useService(AuthService.getSubordinate);
  const storeSkp = useService(SkpsService.storeBawahan);
  const deleteSkp = useService(SkpsService.delete);
  const updateSkp = useService(SkpsService.update);
  const pagination = usePagination({ totalData: getAllSkpBawahan.totalData });

  const fetchSkpBawahan = React.useCallback(() => {
    execute({ token, id });
  }, [execute, id, token]);

  const skpBawahan = getAllSkpBawahan.data ?? [];
  const detailSkp = React.useMemo(() => getAllDetailSkp.data ?? [], [getAllDetailSkp.data]);
  const subordinate = getAllSubOrdinate.data ?? null;

  React.useEffect(() => {
    fetchSkpBawahan();
    fetchDetailSkp({ token, id });
  }, [fetchSkpBawahan, fetchDetailSkp, id, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    if (!detailSkp?.posjab?.[0]) return;

    fetchSubordinate({
      token,
      unit: detailSkp.posjab[0].unor.induk.id_simpeg,
      unor: detailSkp.posjab[0].unor.id
    });
  }, [detailSkp, fetchSubordinate, token]);

  const handleStoreSkpBawahan = (record) => {
    modal.edit({
      title: `Ubah ${Modul.ASPEK}`,
      formFields: [
        {
          label: `Pendekatan`,
          name: 'pendekatan',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: `Pendekatan visi harus diisi`
            }
          ],
          size: 'large',
          options: [
            {
              label: 'Kuantitatif',
              value: 'KUANTITATIF'
            },
            {
              label: 'Kualitatif',
              value: 'KUALITATIF'
            }
          ]
        }
      ],
      data: record,
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeSkp.execute({ ...values, atasan_skp_id: id, periode_start: detailSkp.periode_start, periode_end: detailSkp.periode_end, user_id: record.nip_asn, unit_id: detailSkp.unit_id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkpBawahan({ token, id });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleDeleteSkpBawahan = (record) => {
    modal.delete.default({
      title: `Delete ${Modul.SKP_BAWAHAN}`,
      data: record,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSkp.execute(record.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkpBawahan({ token, id });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleAjukanSkp = async (record) => {
    const { isSuccess, message } = await updateSkp.execute(record.id, { status: 'SUBMITTED' }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchSkpBawahan({ token, id });
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  const navigateToDetail = (record) => {
    navigate('/dashboard/skps/' + record.id);
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.SKP_BAWAHAN}></DataTableHeader>
      <Descriptions size="default" column={3} bordered className="mb-6">
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
      <div className="mb-12 w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllSubOrdinate.isLoading}>
          <DataTable data={subordinate ?? []} columns={subOrdinateColumn(handleStoreSkpBawahan, skpBawahan)} loading={getAllSkpBawahan.isLoading} map={(bawahan) => ({ key: bawahan.id, ...bawahan })} />
        </Skeleton>
      </div>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllSkpBawahan.isLoading}>
          <DataTable
            data={skpBawahan}
            columns={skpBawahanColumns(handleDeleteSkpBawahan, navigateToDetail, handleAjukanSkp)}
            loading={getAllSkpBawahan.isLoading}
            map={(skpBawahan) => ({ key: skpBawahan.id, ...skpBawahan })}
            pagination={pagination}
          />
        </Skeleton>
      </div>
    </Card>
  );
};

export default SkpBawahan;
