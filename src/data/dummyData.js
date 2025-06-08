export const dummySektor = Array.from({ length: 10 }, (_, index) => ({
  _id: (index + 1).toString(),
  name: index === 1 ? 'filter' : 'dummy'
}));

export const dummyResidentStatistic = {
  code: 200,
  status: true,
  message: 'Data statistik penduduk',
  data: {
    penduduk: {
      jumlah_penduduk: 100,
      jumlah_kepala_keluarga: 20,
      jumlah_perempuan: 42,
      jumlah_laki_laki: 58
    },
    umur: [
      {
        kategori_umur: 'Remaja',
        jumlah: 10
      },
      {
        kategori_umur: 'Anak Anak',
        jumlah: 10
      }
    ],
    pendidikan: [
      {
        pendidikan_sedang_ditempuh: 'S1',
        jumlah: 29
      }
    ],
    pekerjaan: [
      {
        pekerjaan: 'Wirausaha',
        jumlah: 100
      }
    ],
    agama: [
      {
        agama: 'Hindu',
        jumlah: 25
      }
    ],
    status_perkawinan: [
      {
        status_perkawinan: 'telah menikah',
        jumlah: 40
      }
    ],
    dusun: [
      {
        nama_dusun: 'Semanggi',
        jumlah: 29
      }
    ]
  }
};

export const dummyApbdStatistic = {
  code: 200,
  status: true,
  message: 'Data statistik apbd',
  data: {
    perTahun: {
      belanja: 50000000,
      pendapatan: 990000000,
      defisit: 940000000,
      pengeluaran: 30000000,
      pembiayaan: 30000000,
      sisa_pembiayaan: 0
    },
    semua: [
      {
        id: 1,
        nama_laporan: 'Laporan APBD Tahun 2023',
        tahun: '2023',
        belanja_pendapatan: {
          belanja: 45000000,
          pendapatan: 120000000
        },
        pembiayaan: {
          pembiayaan: 25000000,
          pengeluaran: 20000000
        }
      },
      {
        id: 2,
        nama_laporan: 'Laporan APBD Tahun 2024',
        tahun: '2024',
        belanja_pendapatan: {
          belanja: 52000000,
          pendapatan: 85000000
        },
        pembiayaan: {
          pembiayaan: 28000000,
          pengeluaran: 25000000
        }
      },
      {
        id: 3,
        nama_laporan: 'Laporan APBD Tahun 2025',
        tahun: '2025',
        belanja_pendapatan: {
          belanja: 50000000,
          pendapatan: 90000000
        },
        pembiayaan: {
          pembiayaan: 30000000,
          pengeluaran: 30000000
        }
      }
    ],
    pendapatan: [
      {
        id: 1,
        nama_komponen: 'Pendapatan Transfer',
        sumber_anggaran: 'pusat',
        jumlah_anggaran: 900000000
      }
    ],
    belanja: [
      {
        id: 4,
        nama_komponen: 'Belanja Pegawai II',
        sumber_anggaran: 'pusat',
        jumlah_anggaran: 50000000
      }
    ]
  }
};

export const staticTemplateAttr = [
  'nama_lengkap',
  'nik',
  'hubungan_keluarga',
  'nomor_kk',
  'jenis_kelamin',
  'agama',
  'status_perkawinan',
  'status_penduduk',
  'alamat_kk',
  'dusun_id',
  'rt',
  'rw',
  'alamat_sebelumnya',
  'nomor_telepon',
  'email',
  'tanggal_lahir',
  'tempat_lahir',
  'no_akta_kelahiran',
  'pendidikan_kk',
  'pendidikan_sedang_ditempuh',
  'pekerjaan',
  'nama_ayah',
  'nama_ibu',
  'nik_ayah',
  'nik_ibu',
  'nama_perangkat_desa',
  'nip_perangkat_desa',
  'jenis_kelamin_perangkat_desa',
  'tempat_lahir_perangkat_desa',
  'tanggal_lahir_perangkat_desa',
  'jabatan_id_perangkat_desa',
  'alamat_perangkat_desa',
  'status_perangkat_desa',
  'nama_jabatan_perangkat_desa'
];
