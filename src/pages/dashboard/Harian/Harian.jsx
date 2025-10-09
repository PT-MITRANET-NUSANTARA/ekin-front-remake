/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth, useNotification, usePagination, useService } from '@/hooks';
import { HarianService, UnitKerjaService, UserService } from '@/services';
import { Card, Space, Button, Skeleton, Row, Col, Form, Input, DatePicker, TimePicker, Select, Slider, Modal, Typography, Descriptions, List, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, LinkOutlined, InfoCircleOutlined, FileOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable, DataTableHeader } from '@/components';
import moment from 'moment';
import 'moment/locale/id';
import { InputType } from '@/constants';

const Harian = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // State untuk data
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadType, setUploadType] = useState('files');
  const [showForm, setShowForm] = useState(false);

  // State untuk modal detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // State untuk modal edit
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // State untuk filter dan pagination

  // State untuk options
  const [skpOptions, setSkpOptions] = useState([]);
  const [rhkOptions, setRhkOptions] = useState([]);
  const [rencanaAksiOptions, setRencanaAksiOptions] = useState([]);

  // Mendapatkan parameter dari URL
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('user_id');
  const date = queryParams.get('date');

  // Service untuk mengambil data harian
  const { execute, ...getHarianService } = useService(HarianService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const { execute: fetchUsers, ...getUsersByUnit } = useService(UserService.getUsersByUnit);

  const [filterValues, setFilterValues] = React.useState({
    search: '',
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    user_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.newNip,
    date: moment().format('YYYY-MM-DD')
  });
  const pagination = usePagination({ totalData: getHarianService.totalData });
  const deleteHarian = useService(HarianService.delete);
  const storeHarian = useService(HarianService.store);
  const updateHarian = useService(HarianService.update);

  const unitKerja = getAllUnitKerja.data ?? [];
  const memoizedUnitKerja = React.useMemo(() => unitKerja ?? [], [unitKerja?.length]);
  const harianData = getHarianService.data ?? [];

  const fetchHarian = React.useCallback(() => {
    execute({
      token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs?.length ? filterValues.unit_id : user?.unor.id,
      user_id: user?.isAdmin || user?.umpegs?.length ? filterValues.id_user : user?.newNip,
      date: filterValues.date
    });
  }, [execute, token, pagination.page, pagination.per_page, filterValues.search, filterValues.unit_id, filterValues.id_user, filterValues.date, user?.isAdmin, user?.umpegs?.length, user?.unor?.id, user?.newNip]);

  React.useEffect(() => {
    fetchHarian();
    fetchUnitKerja({ token: token });
  }, [fetchHarian, fetchUnitKerja, fetchUsers, pagination.page, pagination.per_page, token]);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true);

      // Get the date part from the date field
      const dateStr = values.date.format('YYYY-MM-DD');

      // Format the data according to API requirements
      const formData = {
        date: dateStr,
        start_date_time: `${dateStr} ${values.start_time.format('HH:mm:ss')}`,
        end_date_time: `${dateStr} ${values.end_time.format('HH:mm:ss')}`,
        progress: values.progress,
        name: values.name,
        desc: values.desc,
        user_id: userId || user?.newNip,
        rencana_aksi_ids: values.rencana_aksi_ids || [],
        skp_id: values.skp_id,
        rhk_id: values.rhk_id
      };

      // Handle files or link based on upload type
      if (uploadType === 'files' && values.files) {
        formData.files = values.files.fileList;
      } else if (uploadType === 'link' && values.tautan) {
        formData.tautan = values.tautan;
      }

      let response;

      if (values.id) {
        // Update existing data
        response = await updateHarian.execute(values.id, formData, token);

        if (response.status) {
          success('Berhasil', 'Data harian berhasil diperbarui');
          form.resetFields();
          setShowForm(false);
        } else {
          error('Gagal', response.message || 'Gagal memperbarui data harian');
        }
      } else {
        // Create new data
        response = await storeHarian.execute(formData, token);

        if (response.status) {
          success('Berhasil', 'Data harian berhasil disimpan');
          form.resetFields();
          setShowForm(false);
        } else {
          error('Gagal', response.message || 'Gagal menyimpan data harian');
        }
      }

      if (response.status) {
        // Refresh data
        fetchHarian({ token: token });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      error('Error', 'Terjadi kesalahan saat menyimpan data harian');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (id) => {
    try {
      const response = await deleteHarian.execute(id, token);

      if (response.status) {
        success('Berhasil', 'Data harian berhasil dihapus');
        fetchHarian({ token: token });
      } else {
        error('Gagal', response.message || 'Gagal menghapus data harian');
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      error('Error', 'Terjadi kesalahan saat menghapus data harian');
    }
  };

  // Fungsi untuk mengedit data (sekarang membuka modal edit)
  const handleEdit = (record) => {
    setEditRecord(record);
    editForm.setFieldsValue({
      id: record.id,
      date: moment(record.date),
      start_time: moment(record.start_date_time),
      end_time: moment(record.end_date_time),
      name: record.name,
      desc: record.desc,
      progress: record.progress,
      skp_id: record.skp_id,
      rhk_id: record.rhk_id,
      rencana_aksi_ids: record.rencana_aksi_ids,
      user_id: record.user_id
    });

    setEditModalVisible(true);
  };

  // Fungsi untuk menyimpan hasil edit
  const handleEditSubmit = async (values) => {
    try {
      setSubmitLoading(true);

      // Get the date part from the date field
      const dateStr = values.date.format('YYYY-MM-DD');

      // Format the data according to API requirements
      const formData = {
        date: dateStr,
        start_date_time: `${dateStr} ${values.start_time.format('HH:mm:ss')}`,
        end_date_time: `${dateStr} ${values.end_time.format('HH:mm:ss')}`,
        progress: values.progress,
        name: values.name,
        desc: values.desc,
        user_id: values.user_id, // Menggunakan user_id yang sudah ada
        rencana_aksi_ids: values.rencana_aksi_ids, // Menggunakan rencana_aksi_ids yang sudah ada
        skp_id: values.skp_id, // Menggunakan skp_id yang sudah ada
        rhk_id: values.rhk_id // Menggunakan rhk_id yang sudah ada
      };

      // Update existing data
      const response = await updateHarian.execute(values.id, formData, token);

      if (response.status) {
        success('Berhasil', 'Data harian berhasil diperbarui');
        editForm.resetFields();
        setEditModalVisible(false);
        fetchHarian({ token: token });
      } else {
        error('Gagal', response.message || 'Gagal memperbarui data harian');
      }
    } catch (err) {
      console.error('Error submitting edit form:', err);
      error('Error', 'Terjadi kesalahan saat memperbarui data harian');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fungsi untuk menampilkan detail
  const handleShowDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  // Kolom untuk tabel
  const columns = [
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
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<InfoCircleOutlined />} onClick={() => handleShowDetail(record)} title="Lihat Detail" />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      )
    }
  ];

  React.useEffect(() => {
    fetchUnitKerja({ token: token });
  }, [fetchUnitKerja, pagination.page, pagination.per_page, token]);

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
              }
            ]
          : [])
      ],
      initialData: {
        unit_id: filterValues.unit_id,
        id_user: filterValues.id_user
      },
      isLoading: getHarianService.isLoading,
      onSubmit: (values) => {
        setFilterValues((prev) => ({
          ...prev,
          id_user: user?.isAdmin || user?.umpegs?.length ? values.id_user : user?.newNip,
          unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor?.id
        }));
      }
    }),
    [user?.isAdmin, user.umpegs, user?.newNip, user?.unor?.id, memoizedUnitKerja, filterValues.unit_id, filterValues.id_user, getHarianService.isLoading, fetchUsers]
  );

  return (
    <div className="w-full">
      <Card>
        {/* Tabel Data Harian */}
        <Skeleton loading={getHarianService.isLoading}>
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                {userId && date && (
                  <div className="text-gray-600">
                    <span>Data untuk User ID: {userId}</span>
                    <span className="mx-2">|</span>
                    <span>Tanggal: {moment(date).format('DD MMMM YYYY')}</span>
                  </div>
                )}
              </div>
            </div>
            <DataTableHeader modul={'Data Harian'} filter={filter}></DataTableHeader>
            <DataTable data={harianData} columns={columns} loading={getHarianService.isLoading} map={(harian) => ({ key: harian.id, ...harian })} pagination={pagination} />
          </>
        </Skeleton>
      </Card>

      {/* Modal Detail */}
      <Modal
        title={<div className="text-lg font-semibold">Detail Kegiatan Harian</div>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Tutup
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Informasi Kegiatan */}
            <Descriptions title="Informasi Kegiatan" bordered column={2} className="mb-4">
              <Descriptions.Item label="Nama Kegiatan" span={2}>
                {selectedRecord.name}
              </Descriptions.Item>
              <Descriptions.Item label="Deskripsi" span={2}>
                {selectedRecord.desc}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal">{moment(selectedRecord.date).format('DD MMMM YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Waktu">{`${moment(selectedRecord.start_date_time).format('HH:mm')} - ${moment(selectedRecord.end_date_time).format('HH:mm')}`}</Descriptions.Item>
              <Descriptions.Item label="Progress">
                <div className="flex items-center">
                  <span className="mr-2">{selectedRecord.progress}%</span>
                  <div className="h-2.5 w-32 rounded-full bg-gray-200">
                    <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${selectedRecord.progress}%` }}></div>
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* Informasi SKP */}
            {selectedRecord.skp && (
              <>
                <Divider orientation="left">Informasi SKP</Divider>
                <Descriptions bordered column={2} className="mb-4">
                  <Descriptions.Item label="ID SKP" span={2}>
                    {selectedRecord.skp.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Periode">{`${moment(selectedRecord.skp.periode_start).format('DD MMMM YYYY')} - ${moment(selectedRecord.skp.periode_end).format('DD MMMM YYYY')}`}</Descriptions.Item>
                  <Descriptions.Item label="Status">{selectedRecord.skp.status}</Descriptions.Item>
                  <Descriptions.Item label="Pendekatan">{selectedRecord.skp.pendekatan}</Descriptions.Item>
                </Descriptions>
              </>
            )}

            {/* Informasi RHK */}
            {selectedRecord.rhk && (
              <>
                <Divider orientation="left">Informasi RHK</Divider>
                <Descriptions bordered column={2} className="mb-4">
                  <Descriptions.Item label="Deskripsi" span={2}>
                    {selectedRecord.rhk.desc}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis">{selectedRecord.rhk.jenis}</Descriptions.Item>
                  <Descriptions.Item label="Klasifikasi">{selectedRecord.rhk.klasifikasi}</Descriptions.Item>
                </Descriptions>

                {/* Aspek RHK */}
                {selectedRecord.rhk.aspek && selectedRecord.rhk.aspek.length > 0 && (
                  <>
                    <Typography.Title level={5} className="mb-2 mt-4">
                      Aspek RHK
                    </Typography.Title>
                    <List
                      bordered
                      dataSource={selectedRecord.rhk.aspek}
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

            {/* Informasi Rencana Aksi */}
            {selectedRecord.rencana_aksi && selectedRecord.rencana_aksi.length > 0 && (
              <>
                <Divider orientation="left">Rencana Aksi</Divider>
                <List
                  bordered
                  dataSource={selectedRecord.rencana_aksi}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta title={`Rencana Aksi (${moment(item.periode_start).format('DD MMM YYYY')} - ${moment(item.periode_end).format('DD MMM YYYY')})`} description={item.desc} />
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* Tautan */}
            {selectedRecord.tautan && (
              <>
                <Divider orientation="left">Tautan</Divider>
                <div className="mb-4">
                  <a href={selectedRecord.tautan} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                    <LinkOutlined className="mr-2" />
                    {selectedRecord.tautan}
                  </a>
                </div>
              </>
            )}

            {/* Files */}
            {selectedRecord.files && selectedRecord.files.length > 0 && (
              <>
                <Divider orientation="left">Files</Divider>
                <List
                  bordered
                  dataSource={selectedRecord.files}
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
          </div>
        )}
      </Modal>

      {/* Modal Edit */}
      <Modal title={<div className="text-lg font-semibold">Edit Kegiatan Harian</div>} open={editModalVisible} onCancel={() => setEditModalVisible(false)} footer={null} width={700}>
        {editRecord && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              id: editRecord.id,
              date: moment(editRecord.date),
              start_time: moment(editRecord.start_date_time),
              end_time: moment(editRecord.end_date_time),
              name: editRecord.name,
              desc: editRecord.desc,
              progress: editRecord.progress,
              skp_id: editRecord.skp_id,
              rhk_id: editRecord.rhk_id,
              rencana_aksi_ids: editRecord.rencana_aksi_ids,
              user_id: editRecord.user_id
            }}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            {/* Field yang tidak bisa diedit */}
            <Form.Item name="user_id" label="User ID" tooltip="Field ini tidak dapat diubah">
              <Input disabled />
            </Form.Item>

            <Form.Item name="skp_id" label="SKP ID" tooltip="Field ini tidak dapat diubah">
              <Input disabled />
            </Form.Item>

            <Form.Item name="rhk_id" label="RHK ID" tooltip="Field ini tidak dapat diubah">
              <Input disabled />
            </Form.Item>

            <Form.Item name="rencana_aksi_ids" label="Rencana Aksi IDs" tooltip="Field ini tidak dapat diubah">
              <Select mode="multiple" disabled />
            </Form.Item>

            {/* Field yang bisa diedit */}
            <Form.Item name="name" label="Nama Kegiatan" rules={[{ required: true, message: 'Nama kegiatan harus diisi' }]}>
              <Input />
            </Form.Item>

            <Form.Item name="desc" label="Deskripsi" rules={[{ required: true, message: 'Deskripsi harus diisi' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item name="date" label="Tanggal" rules={[{ required: true, message: 'Tanggal harus diisi' }]}>
              <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="start_time" label="Waktu Mulai" rules={[{ required: true, message: 'Waktu mulai harus diisi' }]}>
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="end_time" label="Waktu Selesai" rules={[{ required: true, message: 'Waktu selesai harus diisi' }]}>
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="progress" label="Progress" rules={[{ required: true, message: 'Progress harus diisi' }]}>
              <Slider
                marks={{
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%'
                }}
              />
            </Form.Item>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setEditModalVisible(false)} className="mr-2">
                Batal
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Harian;
