import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, InfoOutlined, SendOutlined } from '@ant-design/icons';
import { Badge, Button, Popconfirm, Tag } from 'antd';

/* eslint-disable react-refresh/only-export-components */
export const RhkColumn = (udpateAspek, deletAspek, user, detailSkp) => [
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
          {row.penugasan && (
            <Tag color="geekblue" className="w-fit">
              {row.penugasan}
            </Tag>
          )}
        </div>
      ),
      props: { rowSpan: row.rhkRowSpan }
    })
  },
  {
    title: 'Aspek',
    dataIndex: 'aspekDesc',
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <span>{record.aspekDesc}</span>
        {user?.isJpt && user?.newNip === detailSkp.user_id && <Button icon={<EditOutlined />} variant="link" color="primary" onClick={() => udpateAspek(record)} />}
      </div>
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
    render: (_, row) => {
      const children =
        user?.isJpt && user?.newNip === detailSkp.user_id ? (
          <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => deletAspek(row)}>
            Hapus
          </Button>
        ) : null;

      return {
        children,
        props: { rowSpan: row.rhkRowSpan }
      };
    }
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

export const lampiranColumn = (deleteLampiran, type) => [
  {
    title: 'Nama Lampiran',
    dataIndex: 'name'
  },
  {
    title: 'Aksi',
    dataIndex: 'rhkId',
    render: (_, __, index) => ({
      children: (
        <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => deleteLampiran(type, index)}>
          Hapus
        </Button>
      )
    })
  }
];

export const skpBawahanColumns = (deleteSkpBawahan, navigateToDetail, ajukanSkp) => [
  {
    title: 'Nama ASN',
    dataIndex: 'posjab',
    searchable: true,
    render: (_, record) => record.posjab?.[0]?.nama_asn ?? '-'
  },
  {
    title: 'Nama ASN',
    dataIndex: 'posjab',
    searchable: true,
    render: (_, record) => record.posjab?.[0]?.nip_asn ?? '-'
  },
  {
    title: 'Pendekatan',
    dataIndex: 'pendekatan',
    sorter: (a, b) => a.pendekatan.length - b.pendekatan.length,
    searchable: true
  },
  {
    title: 'Status SKP',
    dataIndex: 'status',
    sorter: (a, b) => a.status.length - b.status.length,
    searchable: true,
    render: (record) => {
      switch (record) {
        case 'DRAFT':
          return <Badge status="processing" text="Draft" />;
        case 'SUBMITTED':
          return <Badge status="warning" text="Submitted" />;
        case 'REJECTED':
          return <Badge status="error" text="Rejected" />;
        case 'APPROVED':
          return <Badge status="success" text="Approved" />;
        default:
          return <Badge status="default" text={record.status} />;
      }
    }
  },
  {
    title: 'Aksi',
    render: (_, record) => ({
      children: (
        <div className="inline-flex items-center gap-x-2">
          <Button className="w-fit" variant="solid" color="primary" icon={<InfoOutlined />} onClick={() => navigateToDetail(record)}>
            Detail
          </Button>
          <Button className="w-fit" variant="solid" color="danger" icon={<DeleteOutlined />} onClick={() => deleteSkpBawahan(record)}>
            Hapus
          </Button>
          <Popconfirm title="Apakah anda yakin ingin mengajukan SKP?" onConfirm={() => ajukanSkp(record)}>
            <Button className="w-fit" variant="solid" color="primary" icon={<SendOutlined />} disabled={record.status !== 'DRAFT'}>
              Ajukan
            </Button>
          </Popconfirm>
        </div>
      )
    })
  }
];

export const subOrdinateColumn = (storeSkpBawahan, skpBawahan) => [
  {
    title: 'Nama ASN',
    dataIndex: 'nama_asn',
    sorter: (a, b) => a.nama_asn.length - b.nama_asn.length,
    searchable: true
  },
  {
    title: 'NIP',
    dataIndex: 'nip_asn',
    sorter: (a, b) => a.nip_asn.length - b.nip_asn.length,
    searchable: true
  },
  {
    title: 'Status Assign SKP',
    dataIndex: 'nip_asn',
    sorter: (a, b) => a.nip_asn.length - b.nip_asn.length,
    searchable: true,
    render: (nip_asn) => {
      const sudahAda = skpBawahan.some((skp) => skp.user_id === nip_asn);
      return sudahAda ? (
        <div className="inline-flex items-center gap-x-2">
          <CheckCircleFilled className="text-green-500" />
          SKP Telah di Assign
        </div>
      ) : (
        <div className="inline-flex items-center gap-x-2">
          <CloseCircleFilled className="text-red-500" />
          SKP Belum di Assign
        </div>
      );
    }
  },
  {
    title: 'Aksi',
    render: (_, record) => ({
      children: (
        <Button className="w-fit" variant="solid" color="primary" onClick={() => storeSkpBawahan(record)} disabled={skpBawahan.some((skp) => skp.user_id === record.nip_asn)}>
          Buat SKP
        </Button>
      )
    })
  }
];
