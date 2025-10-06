import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, InfoOutlined, SendOutlined } from '@ant-design/icons';
import { Badge, Button, Popconfirm, Tag } from 'antd';

/* eslint-disable react-refresh/only-export-components */
export const RhkColumn = ({ updateAspek, user, detailSkp } = {}) => [
  {
    title: 'RHK',
    dataIndex: 'rhkDesc',
    render: (value, row) => ({
      children: (
        <div className="flex flex-col gap-y-2">
          <span>{value}</span>

          {row.klasifikasi && (
            <Tag color="blue" className="w-fit">
              {row.klasifikasi}
            </Tag>
          )}

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
    render: (_, record) => {
      const canEdit = updateAspek && user?.isJpt && user?.newNip === detailSkp?.user_id;

      return (
        <div className="flex items-center gap-2">
          <span>{record.aspekDesc}</span>
          {canEdit && <Button icon={<EditOutlined />} type="link" onClick={() => updateAspek(record)} />}
        </div>
      );
    }
  },
  {
    title: 'Jenis Aspek',
    dataIndex: 'aspekJenis'
  },
  {
    title: 'Target Tahunan',
    dataIndex: 'indikator_name',
    render: (_, record) => (
      <span>
        {record.indikator_name} {record.indikator_target} {record.indikator_satuan}
      </span>
    )
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

export const lampiranColumn = (deleteLampiran, type) => {
  const baseColumns = [
    {
      title: 'Nama Lampiran',
      dataIndex: 'name'
    }
  ];

  if (deleteLampiran) {
    baseColumns.push({
      title: 'Aksi',
      dataIndex: 'rhkId',
      render: (_, __, index) => (
        <Button className="w-fit" icon={<DeleteOutlined />} variant="solid" color="danger" onClick={() => deleteLampiran(type, index)}>
          Hapus
        </Button>
      )
    });
  }

  return baseColumns;
};

export const skpBawahanColumns = (props) => {
  const { deleteSkpBawahan, navigate, ajukanSkp, navItems } = props ?? {};

  const baseColumns = [
    {
      title: 'Nama ASN',
      dataIndex: 'posjab',
      render: (_, record) => record.posjab?.[0]?.nama_asn ?? '-'
    },
    {
      title: 'NIP',
      dataIndex: 'posjab',
      render: (_, record) => record.posjab?.[0]?.nip_asn ?? '-'
    },
    {
      title: 'Pendekatan',
      dataIndex: 'pendekatan',
      sorter: (a, b) => a.pendekatan.length - b.pendekatan.length
    },
    {
      title: 'Status SKP',
      dataIndex: 'status',
      render: (status) => {
        switch (status) {
          case 'DRAFT':
            return <Badge status="processing" text="Draft" />;
          case 'SUBMITTED':
            return <Badge status="warning" text="Submitted" />;
          case 'REJECTED':
            return <Badge status="error" text="Rejected" />;
          case 'APPROVED':
            return <Badge status="success" text="Approved" />;
          default:
            return <Badge status="default" text={status} />;
        }
      }
    }
  ];

  const aksiColumn = {
    title: 'Aksi',
    width: '30%',
    render: (_, record) => (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {navigate &&
          navItems?.map((nav, idx) => (
            <Button key={idx} variant="solid" color={nav.color ?? 'primary'} icon={nav.icon ?? <InfoOutlined />} onClick={() => navigate(nav.path(record))}>
              {nav.label}
            </Button>
          ))}

        {deleteSkpBawahan && (
          <Button variant="solid" color="danger" icon={<DeleteOutlined />} onClick={() => deleteSkpBawahan(record)}>
            Hapus
          </Button>
        )}

        {ajukanSkp && (
          <Popconfirm title="Apakah anda yakin ingin mengajukan SKP?" onConfirm={() => ajukanSkp(record)}>
            <Button variant="solid" color="primary" icon={<SendOutlined />} disabled={record.status !== 'DRAFT'}>
              Ajukan
            </Button>
          </Popconfirm>
        )}
      </div>
    )
  };

  if (deleteSkpBawahan || navigate || ajukanSkp) {
    baseColumns.push(aksiColumn);
  }

  return baseColumns;
};

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
