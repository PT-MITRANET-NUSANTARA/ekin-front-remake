import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { UnitKerjaService, VerificatorService } from '@/services';
import { Button, Card, List, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { unorFormFields } from './FormFields';
import { BarsOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Verificators = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllverificators } = useService(VerificatorService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteVerificator = useService(VerificatorService.delete);
  const storeVerificator = useService(VerificatorService.store);
  const updateVerificator = useService(VerificatorService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllverificators.totalData });

  const navigate = useNavigate();

  const fetchVerificators = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchVerificators();
    fetchUnitKerja({ token: token });
  }, [fetchVerificators, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const verificator = getAllverificators.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Nama Unit',
      width: '30%',
      dataIndex: ['unit_detail', 'nama_unor'],
      sorter: (a, b) => a.unit_detail.nama_unor.length - b.unit_detail.nama_unor.length,
      searchable: true
    },
    {
      title: 'Daftar Unor Verifikasi',
      dataIndex: 'jabatan_detail',
      render: (jabatan_detail, record) => {
        if (!Array.isArray(jabatan_detail)) return '-';

        return (
          <List
            size="small"
            bordered={false}
            dataSource={jabatan_detail}
            renderItem={(jd) => (
              <List.Item key={jd.unor_id}>
                <Button
                  icon={<BarsOutlined />}
                  onClick={() => {
                    modal.show.description({
                      title: 'Detail Verificator',
                      data: [
                        {
                          key: 'nama',
                          label: `Nama Unit Verificator`,
                          children: jd.unor_detail?.nama_unor
                        },
                        {
                          key: 'jabatan',
                          label: `Jabatan Verificator`,
                          children: (
                            <div className="flex flex-col gap-y-2">
                              <List size="small" dataSource={jd.jabatan_list ?? []} renderItem={(item) => <List.Item className="text-sm">{item}</List.Item>} />
                              <hr />
                              <div className="flex items-center gap-x-2">
                                <Button
                                  className="w-fit"
                                  onClick={() => {
                                    navigate(`/dashboard/verificator/${record.id}/${record.unit_id}/jabatan/${jd.unor_id}`);
                                    modal.close();
                                  }}
                                  icon={<DatabaseOutlined />}
                                  variant="outlined"
                                  color="primary"
                                >
                                  Edit Daftar Jabatan Verifikator
                                </Button>
                              </div>
                            </div>
                          )
                        }
                      ]
                    });
                  }}
                >
                  {jd.unor_detail?.nama_unor}
                </Button>
              </List.Item>
            )}
          />
        );
      }
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VERIFICATOR}`}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.VERIFICATOR}`,
                formFields: unorFormFields({ options: { unors: unitKerja } }),
                data: {
                  unit_id: record.unit_id,
                  unor_id: record.jabatan.map((j) => Object.keys(j)[0])
                },
                onSubmit: async (values) => {
                  const payload = {
                    unit_id: values.unit_id,
                    jabatan: values.unor_id.map((id) => ({ [id]: [] }))
                  };
                  const { isSuccess, message } = await updateVerificator.execute(record.id, payload, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVerificators({
                      token,
                      page: pagination.page,
                      per_page: pagination.per_page
                    });
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />

          <Delete
            title={`Delete ${Modul.VERIFICATOR}`}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VERIFICATOR}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVerificator.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVerificators({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.VERIFICATOR}`,
      formFields: unorFormFields({ options: { unors: unitKerja } }),
      onSubmit: async (values) => {
        const payload = {
          unit_id: values.unit_id,
          jabatan: values.unor_id.map((id) => ({ [id]: [] }))
        };

        const { isSuccess, message } = await storeVerificator.execute(payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchVerificators({
            token,
            page: pagination.page,
            per_page: pagination.per_page
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
      <DataTableHeader modul={Modul.VERIFICATOR} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllverificators.isLoading}>
          <DataTable data={verificator} columns={column} loading={getAllverificators.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Verificators;
