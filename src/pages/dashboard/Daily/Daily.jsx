/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { HarianService, UnitKerjaService, UserService } from '@/services';
import { Button, Card, Descriptions, Divider, List, Skeleton, Space, Tooltip, Typography } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import moment from 'moment';
import { InputType } from '@/constants';
import dayjs from 'dayjs';
import { Detail, Edit } from '@/components/dashboard/button';
import { formFields } from './FormFields';
import { FileOutlined, FileSyncOutlined, LinkOutlined } from '@ant-design/icons';
import { UploadForm } from './UploadForm';

const Daily = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllHarian } = useService(HarianService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const { execute: fetchUsers } = useService(UserService.getUsersByUnit);
  const [filterValues, setFilterValues] = React.useState({
    search: '',
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    user_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.newNip,
    date: null
  });
  const updateHarian = useService(HarianService.update);
  const pagination = usePagination({ totalData: getAllHarian.totalData });

  const fetchDaily = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs?.length ? filterValues.unit_id : user?.unor.id,
      user_id: user?.isAdmin || user?.umpegs?.length ? filterValues.id_user : user?.newNip,
      date: filterValues.date ? dayjs(filterValues.date).format('YYYY-MM-DD') : null
    });
  }, [execute, filterValues.date, filterValues.id_user, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.newNip, user?.umpegs?.length, user?.unor.id]);

  React.useEffect(() => {
    fetchDaily();
    fetchUnitKerja({ token: token });
  }, [fetchDaily, fetchUnitKerja, pagination.page, pagination.per_page, token]);

  const daily = getAllHarian.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];
  const memoizedUnitKerja = React.useMemo(() => unitKerja ?? [], [unitKerja?.length]);

  const column = [
    {
      title: 'Nama Kegiatan',
      dataIndex: 'desc',
      key: 'desc',
      sorter: (a, b) => a.desc.localeCompare(b.desc),
      searchable: true
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('DD MMMM YYYY'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      searchable: true
    },
    {
      title: 'Waktu Mulai',
      dataIndex: 'start_date_time',
      key: 'start_date_time',
      render: (text) => moment(text).format('HH:mm'),
      sorter: (a, b) => moment(a.start_date_time).unix() - moment(b.start_date_time).unix()
    },
    {
      title: 'Waktu Selesai',
      dataIndex: 'end_date_time',
      key: 'end_date_time',
      render: (text) => moment(text).format('HH:mm'),
      sorter: (a, b) => moment(a.end_date_time).unix() - moment(b.end_date_time).unix()
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="w-full">
          <div className="mb-1 flex justify-between">
            <span className="text-xs font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.progress - b.progress
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ABSENCE}`}
            onClick={() => {
              modal.edit({
                title: `Ubah ${Modul.ABSENCE}`,
                formFields: formFields,
                data: { ...record, start_date_time: dayjs(record.start_date_time), end_date_time: dayjs(record.end_date_time) },
                onSubmit: async (values) => {
                  const { isSuccess, message } = await updateHarian.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchDaily({ token: token, page: pagination.page, per_page: pagination.per_page, search: filterValues.search, unit_id: filterValues.unit_id, user_id: filterValues.user, date: filterValues.date });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Tooltip title="Ganti Bukti Harian">
            <Button
              icon={<FileSyncOutlined />}
              variant="outlined"
              color="primary"
              onClick={() => {
                modal.show.paragraph({
                  data: {
                    content: <UploadForm modal={modal} record={record} token={token} updateHarian={updateHarian} fetchDaily={fetchDaily} pagination={pagination} filterValues={filterValues} success={success} error={error} />
                  }
                });
              }}
            />
          </Tooltip>
          <Detail
            title={`Detail Harian`}
            onClick={() => {
              modal.show.paragraph({
                data: {
                  content: (
                    <>
                      <Descriptions title="Informasi Kegiatan" bordered column={2} className="mb-4">
                        <Descriptions.Item label="Nama Kegiatan" span={2}>
                          {record.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Deskripsi" span={2}>
                          {record.desc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tanggal">{moment(record.date).format('DD MMMM YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Waktu">{`${moment(record.start_date_time).format('HH:mm')} - ${moment(record.end_date_time).format('HH:mm')}`}</Descriptions.Item>
                        <Descriptions.Item label="Progress">
                          <div className="flex items-center">
                            <span className="mr-2">{record.progress}%</span>
                            <div className="h-2.5 w-32 rounded-full bg-gray-200">
                              <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${record.progress}%` }}></div>
                            </div>
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                      {record.skp && (
                        <>
                          <Divider orientation="left">Informasi SKP</Divider>
                          <Descriptions bordered column={2} className="mb-4">
                            <Descriptions.Item label="ID SKP" span={2}>
                              {record.skp.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Periode">{`${moment(record.skp.periode_start).format('DD MMMM YYYY')} - ${moment(record.skp.periode_end).format('DD MMMM YYYY')}`}</Descriptions.Item>
                            <Descriptions.Item label="Status">{record.skp.status}</Descriptions.Item>
                            <Descriptions.Item label="Pendekatan">{record.skp.pendekatan}</Descriptions.Item>
                          </Descriptions>
                        </>
                      )}
                      {record.rhk && (
                        <>
                          <Divider orientation="left">Informasi RHK</Divider>
                          <Descriptions bordered column={2} className="mb-4">
                            <Descriptions.Item label="Deskripsi" span={2}>
                              {record.rhk.desc}
                            </Descriptions.Item>
                            <Descriptions.Item label="Jenis">{record.rhk.jenis}</Descriptions.Item>
                            <Descriptions.Item label="Klasifikasi">{record.rhk.klasifikasi}</Descriptions.Item>
                          </Descriptions>

                          {/* Aspek RHK */}
                          {record.rhk.aspek && record.rhk.aspek.length > 0 && (
                            <>
                              <Typography.Title level={5} className="mb-2 mt-4">
                                Aspek RHK
                              </Typography.Title>
                              <List
                                bordered
                                dataSource={record.rhk.aspek}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta title={item.jenis} description={item.desc} />
                                  </List.Item>
                                )}
                              />
                            </>
                          )}
                        </>
                      )}
                      {record.rencana_aksi && record.rencana_aksi.length > 0 && (
                        <>
                          <Divider orientation="left">Rencana Aksi</Divider>
                          <List
                            bordered
                            dataSource={record.rencana_aksi}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta title={`Rencana Aksi (${moment(item.periode_start).format('DD MMM YYYY')} - ${moment(item.periode_end).format('DD MMM YYYY')})`} description={item.desc} />
                              </List.Item>
                            )}
                          />
                        </>
                      )}
                      {record.tautan && (
                        <>
                          <Divider orientation="left">Tautan</Divider>
                          <div className="mb-4">
                            <a href={record.tautan} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                              <LinkOutlined className="mr-2" />
                              {record.tautan}
                            </a>
                          </div>
                        </>
                      )}
                      {record.files && record.files.length > 0 && (
                        <>
                          <Divider orientation="left">Files</Divider>
                          <List
                            bordered
                            dataSource={record.files}
                            renderItem={(file) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<FileOutlined style={{ fontSize: '24px' }} />}
                                  title={file.name || 'File Lampiran'}
                                  description={file.type ? `${file.size ? `${(file.size / 1024).toFixed(2)} KB - ` : ''}${file.type}` : 'File Lampiran'}
                                />
                              </List.Item>
                            )}
                          />
                        </>
                      )}
                    </>
                  )
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const filter = React.useMemo(
    () => ({
      formFields: [
        ...(user?.isAdmin || user?.umpegs?.length
          ? [
              {
                label: 'Nama Unit',
                name: 'unit_id',
                type: InputType.SELECT,
                options: user?.isAdmin
                  ? memoizedUnitKerja.map((item) => ({
                      label: item.nama_unor,
                      value: item.id_simpeg
                    }))
                  : user.umpegs.map((item) => ({
                      label: item.unit.nama_unor,
                      value: item.unit.id_simpeg
                    }))
              },
              {
                label: 'NIP',
                name: 'id_user',
                type: InputType.SELECT_WITH_PARENT,
                parentName: 'unit_id',
                fetchOptions: async ({ token, parentValue }) => {
                  const res = await fetchUsers({ token, unitId: parentValue });
                  return res;
                },
                mapOptions: (item) => ({
                  label: `${item.nip_asn} - ${item.nama_asn}`,
                  value: item.nip_asn
                }),
                size: 'large'
              },
              {
                label: 'Tanggal',
                name: 'date',
                type: InputType.DATE,
                size: 'large'
              }
            ]
          : [])
      ],
      initialData: {
        unit_id: filterValues.unit_id,
        id_user: filterValues.id_user,
        date: filterValues.date ? dayjs(filterValues.date) : null
      },
      isLoading: getAllHarian.isLoading,
      onSubmit: (values) => {
        setFilterValues((prev) => ({
          ...prev,
          id_user: user?.isAdmin || user?.umpegs?.length ? values.id_user : user?.newNip,
          unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor?.id,
          date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null
        }));
      }
    }),
    [user?.isAdmin, user.umpegs, user?.newNip, user?.unor?.id, memoizedUnitKerja, filterValues.unit_id, filterValues.id_user, getAllHarian.isLoading, fetchUsers]
  );

  return (
    <Card>
      <DataTableHeader filter={filter} modul={Modul.ABSENCE}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllHarian.isLoading}>
          <DataTable data={daily} columns={column} loading={getAllHarian.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default Daily;
