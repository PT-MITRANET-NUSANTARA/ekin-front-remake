import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AssessmentPeriodService, RenstrasService, UnitKerjaService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import { AssessmentPeriod as AssessmentPeriodModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { assessmentPeriodFilterFields, formFields } from './FormFields';
import dayjs from 'dayjs';
import { InputType } from '@/constants';

const AssessmentPeriods = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllAssessmentPeriods } = useService(AssessmentPeriodService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteAssessmentPeriod = useService(AssessmentPeriodService.delete);
  const storeAssessmentPeriod = useService(AssessmentPeriodService.store);
  const updateAssessmentPeriod = useService(AssessmentPeriodService.update);
  const [filterValues, setFilterValues] = React.useState({
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    search: ''
  });
  const pagination = usePagination({ totalData: getAllAssessmentPeriods.totalData });

  const fetchAssessmentPeriods = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs ? filterValues.unit_id : user?.unor.id
    });
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.umpegs, user?.unor.id]);

  React.useEffect(() => {
    fetchAssessmentPeriods();
    fetchRenstras({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchAssessmentPeriods, fetchRenstras, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const assessmentPeriods = getAllAssessmentPeriods.data ?? [];
  const renstras = getAllRenstras.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

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
                formFields: formFields({ options: { renstras: renstras } }),
                data: { ...record, tanggal_mulai: dayjs(record.tanggal_mulai), tanggal_selesai: dayjs(record.tanggal_selesai), id_renstra: record.id_renstra },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateAssessmentPeriod.execute(
                    record.id,
                    {
                      ...values,
                      tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DD'),
                      tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DD')
                    },
                    token
                  );
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
      formFields: [
        ...formFields({ options: { renstras: renstras } }),
        ...(user?.isAdmin || user?.umpegs?.length
          ? [
              {
                label: `Nama Unit`,
                name: 'unit_id',
                type: InputType.SELECT,
                rules: [
                  {
                    required: true,
                    message: `Nama Unit harus diisi`
                  }
                ],
                options: user?.isAdmin
                  ? unitKerja.map((item) => ({
                      label: item.nama_unor,
                      value: item.id_simpeg
                    }))
                  : user.umpegs.map((item) => ({
                      label: item.unit.nama_unor,
                      value: item.unit.id_simpeg
                    }))
              }
            ]
          : [])
      ],
      onSubmit: async (values) => {
        const payload = {
          ...values,
          tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DD'),
          tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DD'),
          id_unit: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user.unor.id
        };
        const { isSuccess, message } = await storeAssessmentPeriod.execute(payload, token);
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

  const filter = {
    formFields: [
      ...assessmentPeriodFilterFields(),
      ...(user?.isAdmin || user?.umpegs?.length
        ? [
            {
              label: `Nama Unit`,
              name: 'unit_id',
              type: InputType.SELECT,
              mode: 'multiple',
              options: user?.isAdmin
                ? unitKerja.map((item) => ({
                    label: item.nama_unor,
                    value: item.id_simpeg
                  }))
                : user.umpegs.map((item) => ({
                    label: item.unit.nama_unor,
                    value: item.unit.id_simpeg
                  }))
            }
          ]
        : [])
    ],
    initialData: {
      unit_id: filterValues.unit_id
    },
    isLoading: getAllAssessmentPeriods.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.ASSESSMENTPERIOD} filter={filter} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllAssessmentPeriods.isLoading}>
          <DataTable data={assessmentPeriods} columns={column} loading={getAllAssessmentPeriods.isLoading} map={(mission) => ({ key: mission.id, ...mission })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default AssessmentPeriods;
