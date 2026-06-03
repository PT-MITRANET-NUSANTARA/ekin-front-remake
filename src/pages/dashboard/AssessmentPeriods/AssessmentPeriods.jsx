import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AssessmentPeriodService, UnitKerjaService, RenstrasService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import React from 'react';
import { AssessmentPeriod as AssessmentPeriodModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { formFields } from './FormFields';
import dayjs from 'dayjs';
import { InputType, Role } from '@/constants';
import dateFormatter from '@/utils/dateFormatter';
import { fetchAllFromService } from '@/utils/fetchAllPaginatedData';

const AssessmentPeriods = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllAssessmentPeriods } = useService(AssessmentPeriodService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const deleteAssessmentPeriod = useService(AssessmentPeriodService.delete);
  const storeAssessmentPeriod = useService(AssessmentPeriodService.store);
  const updateAssessmentPeriod = useService(AssessmentPeriodService.update);
  const [filterValues, setFilterValues] = React.useState({
    search: ''
  });
  const [allRenstras, setAllRenstras] = React.useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = React.useState(false);
  const pagination = usePagination({ totalData: getAllAssessmentPeriods.totalData });

  // Fetch all pages for dropdown options
  React.useEffect(() => {
    const loadDropdownData = async () => {
      if (!token) return;
      
      try {
        setIsLoadingDropdowns(true);
        
        // Fetch all renstras
        const allRenstrasData = await fetchAllFromService(RenstrasService.getAll, token, {}, 100);
        setAllRenstras(allRenstrasData);
      } catch (err) {
        console.error('Error loading dropdown data:', err);
        // Fallback to initial fetch data if full fetch fails
        setAllRenstras(getAllRenstras.data || []);
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [token]);

  const fetchAssessmentPeriods = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  const renstras = allRenstras.length > 0 ? allRenstras : (getAllRenstras.data ?? []);
  const formFieldsWithOptions = formFields({ renstras });

  React.useEffect(() => {
    if (user) {
      fetchAssessmentPeriods();
    }
    fetchUnitKerja({ token: token, search: '' });
    fetchRenstras({ token: token });
  }, [fetchAssessmentPeriods, fetchUnitKerja, fetchRenstras, pagination.page, pagination.per_page, token, user]);

  const assessmentPeriods = getAllAssessmentPeriods.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Tahun Periode',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      searchable: true
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.localeCompare(b.tanggal_mulai),
      searchable: true,
      render: (record) => dateFormatter(record)
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tanggal_selesai',
      sorter: (a, b) => a.tanggal_selesai.localeCompare(b.tanggal_selesai),
      searchable: true,
      render: (record) => dateFormatter(record)
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
                formFields: formFieldsWithOptions,
                data: { ...record, tanggal_mulai: dayjs(record.tanggal_mulai), tanggal_selesai: dayjs(record.tanggal_selesai) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateAssessmentPeriod.execute(
                    record.id,
                    {
                      nama: values.nama,
                      tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DDTHH:mm:ssZ'),
                      tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DDTHH:mm:ssZ'),
                      id_unit: record.id_unit,
                      id_renstra: values.id_renstra
                    },
                    token
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAssessmentPeriods();
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
                    fetchAssessmentPeriods();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.ASSESSMENTPERIOD}`}
            model={AssessmentPeriodModel}
            onClick={() => {
              modal.show.description({
                title: `Detail ${Modul.ASSESSMENTPERIOD}`,
                data: [
                  {
                    key: 'nama',
                    label: 'Nama Periode',
                    children: record.nama
                  },
                  {
                    key: 'tanggal_mulai',
                    label: 'Tanggal Mulai',
                    children: record.tanggal_mulai
                  },
                  {
                    key: 'tanggal_selesai',
                    label: 'Tanggal Selesai',
                    children: record.tanggal_selesai
                  },
                  {
                    key: 'id_unit',
                    label: 'Unit ID',
                    children: record.id_unit
                  }
                ]
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
        ...formFieldsWithOptions,
        ...(user?.canAccess({ roles: [Role.ADMIN] })
          ? [
              {
                label: 'Nama Unit',
                name: 'id_unit',
                type: InputType.SELECT,
                rules: [
                  {
                    required: true,
                    message: 'Nama Unit harus diisi'
                  }
                ],
                options: unitKerja.map((item) => ({
                  label: item.name || item.nama_unor,
                  value: item.id || item.id_simpeg
                }))
              }
            ]
          : [])
      ],
      onSubmit: async (values) => {
        const payload = {
          nama: values.nama,
          tanggal_mulai: values.tanggal_mulai.format('YYYY-MM-DDTHH:mm:ssZ'),
          tanggal_selesai: values.tanggal_selesai.format('YYYY-MM-DDTHH:mm:ssZ'),
          id_unit: user?.canAccess({ roles: [Role.ADMIN] }) ? values.id_unit : user?.unor.id,
          id_renstra: values.id_renstra
        };
        const { isSuccess, message } = await storeAssessmentPeriod.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAssessmentPeriods();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <PageExplanation title={Modul.ASSESSMENTPERIOD} subTitle="Kelola dan atur data periode penilaian dengan mudah. Tambahkan, ubah, atau hapus periode penilaian agar tetap relevan dan terorganisir." />
      <Card title={<DataTableHeader modul={Modul.ASSESSMENTPERIOD} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllAssessmentPeriods.isLoading}>
            <DataTable data={assessmentPeriods} columns={column} loading={getAllAssessmentPeriods.isLoading} map={(period) => ({ key: period.id, ...period })} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default AssessmentPeriods;
