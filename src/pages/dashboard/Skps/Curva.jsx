import { useAuth, useService } from '@/hooks';
import { SkpsService } from '@/services';
import { Line } from '@ant-design/charts';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

const Curva = () => {
  const { token } = useAuth();
  const { id } = useParams();

  const { execute: fetchSkpBawahan, ...getAllSkpBawahan } = useService(SkpsService.getByAtasan);

  const skpBawahan = getAllSkpBawahan.data ?? [];

  React.useEffect(() => {
    fetchSkpBawahan({ token, id });
  }, [fetchSkpBawahan, id, token]);

  const data = [
    { year: '2016', value: 30 },
    { year: '2017', value: 45 },
    { year: '2018', value: 55 },
    { year: '2019', value: 70 },
    { year: '2020', value: 90 },
    { year: '2021', value: 120 },
    { year: '2022', value: 160 }
  ];

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond'
    },
    tooltip: {
      showMarkers: true
    },
    interactions: [{ type: 'marker-active' }]
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit">
        <Skeleton loading={getAllSkpBawahan.isLoading}>
          <List
            itemLayout="horizontal"
            dataSource={skpBawahan ?? []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={<button>{item.posjab?.[0]?.nama_asn ?? '-'}</button>} description={item.posjab?.[0]?.nip_asn ?? '-'} />
              </List.Item>
            )}
          />
        </Skeleton>
      </Card>
      <Card className="col-span-8">
        <div style={{ width: '100%', height: 400 }}>
          <Line {...config} />
        </div>
      </Card>
    </div>
  );
};

export default Curva;
