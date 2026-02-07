import { dummyHarian } from '@/data/dummyData';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Card, DatePicker, Descriptions, Form, Input } from 'antd';

const Harians = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit" title="Data Harian">
        <Form layout="vertical" className="flex flex-col gap-y-3">
          <Form.Item label="Tanggal" className="m-0">
            <DatePicker size="large" className="w-full" />
          </Form.Item>
          <Form.Item label="Tanggal" className="m-0">
            <Input size="large" className="w-full" placeholder="Settings 1" />
          </Form.Item>
          <Form.Item>
            <Button size="large" variant="solid" color="primary">
              Kirim
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card className="col-span-8" title="Kegiatan Harian pada 2024 ">
        <div className="flex flex-col gap-y-2 divide-y">
          {dummyHarian.map((item) => (
            <Descriptions
              key={item.id}
              bordered
              column={1}
              size="small"
              title={
                <div className="inline-flex items-center gap-x-2">
                  <CheckCircleFilled className="text-green-500" />
                  {item.judul_kegiatan}
                </div>
              }
              className="py-4"
            >
              <Descriptions.Item label="Tanggal">{item.tanggal}</Descriptions.Item>
              <Descriptions.Item label="Deskripsi Kegiatan">{item.detail_kegiatan}</Descriptions.Item>
              <Descriptions.Item label="Indikator">
                <div className="flex flex-col gap-y-2">
                  {item.indikator.map((indikator, index) => (
                    <div key={index} className="inline-flex items-center gap-x-2 text-xs">
                      <CheckCircleFilled className="text-green-500" />
                      {indikator}
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Status">{item.status}</Descriptions.Item>
            </Descriptions>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Harians;
