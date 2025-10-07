import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert, Form, Input, DatePicker, TimePicker, Button, Card, Select, Upload, message, Radio, Slider, Drawer, Descriptions, Badge } from 'antd';
import { useAuth } from '@/hooks';
import { AuthService, HarianService, RencanaAksiService, SkpsService, RhkService } from '@/services';
import { ProfileCard, AbsenceCard, DashboardSummary } from '@/components/dashboard';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/dist/style.css';
import { UploadOutlined, LinkOutlined, CalendarOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [rencanaAksiOptions, setRencanaAksiOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [rhkOptions, setRhkOptions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadType, setUploadType] = useState('files');
  const [showForm, setShowForm] = useState(false);
  const [drawer, setDrawer] = useState({ open: false, data: {}, placement: 'right' });

  // Fungsi untuk mengambil data dashboard
  const fetchDashboardData = async (isRefresh = false) => {
    const abortController = new AbortController();
    
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      
      const response = await AuthService.getDashboard(token, abortController.signal);
      
      if (response.status) {
        setDashboardData(response.data);
        
        // Set default date from absence date if available
        if (response.data?.absence?.date) {
          form.setFieldsValue({
            date: moment(response.data.absence.date)
          });
        }
      } else {
        setError(response.message || 'Gagal mengambil data dashboard');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Terjadi kesalahan saat mengambil data dashboard');
        console.error(err);
      }
    } finally {
      if (!isRefresh) {
        setLoading(false);
      }
    }
    
    return () => {
      abortController.abort();
    };
  };

  // Mengambil data dashboard saat komponen dimuat
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (token && user?.newNip) {
          // Fetch SKP options
          const skpResponse = await SkpsService.getAll({ token, user_id: user.newNip });
          if (skpResponse.status && skpResponse.data) {
            setSkpOptions(skpResponse.data.map(skp => ({
              label: `${skp.periode_start} - ${skp.periode_end}`,
              value: skp.id
            })));
          }
          
          // Fetch Rencana Aksi options
          const rencanaAksiResponse = await RencanaAksiService.getAll(token);
          if (rencanaAksiResponse.status && rencanaAksiResponse.data) {
            setRencanaAksiOptions(rencanaAksiResponse.data.map(ra => ({
              label: ra.desc,
              value: ra.id
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };
    
    fetchOptions();
  }, [token, user]);
  
  // Fetch RHK options when SKP is selected
  const handleSkpChange = async (skpId) => {
    try {
      if (token && skpId) {
          // Reset RHK and Rencana Aksi options when SKP changes
        setRhkOptions([]);
        setRencanaAksiOptions([]);
        form.setFieldsValue({ rhk_id: undefined, rencana_aksi_ids: [] });
        
        const rhkResponse = await RhkService.getBySkp({ token, skp_id: skpId });
        if (rhkResponse.status && rhkResponse.data) {
          setRhkOptions(rhkResponse.data.map(rhk => ({
            label: rhk.desc,
            value: rhk.id
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching RHK options:', err);
    }
  };
  
  // Fetch Rencana Aksi options when RHK is selected
  const handleRhkChange = async (rhkId) => {
    try {
      if (token && rhkId) {
        // Reset Rencana Aksi options
        setRencanaAksiOptions([]);
        form.setFieldsValue({ rencana_aksi_ids: [] });
        
        // Fetch Rencana Aksi options based on RHK ID
        const rencanaAksiResponse = await RencanaAksiService.getByRhk({ token, rhk_id: rhkId });
        
        // Handle nested response structure (data.data.data)
        if (rencanaAksiResponse.status && 
            rencanaAksiResponse.data && 
            rencanaAksiResponse.data.status && 
            rencanaAksiResponse.data.data) {
          
          setRencanaAksiOptions(rencanaAksiResponse.data.data.map(ra => ({
            label: ra.desc,
            value: ra.id
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching Rencana Aksi options:', err);
    }
  };
  
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
        user_id: dashboardData?.profile?.nipBaru,
        rencana_aksi_ids: values.rencana_aksi_ids || [], // Kirim sebagai array, bukan string
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
      
      // Jika drawer terbuka dan ada data, berarti sedang mengedit
      if (drawer.open && drawer.data.id) {
        response = await HarianService.update(drawer.data.id, formData, token);
        
        if (response.status) {
          message.success('Data harian berhasil diperbarui');
          setDrawer(prev => ({ ...prev, open: false })); // Tutup drawer setelah berhasil
        } else {
          message.error(response.message || 'Gagal memperbarui data harian');
        }
      } else {
        // Jika tidak, berarti sedang menambah data baru
        response = await HarianService.store(formData, token);
        
        if (response.status) {
          message.success('Data harian berhasil disimpan');
        } else {
          message.error(response.message || 'Gagal menyimpan data harian');
        }
      }
      
      if (response.status) {
        form.resetFields();
        editForm.resetFields();
        setShowForm(false); // Tutup form setelah berhasil
        
        // Refresh data dashboard untuk menampilkan data harian terbaru
        await fetchDashboardData(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      message.error('Terjadi kesalahan saat menyimpan data harian');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Memuat data dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  const profile = dashboardData?.profile;
  const absence = dashboardData?.absence;
  const settings = dashboardData?.settings;

  return (
    <div className="w-full">
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <ProfileCard profile={profile} />
        </Col>
        
        {/* <Col xs={24}>
          <DashboardSummary profile={profile} />
        </Col> */}
        
        <Col xs={24}>
          <AbsenceCard absence={absence} />
        </Col>

        {/* Tombol Tambah Kegiatan Harian */}
        {absence && (
          <Col xs={24}>
            <div className="flex justify-end mb-4">
              <Button 
                type="primary" 
                icon={<CalendarOutlined />} 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Tutup Form' : 'Tambah Kegiatan Harian'}
              </Button>
            </div>
          </Col>
        )}

        {/* Daily Entry Form */}
        {showForm && absence && (
          <Col xs={24}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ marginRight: '8px' }} />
                  Form Kegiatan Harian
                </div>
              }
              className="mb-4"
            >
              <Form
                form={drawer.open && drawer.data.id ? editForm : form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  date: absence?.date ? moment(absence.date) : moment(),
                  start_time: settings?.default_harian_time_start ? 
                    moment(settings.default_harian_time_start, 'HH:mm:ss') : 
                    moment('08:00:00', 'HH:mm:ss'),
                  end_time: settings?.default_harian_time_end ? 
                    moment(settings.default_harian_time_end, 'HH:mm:ss') : 
                    moment('16:00:00', 'HH:mm:ss'),
                  progress: 100
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="date"
                      label="Tanggal"
                      rules={[{ required: true, message: 'Tanggal wajib diisi' }]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }} 
                        format="YYYY-MM-DD" 
                        disabled={absence?.date ? true : false}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="start_time"
                      label="Waktu Mulai"
                      rules={[{ required: true, message: 'Waktu mulai wajib diisi' }]}
                    >
                      <TimePicker 
                        style={{ width: '100%' }} 
                        format="HH:mm:ss" 
                        placeholder="Pilih waktu mulai"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="end_time"
                      label="Waktu Selesai"
                      rules={[{ required: true, message: 'Waktu selesai wajib diisi' }]}
                    >
                      <TimePicker 
                        style={{ width: '100%' }} 
                        format="HH:mm:ss" 
                        placeholder="Pilih waktu selesai"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="skp_id"
                      label="SKP"
                      rules={[{ required: true, message: 'SKP wajib dipilih' }]}
                    >
                      <Select
                        placeholder="Pilih SKP"
                        options={skpOptions}
                        onChange={handleSkpChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="rhk_id"
                      label="RHK"
                      rules={[{ required: true, message: 'RHK wajib dipilih' }]}
                    >
                      <Select
                        placeholder="Pilih RHK"
                        options={rhkOptions}
                        disabled={!form.getFieldValue('skp_id')}
                        onChange={handleRhkChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="rencana_aksi_ids"
                      label="Rencana Aksi"
                      rules={[{ required: true, message: 'Rencana aksi wajib dipilih' }]}
                    >
                      <Select
                        placeholder="Pilih Rencana Aksi"
                        mode="multiple"
                        options={rencanaAksiOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="name"
                      label="Nama Kegiatan"
                      rules={[{ required: true, message: 'Nama kegiatan wajib diisi' }]}
                    >
                      <Input placeholder="Masukkan nama kegiatan" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="progress"
                      label="Progress (%)"
                      rules={[
                        { required: true, message: 'Progress wajib diisi' }
                      ]}
                    >
                      <Slider
                        min={0}
                        max={100}
                        marks={{
                          0: '0%',
                          25: '25%',
                          50: '50%',
                          75: '75%',
                          100: '100%'
                        }}
                        tooltip={{ formatter: value => `${value}%` }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="desc"
                      label="Deskripsi"
                      rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}
                    >
                      <Input.TextArea rows={4} placeholder="Masukkan deskripsi kegiatan" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Jenis Lampiran">
                      <Radio.Group 
                        value={uploadType} 
                        onChange={(e) => setUploadType(e.target.value)}
                        style={{ marginBottom: '16px' }}
                      >
                        <Radio value="files">File</Radio>
                        <Radio value="link">Tautan</Radio>
                      </Radio.Group>
                      
                      {uploadType === 'files' && (
                        <Form.Item
                          name="files"
                          noStyle
                        >
                          <Upload.Dragger
                            multiple
                            beforeUpload={() => false}
                            listType="picture"
                          >
                            <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Klik atau seret file ke area ini untuk mengunggah</p>
                          </Upload.Dragger>
                        </Form.Item>
                      )}
                      
                      {uploadType === 'link' && (
                        <Form.Item
                          name="tautan"
                          rules={[
                            { 
                              type: 'url', 
                              message: 'Format tautan tidak valid' 
                            }
                          ]}
                        >
                          <Input 
                            prefix={<LinkOutlined />} 
                            placeholder="Masukkan tautan" 
                          />
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitLoading}
                  >
                    Simpan
                  </Button>
                  <Button 
                    style={{ marginLeft: '8px' }}
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        )}

        {absence && (
          <Col xs={24}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="mb-4">Timeline Kegiatan Harian</h3>
              {(() => {
                // Menggunakan data harian dari dashboardData
                const harian = dashboardData?.harian || [];
                
                // Mengelompokkan harian berdasarkan RHK
                const rhkMap = new Map();
                
                // Mengumpulkan semua RHK unik dari data harian
                harian.forEach(item => {
                  if (item.rhk && item.rhk.id) {
                    if (!rhkMap.has(item.rhk.id)) {
                      rhkMap.set(item.rhk.id, {
                        id: item.rhk.id,
                        title: item.rhk.desc,
                        items: []
                      });
                    }
                    
                    // Menambahkan item harian ke RHK yang sesuai
                    rhkMap.get(item.rhk.id).items.push(item);
                  }
                });
                
                // Membuat groups untuk timeline berdasarkan RHK
                let groups = Array.from(rhkMap.values()).map((rhk, index) => ({
                  id: rhk.id,
                  title: rhk.title || `RHK ${index + 1}`
                }));
                
                // Jika tidak ada groups, buat group default
                if (groups.length === 0) {
                  groups = [{
                    id: 'default',
                    title: 'Kegiatan Harian'
                  }];
                }
                
                // Membuat items untuk timeline berdasarkan data harian
                let items = [];
                let minTime = null;
                let maxTime = null;
                
                harian.forEach(item => {
                  if (item.rhk && item.rhk.id && item.start_date_time && item.end_date_time) {
                    const startTime = moment(item.start_date_time);
                    const endTime = moment(item.end_date_time);
                    
                    // Menyimpan waktu minimum dan maksimum untuk rentang timeline
                    if (!minTime || startTime.isBefore(minTime)) {
                      minTime = startTime;
                    }
                    
                    if (!maxTime || endTime.isAfter(maxTime)) {
                      maxTime = endTime;
                    }
                    
                    items.push({
                      id: item.id,
                      group: item.rhk.id,
                      title: item.name,
                      start_time: startTime,
                      end_time: endTime,
                      itemProps: {
                        style: {
                          background: '#1890ff', // Menggunakan background sebagai pengganti backgroundColor
                          color: 'white',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }
                      }
                    });
                  }
                });
                
                // Jika tidak ada items, tampilkan timeline kosong dengan rentang waktu default
                if (items.length === 0) {
                  const now = moment();
                  const startOfDay = now.clone().startOf('day').add(8, 'hours'); // 8:00 AM
                  const endOfDay = now.clone().startOf('day').add(17, 'hours');  // 5:00 PM
                  
                  minTime = startOfDay;
                  maxTime = endOfDay;
                  
                  // Menambahkan pesan informasi sebagai item
                  items = [{
                    id: 'empty',
                    group: groups[0].id,
                    title: 'Belum ada data kegiatan harian',
                    start_time: startOfDay,
                    end_time: endOfDay,
                    itemProps: {
                      style: {
                        background: '#f5f5f5',
                        color: '#999',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: '1px dashed #d9d9d9'
                      }
                    }
                  }];
                }
                
                // Menentukan rentang waktu default untuk timeline
                const defaultStartTime = minTime ? minTime.toDate() : new Date();
                const defaultEndTime = maxTime ? maxTime.toDate() : new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
                
                return (
                  <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={defaultStartTime}
                    defaultTimeEnd={defaultEndTime}
                    canMove={false}
                    canResize={false}
                    lineHeight={50}
                    itemHeightRatio={0.8}
                    sidebarWidth={200}
                    stackItems={true}
                    itemTouchSendsClick={false}
                    minZoom={60 * 60 * 1000} // 1 jam minimum zoom
                    onItemClick={(itemId, e, time) => {
                      // Jangan tampilkan drawer untuk item kosong
                      if (itemId === 'empty') return;
                      
                      // Cari item yang diklik
                      const item = harian.find(h => h.id === itemId);
                      if (item) {
                        // Gunakan setTimeout untuk menghindari konflik dengan event handler lain
                        setTimeout(() => {
                          setDrawer({ data: item, open: true, placement: 'right' });
                        }, 0);
                      }
                    }}
                  />
                );
              })()}
            </div>
          </Col>
        )}
        
        {/* Drawer untuk detail kegiatan harian */}
        <Drawer 
          title="Detail Kegiatan Harian" 
          closable 
          onClose={() => setDrawer(prev => ({ ...prev, open: false }))} 
          open={drawer.open} 
          placement={drawer.placement} 
          width={900} 
          zIndex={900}
        >
          {drawer.data && drawer.data.id && (
            <>
              <Descriptions title="Detail Kegiatan" bordered column={2}>
                <Descriptions.Item label="Nama Kegiatan" span={2}>
                  <div className="flex items-center gap-x-2">
                    {drawer.data.name}
                    <Button 
                      icon={<EditOutlined />} 
                      type="text" 
                      onClick={() => {
                        // Set nilai awal form edit
                        editForm.setFieldsValue({
                          name: drawer.data.name,
                          desc: drawer.data.desc,
                          progress: drawer.data.progress,
                          date: moment(drawer.data.date),
                          start_time: moment(drawer.data.start_date_time, 'YYYY-MM-DD HH:mm:ss'),
                          end_time: moment(drawer.data.end_date_time, 'YYYY-MM-DD HH:mm:ss'),
                          skp_id: drawer.data.skp_id,
                          rhk_id: drawer.data.rhk_id,
                          rencana_aksi_ids: drawer.data.rencana_aksi_ids || []
                        });
                        
                        // Tampilkan form edit
                        setShowForm(true);
                      }} 
                    />
                    <Button 
                      icon={<DeleteOutlined />} 
                      type="text" 
                      danger 
                      loading={deleteLoading}
                      onClick={async () => {
                        if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
                          try {
                            setDeleteLoading(true);
                            const response = await HarianService.delete(drawer.data.id, token);
                            
                            if (response.status) {
                              message.success('Kegiatan harian berhasil dihapus');
                              setDrawer(prev => ({ ...prev, open: false }));
                              
                              // Refresh data dashboard
                              await fetchDashboardData(true);
                            } else {
                              message.error(response.message || 'Gagal menghapus kegiatan harian');
                            }
                          } catch (err) {
                            console.error('Error deleting activity:', err);
                            message.error('Terjadi kesalahan saat menghapus kegiatan harian');
                          } finally {
                            setDeleteLoading(false);
                          }
                        }
                      }} 
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal">{moment(drawer.data.date).format('YYYY-MM-DD')}</Descriptions.Item>
                <Descriptions.Item label="Progress">{drawer.data.progress}%</Descriptions.Item>
                <Descriptions.Item label="Waktu Mulai">{moment(drawer.data.start_date_time).format('HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="Waktu Selesai">{moment(drawer.data.end_date_time).format('HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="RHK" span={2}>{drawer.data.rhk?.desc || '-'}</Descriptions.Item>
                <Descriptions.Item label="Deskripsi" span={2}>{drawer.data.desc}</Descriptions.Item>
                <Descriptions.Item label="Rencana Aksi" span={2}>
                  {drawer.data.rencana_aksi?.map((ra, index) => (
                    <div key={ra.id}>
                      {index + 1}. {ra.desc}
                    </div>
                  )) || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Lampiran" span={2}>
                  {drawer.data.tautan ? (
                    <a href={drawer.data.tautan} target="_blank" rel="noopener noreferrer">
                      {drawer.data.tautan}
                    </a>
                  ) : drawer.data.files && drawer.data.files.length > 0 ? (
                    <div>
                      {drawer.data.files.map((file, index) => (
                        <div key={index}>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name || `File ${index + 1}`}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'Tidak ada lampiran'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Drawer>
      </Row>
    </div>
  );
};

export default Dashboard;
