/* eslint-disable react/prop-types */
import { Card, Typography, Tag, Empty } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const getStatusColor = (status) => {
  const statusMap = {
    HADIR: 'success',
    IZIN: 'warning',
    SAKIT: 'error',
    CUTI: 'processing',
    'DINAS LUAR': 'blue'
  };

  return statusMap[status] || 'default';
};

const AbsenceCard = ({ absence }) => {
  return (
    <Card
      className="rounded-lg shadow-md"
      hoverable
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>Absensi Hari Ini</span>
        </div>
      }
      headStyle={{ fontWeight: 600 }}
    >
      {absence ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text>
                {new Date(absence.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </div>
            <Tag color={getStatusColor(absence.status)}>{absence.status}</Tag>
          </div>

          {absence.in && (
            <div className="mt-1 flex items-center gap-2">
              <ClockCircleOutlined />
              <Text>Masuk: {new Date(absence.in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Text>
            </div>
          )}

          {absence.desc && (
            <div className="mt-2">
              <Text type="secondary">Keterangan: {absence.desc}</Text>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <ClockCircleOutlined />
            <Text type="secondary">Terakhir diperbarui: {new Date(absence.updated_at).toLocaleString('id-ID')}</Text>
          </div>
        </div>
      ) : (
        <Empty description="Belum ada absensi hari ini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default AbsenceCard;
