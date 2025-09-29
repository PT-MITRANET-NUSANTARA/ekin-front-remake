export const RhkColumn = () => [
  {
    title: 'RHK',
    dataIndex: 'rhkDesc',
    render: (value, row) => ({
      children: value,
      props: { rowSpan: row.rhkRowSpan }
    })
  },
  {
    title: 'Klasifikasi',
    dataIndex: 'klasifikasi',
    render: (value, row) => ({
      children: value,
      props: { rowSpan: row.rhkRowSpan }
    })
  },
  {
    title: 'Penugasan',
    dataIndex: 'penugasan',
    render: (value, row) => ({
      children: value,
      props: { rowSpan: row.rhkRowSpan }
    })
  },
  {
    title: 'Aspek',
    dataIndex: 'aspekDesc'
  },
  {
    title: 'Jenis Aspek',
    dataIndex: 'aspekJenis'
  }
];
