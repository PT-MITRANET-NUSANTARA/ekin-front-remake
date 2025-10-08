/* eslint-disable react/prop-types */
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, FileOutlined, DashboardOutlined } from '@ant-design/icons';

const DashboardSummary = ({ profile }) => {
  return (
    <Card
      className="rounded-lg shadow-md"
      hoverable
      title={
        <div className="flex items-center gap-2">
          <DashboardOutlined />
          <span>Ringkasan</span>
        </div>
      }
      headStyle={{ fontWeight: 600 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Statistic title="Status" value={profile?.status_asn || '-'} prefix={<UserOutlined />} valueStyle={{ fontWeight: 600 }} />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Unit Kerja"
            value={profile?.unor?.nama ? (profile.unor.nama.split(' ').length > 2 ? profile.unor.nama.split(' ').slice(0, 2).join(' ') + '...' : profile.unor.nama) : '-'}
            prefix={<TeamOutlined />}
            valueStyle={{ fontWeight: 600 }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic title="Jabatan" value={profile?.posjab?.jenis_jabatan?.nama || '-'} prefix={<FileOutlined />} valueStyle={{ fontWeight: 600 }} />
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardSummary;
