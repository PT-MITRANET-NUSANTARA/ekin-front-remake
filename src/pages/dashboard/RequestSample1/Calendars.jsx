import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { CalendarsService, WebSettingsService } from '@/services';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Button, Calendar, Card, Descriptions, Form, Input, Select, Space, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { CalendarFormFields } from './FormFields';

const Caledars = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllWebSettings } = useService(WebSettingsService.getAll);
  const { execute: fetchCalendars, ...getAllCalendars } = useService(CalendarsService.getAll);

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const storeCalendar = useService(CalendarsService.store);
  const updateCalendar = useService(CalendarsService.update);
  const deleteCalendar = useService(CalendarsService.delete);

  const fetchWebSettings = React.useCallback(() => {
    execute({
      token: token
    });
  }, [execute, token]);

  React.useEffect(() => {
    fetchWebSettings();
    fetchCalendars({ token: token });
  }, [fetchCalendars, fetchWebSettings, token]);

  const websettings = React.useMemo(() => getAllWebSettings.data ?? {}, [getAllWebSettings.data]);
  const calendars = React.useMemo(() => getAllCalendars.data ?? [], [getAllCalendars.data]);

  const calendarMap = React.useMemo(() => {
    const map = new Map();
    calendars.forEach((item) => {
      map.set(item.date, item);
    });
    return map;
  }, [calendars]);

  const selectedCalendar = React.useMemo(() => {
    const key = selectedDate.format('YYYY-MM-DD');
    return calendarMap.get(key);
  }, [calendarMap, selectedDate]);

  const WORKDAY_MAP = React.useMemo(
    () => ({
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6
    }),
    []
  );

  const workDayNumbers = React.useMemo(() => {
    if (!websettings?.default_work_days) return [];
    return websettings.default_work_days.map((day) => WORKDAY_MAP[day]);
  }, [WORKDAY_MAP, websettings.default_work_days]);

  const mergeDateAndTime = (date, time) => {
    if (!date || !time) return null;

    return dayjs(date).hour(time.hour()).minute(time.minute()).second(0).format('YYYY-MM-DDTHH:mm:ss');
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      unit_id: user.unor.id,
      date: selectedDate.format('YYYY-MM-DD'),

      is_holiday: values.is_holiday,
      holiday_name: values.holiday_name ?? '',

      harian_time_start: mergeDateAndTime(selectedDate, values.harian_time_start),
      harian_time_end: mergeDateAndTime(selectedDate, values.harian_time_end),

      break_time_start: mergeDateAndTime(selectedDate, values.break_time_start),
      break_time_end: mergeDateAndTime(selectedDate, values.break_time_end),

      total_minutes: Number(values.total_minutes)
    };

    const { isSuccess, message } = await storeCalendar.execute(payload, token);

    if (isSuccess) {
      success('Berhasil', message);
      fetchCalendars({ token: token });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const mapCalendarToForm = (calendar) => ({
    is_holiday: calendar.is_holiday,
    holiday_name: calendar.holiday_name,
    harian_time_start: dayjs(calendar.harian_time_start),
    harian_time_end: dayjs(calendar.harian_time_end),
    break_time_start: dayjs(calendar.break_time_start),
    break_time_end: dayjs(calendar.break_time_end),
    total_minutes: calendar.total_minutes
  });

  const handleUpdatePenanda = async () => {
    modal.edit({
      title: `Ubah Data Penanda`,
      formFields: CalendarFormFields(),
      data: mapCalendarToForm(selectedCalendar),
      onSubmit: async (values) => {
        const payload = {
          is_holiday: values.is_holiday,
          holiday_name: values.holiday_name ?? '',

          harian_time_start: mergeDateAndTime(selectedDate, values.harian_time_start),
          harian_time_end: mergeDateAndTime(selectedDate, values.harian_time_end),

          break_time_start: mergeDateAndTime(selectedDate, values.break_time_start),
          break_time_end: mergeDateAndTime(selectedDate, values.break_time_end),

          total_minutes: Number(values.total_minutes)
        };

        const { isSuccess, message } = await updateCalendar.execute(selectedCalendar.id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchCalendars({ token });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const handleDeletePenanda = async () => {
    modal.delete.default({
      title: `Delete Penanda`,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteCalendar.execute(selectedCalendar.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchCalendars({ token: token });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <Calendar
          onSelect={(date) => {
            setSelectedDate(date);
          }}
          dateCellRender={(value) => {
            const dateKey = value.format('YYYY-MM-DD');
            const calendarItem = calendarMap.get(dateKey);

            const dayNumber = value.day();
            const isWorkDay = workDayNumbers.includes(dayNumber);

            return (
              <div className="relative h-full w-full">
                <div className="absolute bottom-2 left-1 flex flex-col gap-y-1">
                  {!calendarItem && (isWorkDay ? <Badge color="green" text={<span className="text-xs">Onsite</span>} /> : <Badge color="red" text={<span className="text-xs">Libur</span>} />)}

                  {calendarItem && <Badge color={calendarItem.is_holiday ? 'red' : 'blue'} text={<span className="text-xs">{calendarItem.holiday_name}</span>} />}
                </div>
              </div>
            );
          }}
        />
      </Card>
      <Card title={selectedDate.format('YYYY-MM-DD')} className="col-span-4 h-fit">
        {!selectedCalendar && (
          <Form onFinish={handleFormSubmit} layout="vertical" className="flex flex-col gap-y-3">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Tipe Penanda harus diisi`
                }
              ]}
              label="Pilih Penanda"
              className="m-0"
              name="is_holiday"
            >
              <Select size="large" placeholder="Pilih Penanda">
                <Select.Option value={true}>Hari Libur</Select.Option>
                <Select.Option value={false}>Hari Kerja</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Nama Penanda harus diisi`
                }
              ]}
              label="Nama Penanda"
              className="m-0"
              name="holiday_name"
            >
              <Input size="large" placeholder="Masukan Nama Penanda" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Waktu Mulai harus diisi`
                }
              ]}
              label="Waktu Mulai"
              className="m-0"
              name="harian_time_start"
            >
              <TimePicker size="large" className="w-full" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Waktu Berakhir harus diisi`
                }
              ]}
              label="Waktu Berakhir"
              className="m-0"
              name="harian_time_end"
            >
              <TimePicker size="large" className="w-full" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Waktu Istrahat harus diisi`
                }
              ]}
              label="Waktu Istirahat"
              className="m-0"
              name="break_time_start"
            >
              <TimePicker size="large" className="w-full" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Wakhir Akhir Istrahat harus diisi`
                }
              ]}
              label="Waktu Akhir Istirahat"
              className="m-0"
              name="break_time_end"
            >
              <TimePicker size="large" className="w-full" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Total Menit harus diisi`
                }
              ]}
              label="Total Menit"
              className="m-0"
              name="total_minutes"
            >
              <Input type="number" size="large" placeholder="Masukan Total Menit" />
            </Form.Item>

            <Form.Item>
              <Button size="large" htmlType="submit" variant="solid" color="primary">
                Kirim
              </Button>
            </Form.Item>
          </Form>
        )}

        {selectedCalendar && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Jenis Hari">{selectedCalendar.is_holiday ? 'Hari Libur' : 'Hari Kerja'}</Descriptions.Item>

            <Descriptions.Item label="Nama Penanda">{selectedCalendar.holiday_name || '-'}</Descriptions.Item>

            <Descriptions.Item label="Waktu Mulai">{dayjs(selectedCalendar.harian_time_start).format('HH:mm')}</Descriptions.Item>

            <Descriptions.Item label="Waktu Berakhir">{dayjs(selectedCalendar.harian_time_end).format('HH:mm')}</Descriptions.Item>

            <Descriptions.Item label="Istirahat Mulai">{dayjs(selectedCalendar.break_time_start).format('HH:mm')}</Descriptions.Item>

            <Descriptions.Item label="Istirahat Berakhir">{dayjs(selectedCalendar.break_time_end).format('HH:mm')}</Descriptions.Item>

            <Descriptions.Item label="Total Menit">{selectedCalendar.total_minutes} menit</Descriptions.Item>
            <Descriptions.Item label="Aksi">
              <Space>
                <Button icon={<EditOutlined />} variant="outlined" color="primary" onClick={() => handleUpdatePenanda()} />
                <Button icon={<DeleteOutlined />} variant="outlined" color="danger" onClick={() => handleDeletePenanda()} />
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
};

export default Caledars;
