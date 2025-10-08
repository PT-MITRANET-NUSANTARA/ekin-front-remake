/* eslint-disable react/prop-types */
import { Card, Avatar, Typography, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <Card
      className="rounded-lg shadow-md"
      hoverable
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Profil Pegawai</span>
        </div>
      }
      headStyle={{ fontWeight: 600 }}
    >
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <Avatar size={96} icon={<UserOutlined />} src={profile.foto ? profile.foto.trim() : null} className="border-2 border-blue-500" />
        <div className="flex flex-col">
          <Title level={4} className="m-0 text-center md:text-left">
            {profile.nama}
          </Title>
          <Text type="secondary" className="text-center md:text-left">
            {profile.nipBaru}
          </Text>
          <Text className="text-center md:text-left">{profile.status_asn}</Text>

          <Descriptions layout="vertical" className="mt-4" column={{ xs: 1, sm: 2, md: 3 }} size="small">
            <Descriptions.Item label="Unit Kerja">{profile.unor?.nama || '-'}</Descriptions.Item>
            <Descriptions.Item label="Jabatan">{profile.posjab?.nama_jabatan || '-'}</Descriptions.Item>
            <Descriptions.Item label="Eselon">{profile.posjab?.eselon?.nama || '-'}</Descriptions.Item>
            <Descriptions.Item label="Golongan">{profile.posjab?.golongan_pns?.nama || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
