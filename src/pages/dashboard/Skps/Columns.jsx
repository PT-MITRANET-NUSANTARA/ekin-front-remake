import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';

/* eslint-disable react-refresh/only-export-components */
export const RhkColumn = (udpateAspek, deletAspek, isJpt) => [
  {
    title: 'RHK',
    dataIndex: 'rhkDesc',
    render: (value, row) => ({
      children: (
        <div className="flex flex-col gap-y-2">
          <span>{value}</span>
          <Tag color="blue" className="w-fit">
            {row.klasifikasi}
          </Tag>
          <Tag color="geekblue" className="w-fit">
            {row.penugasan}
          </Tag>
        </div>
      ),
      props: { rowSpan: row.rhkRowSpan }
    })
  },
  {
    title: 'Aspek',
    dataIndex: 'aspekDesc',
    render: (_, record) => (
      <>
        {record.aspekDesc}
        {isJpt && <Button icon={<EditOutlined />} variant="link" color="primary" onClick={() => udpateAspek(record)} />}
      </>
    )
  },
  {
    title: 'Jenis Aspek',
    dataIndex: 'aspekJenis'
  },
  {
    title: 'Target Tahunan',
    dataIndex: 'indikator_name',
    render: (_, record) => (
      <>
        {record.indikator_name} {record.indikator_target} {record.indikator_satuan}
      </>
    )
  },
  {
    title: 'Aksi',
    dataIndex: 'rhkId',
    render: (_, row) => ({
      children: (
        <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => deletAspek(row)}>
          Hapus
        </Button>
      ),
      props: { rowSpan: row.rhkRowSpan }
    })
  }
];

export const perilakuColumns = () => [
  {
    title: 'Perilaku Kinerja',
    dataIndex: 'name',
    render: (_, record) => (
      <div>
        <b className="text-[#5e9ea0]">{record.name}</b>
        <ol style={{ listStyle: 'inside' }}>
          {record.content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    )
  },
  {
    title: 'Ekspektasi Pimpinan',
    dataIndex: 'ekspektasi',
    render: (record) => record
  }
];
