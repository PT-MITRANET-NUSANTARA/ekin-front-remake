/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { HarianService } from '@/services';
import { Button, Card, Descriptions, Divider, List, Skeleton, Space, Tooltip, Typography } from 'antd';
import React from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Detail, Edit } from '@/components/dashboard/button';
import { formFields } from '../Daily/FormFields';
import dayjs from 'dayjs';
import { FileOutlined, FileSyncOutlined, LinkOutlined } from '@ant-design/icons';
import { UploadForm } from '../Daily/UploadForm';

const DetailAbsence = () => {
  const { token, user } = useAuth();
  const { user_id, date } = useParams();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute, ...getAllHarian } = useService(HarianService.getAll);
  const pagination = usePagination({ totalData: getAllHarian.totalData });
  const updateHarian = useService(HarianService.update);

  const fetchDaily = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      user_id: user_id,
      date: date
    });
  }, [execute, pagination.page, pagination.per_page, token, user?.isAdmin, user?.newNip, user?.umpegs?.length, user?.unor.id]);

  React.useEffect(() => {
    fetchDaily();
  }, [fetchDaily, pagination.page, pagination.per_page, token]);

  const daily = getAllHarian.data ?? [];

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
                    fetchDaily({ token: token, page: pagination.page, per_page: pagination.per_page, user_id: user_id, date: date });
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
                    content: <UploadForm modal={modal} record={record} token={token} updateHarian={updateHarian} fetchDaily={fetchDaily} pagination={pagination} success={success} error={error} />
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

  return (
    <Card>
      <DataTableHeader modul={Modul.ABSENCE}></DataTableHeader>
      <div className="w-full max-w-full overflow-x-auto">
        <Skeleton loading={getAllHarian.isLoading}>
          <DataTable data={daily} columns={column} loading={getAllHarian.isLoading} map={(vision) => ({ key: vision.id, ...vision })} pagination={pagination} />
        </Skeleton>
      </div>
    </Card>
  );
};

export default DetailAbsence;
