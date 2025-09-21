import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { MissionsService, VisionsService } from '@/services';
import { Card, Space, Typography } from 'antd';
import React from 'react';
import { Missions as MissionModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';

const Missions = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllMissions } = useService(MissionsService.getAll);
  const { execute: fetchVision } = useService(VisionsService.getAll);
  const deleteMission = useService(MissionsService.delete);
  const storeMission = useService(MissionsService.store);
  const updateMission = useService(MissionsService.update);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const pagination = usePagination({ totalData: getAllMissions.totalData });
  const [selectedNews, setSelectedNews] = React.useState([]);

  const fetchMissions = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  React.useEffect(() => {
    fetchMissions();
    fetchVision({ token: token });
  }, [fetchMissions, fetchVision, pagination.page, pagination.per_page, token]);

  const missions = getAllMissions.data ?? [];
  const vision = getAllMissions.data ?? [];

  const column = [
    {
      title: 'Judul Misi',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Deksripsi',
      dataIndex: 'deskripsi',
      sorter: (a, b) => a.deskripsi.length - b.deskripsi.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.MISSION}`}
            model={MissionModel}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.MISSION}`,
                formFields: formFields({ fetchVision, options: { visions: vision } }),
                data: { ...record, visi_id: { value: record.visi.id, label: record.visi.nama } },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateMission.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMissions({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.MISSION}`}
            model={MissionModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.MISSION}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteMission.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMissions({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.MISSION}`}
            model={MissionModel}
            onClick={() => {
              modal.show.description({
                title: record.nama,
                data: [
                  {
                    key: 'nama',
                    label: `Judul ${Modul.MISSION}`,
                    children: record.nama
                  },
                  {
                    key: 'deskripsi',
                    label: `Deskripsi Misi`,
                    children: record.deskripsi
                  },
                  {
                    key: 'visi',
                    label: `Visi`,
                    children: (
                      <div className="flex flex-col gap-y-1">
                        <Typography.Text strong level={5}>
                          {record.visi.nama}
                        </Typography.Text>
                        <Typography.Text>{record.visi.deskripsi}</Typography.Text>
                      </div>
                    )
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
      title: `Tambah ${Modul.MISSION}`,
      formFields: formFields({ fetchVision }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeMission.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMissions({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.MISSION} onStore={onCreate} selectedData={selectedNews} onSearch={(values) => setFilterValues({ search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={missions} columns={column} loading={getAllMissions.isLoading} map={(mission) => ({ key: mission.id, ...mission })} pagination={pagination} handleSelectedData={(_, selectedRows) => setSelectedNews(selectedRows)} />
      </div>
    </Card>
  );
};

export default Missions;
