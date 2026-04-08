import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { JptService, UnitKerjaService } from '@/services';
import { Button, Card, Skeleton, Space } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader, PageExplanation } from '@/components';
import { unorFormFields } from './FormFields';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Jpts = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllJpts } = useService(JptService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteJpt = useService(JptService.delete);
  const storeJpt = useService(JptService.store);
  const updateJpt = useService(JptService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllJpts.totalData });

  const navigate = useNavigate();

  const fetchJpts = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      perPage: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchJpts();
    fetchUnitKerja({ token: token });
  }, [fetchJpts, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const jpts = getAllJpts.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const column = [
    {
      title: 'Nama JPT',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    }
    // {
    //   title: 'Jabatan',
    //   dataIndex: 'jabatan',
    //   sorter: (a, b) => a.jabatan.length - b.jabatan.length,
    //   searchable: true,
    //   render: (record) => (
    //     <ol className="list-inside list-disc">
    //       {record?.map((item, index) => (
    //         <li key={index}>{item}</li>
    //       ))}
    //     </ol>
    //   )
    // }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.JPTS}`}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.JPTS}`,
                formFields: unorFormFields({ options: { unors: unitKerja } }),
                data: { ...record },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateJpt.execute(record.id, { ...values }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchJpts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.JPTS}`}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.JPTS}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteJpt.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchJpts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
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
      title: `Tambah ${Modul.JPTS}`,
      formFields: unorFormFields({ options: { unors: unitKerja } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeJpt.execute({ ...values, nip: [] }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchJpts({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <PageExplanation title={`${Modul.JPTS}`} subTitle={'Kelola dan atur data jpt dengan mudah. Tambahkan, ubah, atau hapus jpt agar tetap relevan dan terorganisir.'} />
      <Card title={<DataTableHeader modul={Modul.JPTS} onStore={onCreate} onSearch={(values) => setFilterValues({ search: values })}></DataTableHeader>}>
        <div className="w-full max-w-full overflow-x-auto">
          <Skeleton loading={getAllJpts.isLoading}>
            <DataTable data={jpts} columns={column} loading={getAllJpts.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default Jpts;
