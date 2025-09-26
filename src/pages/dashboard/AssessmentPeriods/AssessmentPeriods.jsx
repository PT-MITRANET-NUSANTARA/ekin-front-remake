import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AssessmentPeriodService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import { AssessmentPeriod as AssessmentPeriodModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';
import dayjs from 'dayjs';

const AssessmentPeriods = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllAssessmentPeriods } = useService(AssessmentPeriodService.getAll);
  const deleteAssessmentPeriod = useService(AssessmentPeriodService.delete);
  const storeAssessmentPeriod = useService(AssessmentPeriodService.store);
  const updateAssessmentPeriod = useService(AssessmentPeriodService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllAssessmentPeriods.totalData });

  const fetchAssessmentPeriods = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchAssessmentPeriods();
  }, [fetchAssessmentPeriods, pagination.page, pagination.per_page, token]);

  const assessmentPeriods = getAllAssessmentPeriods.data ?? [];

  const column = [
    {
      title: 'Nama Periode',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tanggal_selesai',
      sorter: (a, b) => a.tanggal_selesai.length - b.tanggal_selesai.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ASSESSMENTPERIOD}`}
            model={AssessmentPeriodModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.ASSESSMENTPERIOD}`,
                formFields: formFields(),
                data: { ...record, tanggal_mulai: dayjs(record.tanggal_mulai), tanggal_selesai: dayjs(record.tanggal_selesai) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateAssessmentPeriod.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAssessmentPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.ASSESSMENTPERIOD}`}
            model={AssessmentPeriodModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ASSESSMENTPERIOD}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteAssessmentPeriod.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAssessmentPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.ASSESSMENTPERIOD}`,
      formFields: formFields(),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeAssessmentPeriod.execute({ ...values, id_unit: user.unor.id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAssessmentPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.ASSESSMENTPERIOD} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllAssessmentPeriods.isLoading}>
          <DataTable data={assessmentPeriods} columns={column} loading={getAllAssessmentPeriods.isLoading} map={(mission) => ({ key: mission.id, ...mission })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default AssessmentPeriods;
