/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Typography, Skeleton } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAuth, useService, useNotification } from '@/hooks';
import { SkpsService } from '@/services';

const { Title, Text } = Typography;

const SkpDownload = () => {
  const { id } = useParams();
  const printRef = useRef(null);
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [skpData, setSkpData] = useState(null);
  const [bawahan, setBawahan] = useState(null);
  const [atasan, setAtasan] = useState(null);
  const { execute: fetchSkp, isLoading } = useService(SkpsService.getById);

  // Fungsi untuk mengambil data SKP
  const fetchSkpData = async (abortController) => {
    try {
      setLoading(true);
      // Pastikan abortController tidak undefined
      const options = abortController ? { token, id, signal: abortController.signal } : { token, id };
      const response = await fetchSkp(options);

      // Periksa apakah request sudah dibatalkan
      if (abortController && abortController.signal.aborted) {
        return;
      }

      if (response && response.isSuccess) {
        setSkpData(response.data);
        setBawahan(response.data.posjab[response.data.posjab.length - 1]);
        setAtasan(response.data.atasan_skp?.[response.data.atasan_skp.length - 1]?.posjab?.[response.data.atasan_skp[response.data.atasan_skp.length - 1].posjab.length - 1]);
      } else if (response) {
        error('Gagal', response.message || 'Gagal mengambil data SKP');
      }
    } catch (err) {
      // Jangan tampilkan error jika request dibatalkan
      if (err.name !== 'AbortError') {
        error('Error', 'Terjadi kesalahan saat mengambil data SKP');
        console.error(err);
      }
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  // Panggil fungsi fetch saat komponen dimuat
  useEffect(() => {
    // Buat AbortController untuk membatalkan request jika komponen unmount
    const abortController = new AbortController();

    // Panggil fungsi fetch dengan AbortController
    fetchSkpData(abortController);

    // Cleanup function untuk membatalkan request jika komponen unmount
    return () => {
      abortController.abort();
    };
  }, [id, token]);

  // Data dummy untuk SKP (akan diganti dengan data asli nanti)
  const dummyData = {
    periode: '14 January 2025−14 January 2025',
    nama_dinilai: 'JOHN DOE',
    nip_dinilai: '198501012010011001',
    jabatan_dinilai: 'KEPALA DINAS KOMUNIKASI DAN INFORMATIKA',
    unit_dinilai: 'DINAS KOMUNIKASI DAN INFORMATIKA',
    nama_penilai: 'JANE SMITH',
    nip_penilai: '197001012000121001',
    jabatan_penilai: 'SEKRETARIS DAERAH',
    unit_penilai: 'SEKRETARIAT DAERAH',
    rhks: [
      {
        id: 1,
        desc: 'Meningkatkan kualitas pelayanan publik',
        klasifikasi: 'Utama',
        aspek: [
          {
            id: 1,
            jenis: 'Kuantitas',
            indikator: 'Indeks Kepuasan Masyarakat',
            target_tahunan: { target: '80', satuan: '%' }
          },
          {
            id: 2,
            jenis: 'Kualitas',
            indikator: 'Persentase Layanan Tepat Waktu',
            target_tahunan: { target: '90', satuan: '%' }
          }
        ]
      },
      {
        id: 2,
        desc: 'Meningkatkan infrastruktur teknologi informasi',
        klasifikasi: 'Utama',
        aspek: [
          {
            id: 3,
            jenis: 'Kuantitas',
            indikator: 'Persentase Cakupan Jaringan Internet',
            target_tahunan: { target: '85', satuan: '%' }
          }
        ]
      }
    ],
    perilakus: [
      {
        id: 1,
        name: 'Berorientasi Pelayanan',
        isi: ['Memahami dan memenuhi kebutuhan masyarakat', 'Ramah, cekatan, solutif, dan dapat diandalkan', 'Melakukan perbaikan tiada henti']
      },
      {
        id: 2,
        name: 'Akuntabel',
        isi: [
          'Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, serta disiplin',
          'Melaksanakan tugas sesuai ketentuan peraturan perundang-undangan',
          'Menggunakan kekayaan dan barang milik negara secara bertanggung jawab, efektif, dan efisien'
        ]
      }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Card
        title="Sasaran Kinerja Pegawai"
        extra={
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} disabled={loading}>
            Cetak
          </Button>
        }
        style={{ marginBottom: 20 }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <div className="print-content" ref={printRef}>
            <div className="title-wrapper" style={{ textAlign: 'center', marginBottom: 30 }}>
              <Title level={3}>SASARAN KINERJA PEGAWAI</Title>
              <Title level={3}>PENDEKATAN HASIL KERJA KUANTITATIF</Title>
              <Title level={3}>BAGI PEJABAT ADMINISTRASI DAN PEJABAT FUNGSIONAL</Title>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text>PEMERINTAH KAB. POHUWATO</Text>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NO</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }} colSpan={2}>
                    PEGAWAI YANG DINILAI
                  </td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NO</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }} colSpan={2}>
                    PEGAWAI PENILAI KINERJA
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>1</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NAMA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{bawahan?.nama_asn}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>1</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NAMA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{atasan?.nama_asn}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>2</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NIP</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{bawahan?.nip_asn}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>2</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>NIP</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{atasan?.nip_asn}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>4</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>JABATAN</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{bawahan?.nama_jabatan}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>4</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>JABATAN</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{atasan?.nama_jabatan}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>5</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>UNIT KERJA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{bawahan?.unor.nama}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>5</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>UNIT KERJA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{atasan?.unor.nama}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>NO</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>RENCANA HASIL KERJA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>ASPEK</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>INDKATOR KINERJA INDIVIDU</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>TARGET/SESUAI EKSPEKTASI</td>
                </tr>
                <tr>
                  <td colSpan={6} style={{ border: '1px solid #000', padding: 8, textAlign: 'left' }}>
                    Utama
                  </td>
                </tr>
                {skpData.rhk
                  ?.filter((rhk) => rhk.jenis === 'UTAMA')
                  .map((rhk, rhkIndex) => (
                    <React.Fragment key={rhk.id}>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          {rhkIndex + 1}
                        </td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                            <p>{rhk.desc}</p>
                          </div>
                        </td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                            <p>{rhk.desc}</p>
                            <span>{rhk.klasifikasi}</span>
                          </div>
                        </td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: 8 }}></td>
                      </tr>
                      {rhk.aspek?.map((aspek) => (
                        <tr key={aspek.id}>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{aspek.jenis}</td>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                              <p>{aspek.indikator?.name || ''}</p>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{aspek.target_tahunan?.target + aspek.target_tahunan?.satuan || ''}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                <tr>
                  <td colSpan={6} style={{ border: '1px solid #000', padding: 8, textAlign: 'left' }}>
                    Tambahan
                  </td>
                </tr>
                {skpData.rhk
                  ?.filter((rhk) => rhk.jenis === 'TAMBAHAN')
                  .map((rhk, rhkIndex) => (
                    <React.Fragment key={rhk.id}>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          {rhkIndex + 1}
                        </td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                            <p>{rhk.desc}</p>
                          </div>
                        </td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }} rowSpan={rhk.aspek ? rhk.aspek.length + 1 : 1}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                            <p>{rhk.desc}</p>
                            <span>{rhk.klasifikasi}</span>
                          </div>
                        </td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: 8 }}></td>
                      </tr>
                      {rhk.aspek?.map((aspek) => (
                        <tr key={aspek.id}>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{aspek.jenis}</td>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left', maxWidth: '12rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                              <p>{aspek.indikator?.name || ''}</p>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{aspek.target_tahunan?.target + aspek.target_tahunan?.satuan || ''}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>NO</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>PERILAKU KERJA</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>EKSPEKTASI KHUSUS PIMPINAN</td>
                </tr>
                {skpData.perilaku_id.map((perilaku, index) => (
                  <tr key={perilaku.id}>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'left' }}>
                      <div>
                        <b>{perilaku.name}</b>
                        <ol style={{ listStyleType: 'decimal', listStylePosition: 'inside', paddingLeft: '20px' }}>
                          {perilaku.content.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    </td>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{perilaku.ekspetasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table style={{ width: '100%', marginTop: '50px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', textAlign: 'center' }}>Pegawai YANG DINILAI</td>
                  <td style={{ width: '50%', textAlign: 'center' }}>Pejabat PENILAI KINERJA</td>
                </tr>
                <tr>
                  <td style={{ height: '100px' }}></td>
                  <td style={{ height: '100px' }}></td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <b>{bawahan.nama_jabatan}</b>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <b>{atasan.nama_jabatan}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>{bawahan.nama_asn}</td>
                  <td style={{ textAlign: 'center' }}>{atasan.nama_asn}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>{bawahan.nip_asn}</td>
                  <td style={{ textAlign: 'center' }}>{atasan.nip_asn}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 auto;
            transform: translateX(0);
          }
          @page {
            size: A4 landscape;
            margin: 1.5cm;
          }
          table,
          tr,
          td,
          th {
            page-break-inside: avoid;
          }
          table {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SkpDownload;
