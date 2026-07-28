import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { CalendarsService, UnitKerjaService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Calendar, Card, Descriptions, Select, Skeleton, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { HolidayFormFields, KalenderFormFields } from './FormFields';

const Caledars = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();

  const { execute: fetchAllUnits, ...getAllUnits } = useService(UnitKerjaService.getAll);
  const { execute: fetchByUnitId, ...getCalendarByUnit } = useService(CalendarsService.getByUnitId);
  const storeCalendar = useService(CalendarsService.store);
  const updateCalendar = useService(CalendarsService.update);
  const deleteCalendar = useService(CalendarsService.delete);
  const storeHoliday = useService(CalendarsService.storeHoliday);
  const deleteHoliday = useService(CalendarsService.deleteHoliday);

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [selectedUnit, setSelectedUnit] = React.useState(null);

  const units = React.useMemo(() => getAllUnits.data ?? [], [getAllUnits.data]);
  const items = React.useMemo(() => getCalendarByUnit.data?.items ?? [], [getCalendarByUnit.data]);

  React.useEffect(() => {
    fetchAllUnits({ token });
  }, [fetchAllUnits, token]);

  React.useEffect(() => {
    if (!selectedUnit) return;
    fetchByUnitId(token, selectedUnit);
  }, [selectedUnit, fetchByUnitId, token]);

  const calendarMap = React.useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      map.set(dayjs(item.date).format('YYYY-MM-DD'), item);
    });
    return map;
  }, [items]);

  const selectedCalendar = React.useMemo(() => {
    return calendarMap.get(selectedDate.format('YYYY-MM-DD'));
  }, [calendarMap, selectedDate]);

  const refresh = () => fetchByUnitId(token, selectedUnit);

  const handleAddKalender = () => {
    modal.create({
      title: `Tambah Kalender - ${selectedDate.format('DD MMMM YYYY')}`,
      formFields: KalenderFormFields(),
      onSubmit: async (values) => {
        const payload = {
          date: selectedDate.format('YYYY-MM-DD'),
          unitId: String(selectedUnit),
          dayTimeStart: values.dayTimeStart?.format('HH:mm'),
          dayTimeEnd: values.dayTimeEnd?.format('HH:mm'),
          breakTimeStart: values.breakTimeStart?.format('HH:mm'),
          breakTimeEnd: values.breakTimeEnd?.format('HH:mm'),
          totalMinuteWork: Number(values.totalMinuteWork),
          note: values.note ?? ''
        };
        const { isSuccess, message } = await storeCalendar.execute(payload, token);
        if (isSuccess) { success('Berhasil', message); refresh(); }
        else error('Gagal', message);
        return isSuccess;
      }
    });
  };

  const handleEditKalender = () => {
    const cal = selectedCalendar;
    modal.edit({
      title: `Ubah Kalender - ${selectedDate.format('DD MMMM YYYY')}`,
      formFields: KalenderFormFields(),
      data: {
        dayTimeStart: dayjs(cal.dayTimeStart, 'HH:mm'),
        dayTimeEnd: dayjs(cal.dayTimeEnd, 'HH:mm'),
        breakTimeStart: dayjs(cal.breakTimeStart, 'HH:mm'),
        breakTimeEnd: dayjs(cal.breakTimeEnd, 'HH:mm'),
        totalMinuteWork: cal.totalMinuteWork,
        note: cal.note
      },
      onSubmit: async (values) => {
        const payload = {
          dayTimeStart: values.dayTimeStart?.format('HH:mm'),
          dayTimeEnd: values.dayTimeEnd?.format('HH:mm'),
          breakTimeStart: values.breakTimeStart?.format('HH:mm'),
          breakTimeEnd: values.breakTimeEnd?.format('HH:mm'),
          totalMinuteWork: Number(values.totalMinuteWork),
          note: values.note ?? ''
        };
        const { isSuccess, message } = await updateCalendar.execute(cal.id, payload, token);
        if (isSuccess) { success('Berhasil', message); refresh(); }
        else error('Gagal', message);
        return isSuccess;
      }
    });
  };

  const handleDeleteKalender = () => {
    modal.delete.default({
      title: 'Hapus Kalender',
      onSubmit: async () => {
        const { isSuccess, message } = await deleteCalendar.execute(selectedCalendar.id, token);
        if (isSuccess) { success('Berhasil', message); refresh(); }
        else error('Gagal', message);
        return isSuccess;
      }
    });
  };

  const handleAddHoliday = () => {
    modal.create({
      title: `Tambah Hari Libur - ${selectedDate.format('DD MMMM YYYY')}`,
      formFields: HolidayFormFields(),
      onSubmit: async (values) => {
        const payload = {
          date: selectedDate.format('YYYY-MM-DD'),
          unitId: String(selectedUnit),
          name: values.name,
          note: values.note ?? ''
        };
        const { isSuccess, message } = await storeHoliday.execute(payload, token);
        if (isSuccess) { success('Berhasil', message); refresh(); }
        else error('Gagal', message);
        return isSuccess;
      }
    });
  };

  const handleDeleteHoliday = () => {
    modal.delete.default({
      title: 'Hapus Hari Libur',
      onSubmit: async () => {
        const { isSuccess, message } = await deleteHoliday.execute(selectedCalendar.id, token);
        if (isSuccess) { success('Berhasil', message); refresh(); }
        else error('Gagal', message);
        return isSuccess;
      }
    });
  };

  const renderDetail = () => {
    if (!selectedCalendar) {
      return (
        <Space direction="vertical" className="w-full">
          <Button block icon={<PlusOutlined />} variant="outlined" color="primary" onClick={handleAddKalender}>
            Tambah Kalender
          </Button>
          <Button block icon={<PlusOutlined />} variant="outlined" color="danger" onClick={handleAddHoliday}>
            Tambah Hari Libur
          </Button>
        </Space>
      );
    }

    if (selectedCalendar.type === 'holiday') {
      return (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Jenis">Hari Libur</Descriptions.Item>
          <Descriptions.Item label="Nama">{selectedCalendar.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Catatan">{selectedCalendar.note || '-'}</Descriptions.Item>
          <Descriptions.Item label="Aksi">
            <Button icon={<DeleteOutlined />} variant="outlined" color="danger" onClick={handleDeleteHoliday}>
              Hapus
            </Button>
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return (
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Jenis">Hari Kerja</Descriptions.Item>
        <Descriptions.Item label="Waktu Mulai">{selectedCalendar.dayTimeStart}</Descriptions.Item>
        <Descriptions.Item label="Waktu Berakhir">{selectedCalendar.dayTimeEnd}</Descriptions.Item>
        <Descriptions.Item label="Istirahat Mulai">{selectedCalendar.breakTimeStart}</Descriptions.Item>
        <Descriptions.Item label="Istirahat Berakhir">{selectedCalendar.breakTimeEnd}</Descriptions.Item>
        <Descriptions.Item label="Total Menit">{selectedCalendar.totalMinuteWork} menit</Descriptions.Item>
        <Descriptions.Item label="Catatan">{selectedCalendar.note || '-'}</Descriptions.Item>
        <Descriptions.Item label="Aksi">
          <Space>
            <Button icon={<EditOutlined />} variant="outlined" color="primary" onClick={handleEditKalender} />
            <Button icon={<DeleteOutlined />} variant="outlined" color="danger" onClick={handleDeleteKalender} />
          </Space>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Skeleton loading={getAllUnits.isLoading}>
          <Select
            placeholder="Pilih Unit Kerja"
            className="w-full"
            value={selectedUnit}
            onChange={(value) => setSelectedUnit(value)}
            options={units.map((item) => ({
              label: item.nama_unor || item.name,
              value: item.id_simpeg || item.id
            }))}
          />
        </Skeleton>
      </Card>

      {selectedUnit && (
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-8">
            <Skeleton loading={getCalendarByUnit.isLoading}>
              <Calendar
                onSelect={(date) => setSelectedDate(date)}
                cellRender={(value, info) => {
                  if (info.type !== 'date') return info.originNode;
                  const calendarItem = calendarMap.get(value.format('YYYY-MM-DD'));
                  if (!calendarItem) return info.originNode;
                  return (
                    <div>
                      <div className="ant-picker-cell-inner">{value.date()}</div>
                      <Badge
                        color={calendarItem.type === 'holiday' ? 'red' : 'blue'}
                        text={<span className="text-xs">{calendarItem.name || 'Kerja'}</span>}
                      />
                    </div>
                  );
                }}
              />
            </Skeleton>
          </Card>

          <Card title={selectedDate.format('DD MMMM YYYY')} className="col-span-4 h-fit">
            {renderDetail()}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Caledars;
