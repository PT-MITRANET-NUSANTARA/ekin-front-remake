import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { RenstrasService, RktsService, SubActivitiesService, UnitKerjaService } from '@/services';
import { Button, Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import { Rkts as RktModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { rktFormFields, rktsFilterFields } from './FormFields';
import { InputType, Role } from '@/constants';
import { fetchAllFromService } from '@/utils/fetchAllPaginatedData';

const Rkts = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRkts } = useService(RktsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchSubActivities, ...getAllSubActivities } = useService(SubActivitiesService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteRkt = useService(RktsService.delete);
  const storeRkt = useService(RktsService.store);
  const updateRkt = useService(RktsService.update);
  const [filterValues, setFilterValues] = React.useState({
    unit_id: [],
    search: ''
  });
  const [allRenstras, setAllRenstras] = React.useState([]);
  const [allSubActivities, setAllSubActivities] = React.useState([]);
  const pagination = usePagination({ totalData: getAllRkts.totalData });
  const navigate = useNavigate();

  // Fetch all pages for dropdown options
  React.useEffect(() => {
    const loadDropdownData = async () => {
      if (!token) return;
      
      try {
        // Fetch all renstras
        const allRenstrasData = await fetchAllFromService(RenstrasService.getAll, token, {}, 100);
        setAllRenstras(allRenstrasData);

        // Fetch all sub activities
        const allSubActivitiesData = await fetchAllFromService(SubActivitiesService.getAll, token, {}, 100);
        setAllSubActivities(allSubActivitiesData);
      } catch (err) {
        console.error('Error loading dropdown data:', err);
        // Fallback to initial fetch data if full fetch fails
        setAllRenstras(getAllRenstras.data || []);
        setAllSubActivities(getAllSubActivities.data || []);
      }
    };

    loadDropdownData();
  }, [token, getAllRenstras.data, getAllSubActivities.data]);

  const fetchRkts = React.useCallback(() => {
    const params = {
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    };

    // Only add unitIds filter for admin users when they select specific units
    if ((user?.isAdmin || user?.umpegs?.length) && filterValues.unit_id?.length > 0) {
      params.unitIds = filterValues.unit_id;
    }

    execute(params);
  }, [execute, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.umpegs]);

  React.useEffect(() => {
    fetchRkts();
    fetchRenstras({ token: token });
    fetchSubActivities({ token: token });
    fetchUnitKerja({ token: token });
  }, [fetchRkts, fetchRenstras, pagination.page, pagination.per_page, token, fetchSubActivities, fetchUnitKerja]);

  const rkts = getAllRkts.data ?? [];
  const renstras = allRenstras.length > 0 ? allRenstras : (getAllRenstras.data ?? []);
  const subActivities = allSubActivities.length > 0 ? allSubActivities : (getAllSubActivities.data ?? []);
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Rencana Kerja Tahunan',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Sub Kegiatan',
      dataIndex: 'id_sub_kegiatan',
      render: (subKegiatan) => {
        if (!subKegiatan || subKegiatan.length === 0) return '-';
        return (
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {subKegiatan.map((item, idx) => (
              <li key={idx}>{item.nama}</li>
            ))}
          </ul>
        );
      },
      sorter: (a, b) => (a.id_sub_kegiatan?.length || 0) - (b.id_sub_kegiatan?.length || 0)
    },
    {
      title: 'Total Anggaran',
      dataIndex: 'total_anggaran',
      sorter: (a, b) => a.total_anggaran - b.total_anggaran,
      searchable: true,
      render: (record) => rupiahFormat(record, true)
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              const formData = {
                ...record,
                id_sub_kegiatan: (record.id_sub_kegiatan ?? []).map((item) => item.id),
                id_renstra: record.renstra?.id
              };

              modal.edit({
                title: `Ubah ${Modul.RKT}`,
                formFields: rktFormFields({ options: { renstras, subActivities } }),
                data: formData,
                onSubmit: async (values) => {
                  const payload = {
                    nama: values.nama,
                    label: values.label,
                    total_anggaran: values.total_anggaran,
                    id_renstra: values.id_renstra,
                    id_sub_kegiatan: values.id_sub_kegiatan,
                    id_unit: formData.id_unit,
                    input_indikador_kinerja: formData.input || [],
                    output_indikador_kinerja: formData.output || [],
                    outcome_indikador_kinerja: formData.outcome || []
                  };

                  const { isSuccess, message } = await updateRkt.execute(record.id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRkts();
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />

          <Delete
            title={`Delete ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RKT}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteRkt.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRkts();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.RKT}`}
            model={RktModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data RKT',
                data: [
                  {
                    key: 'id_unit',
                    label: `Unit Kerja`,
                    children: record.id_unit
                  },
                  {
                    key: 'nama',
                    label: `Judul ${Modul.RKT}`,
                    children: record.nama
                  },
                  {
                    key: 'label',
                    label: `Label`,
                    children: record.label
                  },
                  {
                    key: 'total_anggaran',
                    label: `Total Anggaran`,
                    children: rupiahFormat(record.total_anggaran)
                  },
                  {
                    key: 'sub_kegiatan',
                    label: `Sub Kegiatan`,
                    children: <List size="small" bordered dataSource={record.id_sub_kegiatan} renderItem={(item) => <List.Item>{item.nama}</List.Item>} />
                  },
                  {
                    key: 'input',
                    label: `Indikator Input`,
                    children: (
                      <>
                        <List
                          size="small"
                          bordered
                          dataSource={record.input_indikator_kinerja}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta title={item.nama} description={`Target : ${item.target}, Satuan: ${item.satuan}`} />
                            </List.Item>
                          )}
                        />
                      </>
                    )
                  },
                  {
                    key: 'output',
                    label: `Indikator Output`,
                    children: (
                      <>
                        <List
                          size="small"
                          bordered
                          dataSource={record.output_indikator_kinerja}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta title={item.nama} description={`Target : ${item.target}, Satuan: ${item.satuan}`} />
                            </List.Item>
                          )}
                        />
                      </>
                    )
                  },
                  {
                    key: 'outcome',
                    label: `Indikator Outcome`,
                    children: (
                      <>
                        <List
                          size="small"
                          bordered
                          dataSource={record.outcome_indikator_kinerja}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta title={item.nama} description={`Target : ${item.target}, Satuan: ${item.satuan}`} />
                            </List.Item>
                          )}
                        />
                      </>
                    )
                  }
                ]
              });
            }}
          />
          <Button icon={<DatabaseOutlined />} color="primary" variant="outlined" onClick={() => navigate(window.location.pathname + '/' + record.id)} />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.RKT}`,
      formFields: [
        ...rktFormFields({ options: { renstras, subActivities } }),
        ...(user.canAccess({ roles: [Role.ADMIN] })
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
                size: 'large',
                options: (unitKerja ?? []).map((item) => ({
                  label: item.name,
                  value: item.id
                }))
              }
            ]
          : [])
      ],
      onSubmit: async (values) => {
        const payload = {
          nama: values.nama,
          label: values.label,
          total_anggaran: values.total_anggaran,
          id_renstra: values.id_renstra,
          id_sub_kegiatan: values.id_sub_kegiatan,
          id_unit: user.canAccess({ roles: [Role.ADMIN] }) ? values.unit_id : user.unor.id,
          input_indikador_kinerja: [],
          output_indikador_kinerja: [],
          outcome_indikador_kinerja: []
        };
        const { isSuccess, message } = await storeRkt.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRkts();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: [
      ...rktsFilterFields(),
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
    isLoading: getAllRkts.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <>
      <PageExplanation title={`${Modul.RKT}`} subTitle={'Kelola dan atur data rkt dengan mudah. Tambahkan, ubah, atau hapus rkt agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader filter={filter} modul={Modul.RKT} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })} />}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllRkts.isLoading}>
            <DataTable data={rkts} columns={column} loading={getAllRkts.isLoading} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Rkts;
