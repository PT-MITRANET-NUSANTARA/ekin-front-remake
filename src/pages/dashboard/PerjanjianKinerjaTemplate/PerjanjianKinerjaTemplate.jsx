/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Row, Col, Typography, Divider, Image, Skeleton } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import pohuwato from '/public/perjanjian-kinerja/pohuwato.jpg';
import { useParams } from 'react-router-dom';
import { useAuth, useService, useNotification } from '@/hooks';
import { PerjanjianKinerjaService } from '@/services';

const { Title, Text, Paragraph } = Typography;

const PerjanjianKinerjaTemplate = () => {
  const { id } = useParams();
  const printRef = useRef(null);
  const { token } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState(null);
  const { execute: fetchTemplate, isLoading } = useService(PerjanjianKinerjaService.getTemplate);
  const [posjab, setPosjab] = useState(null);
  const [posjabAtasan, setPosjabAtasan] = useState(null);
  // Fungsi untuk mengambil data template
  const fetchTemplateData = async (abortController) => {
    try {
      setLoading(true);
      // Pastikan abortController tidak undefined
      const options = abortController ? { token, skp_id: id, signal: abortController.signal } : { token, skp_id: id };
      const response = await fetchTemplate(options);

      // Periksa apakah request sudah dibatalkan
      if (abortController && abortController.signal.aborted) {
        return;
      }

      if (response && response.isSuccess) {
        setTemplateData(response.data);
        setPosjab(response.data.skp.posjab[response.data.skp.posjab.length - 1]);
        if (response.data.atasan_skp) {
          setPosjabAtasan(response.data.atasan_skp.posjab[response.data.atasan_skp.posjab.length - 1]);
        } else {
          setPosjabAtasan({
            nama_jabatan: posjab.unor.atasan.unor_jabatan,
            nama_unor: posjab.unor.atasan.unor_nama,
            nama_asn: posjab.unor.atasan.asn.nama_atasan,
            nip_asn: posjab.unor.atasan.asn.nip_atasan
          });
        }
      } else if (response) {
        error('Gagal', response.message || 'Gagal mengambil data template');
      }
    } catch (err) {
      // Jangan tampilkan error jika request dibatalkan
      if (err.name !== 'AbortError') {
        error('Error', 'Terjadi kesalahan saat mengambil data template');
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
    fetchTemplateData(abortController);

    // Cleanup function untuk membatalkan request jika komponen unmount
    return () => {
      abortController.abort();
    };
  }, [id, token]);

  // Data dummy untuk fallback jika API belum tersedia
  const dummyData = {
    tahun: '2023',
    unit: {
      nama_unor: 'DINAS KOMUNIKASI DAN INFORMATIKA'
    },
    nama_pihak_pertama: 'JOHN DOE',
    jabatan_pihak_pertama: 'KEPALA DINAS KOMUNIKASI DAN INFORMATIKA',
    nama_pihak_kedua: 'JANE SMITH',
    jabatan_pihak_kedua: 'SEKRETARIS DAERAH',
    programs: [
      {
        name: 'Program Penyelenggaraan Pemerintahan dan Pelayanan Publik',
        total_anggaran: '500.000.000',
        tujuan: {
          description: 'Meningkatkan kualitas pelayanan publik',
          indikator_kinerja: [
            { name: 'Indeks Kepuasan Masyarakat', target: '80', satuan: '%' },
            { name: 'Persentase Layanan Tepat Waktu', target: '90', satuan: '%' }
          ]
        }
      },
      {
        name: 'Program Pengembangan Komunikasi dan Informatika',
        total_anggaran: '750.000.000',
        tujuan: {
          description: 'Meningkatkan infrastruktur teknologi informasi',
          indikator_kinerja: [
            { name: 'Persentase Cakupan Jaringan Internet', target: '85', satuan: '%' },
            { name: 'Jumlah Aplikasi yang Dikembangkan', target: '5', satuan: 'Aplikasi' }
          ]
        }
      },
      {
        name: 'Program Pengembangan Sumber Daya TIK',
        total_anggaran: '300.000.000',
        tujuan: {
          description: 'Meningkatkan kompetensi SDM bidang TIK',
          indikator_kinerja: [{ name: 'Persentase ASN yang Terlatih TIK', target: '75', satuan: '%' }]
        }
      }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  // Use templateData if available, otherwise fallback to dummyData
  const data = templateData;

  return (
    <div>
      <Card
        title="Perjanjian Kinerja Template"
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
            {/* Cover Page */}
            <div className="cover-page" style={{ textAlign: 'center', marginBottom: 50, pageBreakAfter: 'always' }}>
              <Image src={pohuwato} alt="Logo Kabupaten Pohuwato" style={{ width: 150, marginBottom: 30 }} preview={false} />
              <Title level={2} style={{ marginTop: 20 }}>
                PERJANJIAN KINERJA
              </Title>
              <Title level={3}>{new Date(data?.skp.periode_start).getFullYear()}</Title>
              <Title level={4} style={{ marginTop: 40 }}>
                {posjab?.unor.nama}
              </Title>
              <Title level={4} style={{ marginTop: 40 }}>
                KABUPATEN POHUWATO
              </Title>
            </div>

            {/* Content Page */}
            <div className="content-page" style={{ marginBottom: 50, pageBreakAfter: 'always' }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <Image src={pohuwato} alt="Logo Kabupaten Pohuwato" style={{ width: 80, marginBottom: 10 }} preview={false} />
                <Title level={3}>PERJANJIAN KINERJA {new Date(data?.skp.periode_start).getFullYear()}</Title>
                <Title level={4}>{posjab?.unor.nama} - KABUPATEN POHUWATO</Title>
                <Divider />
              </div>

              <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
                Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan, dan akuntabel serta berorientasi pada hasil, kami yang bertanda tangan dibawah ini:
              </Paragraph>

              <div style={{ marginLeft: 20, marginBottom: 20 }}>
                <Row>
                  <Col span={3}>Nama</Col>
                  <Col span={21}>: {data.nama_pihak_pertama}</Col>
                </Row>
                <Row>
                  <Col span={3}>Jabatan</Col>
                  <Col span={21}>: {data.jabatan_pihak_pertama}</Col>
                </Row>
                <Paragraph style={{ marginTop: 10 }}>Selanjutnya disebut Pihak Pertama</Paragraph>

                <Row>
                  <Col span={3}>Nama</Col>
                  <Col span={21}>: {data.nama_pihak_kedua}</Col>
                </Row>
                <Row>
                  <Col span={3}>Jabatan</Col>
                  <Col span={21}>: {data.jabatan_pihak_kedua}</Col>
                </Row>
                <Paragraph style={{ marginTop: 10 }}>Selaku atasan langsung pihak pertama, selanjutnya disebut Pihak Kedua</Paragraph>
              </div>

              <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
                Pihak pertama berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan. Keberhasilan dan
                kegagalan pencapaian target kinerja tersebut menjadi tanggung jawab kami.
              </Paragraph>

              <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
                Pihak kedua akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi terhadap capaian kinerja dari perjanjian ini dan mengambil tindakan yang diperlukan dalam rangka pemberian penghargaan dan sanksi.
              </Paragraph>

              {/* Signature Table */}
              <Row style={{ marginTop: 50 }}>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text>Pegawai yang dinilai</Text>
                  <div style={{ height: 100 }}></div>
                  <Text strong>{posjab?.nama_jabatan}</Text>
                  <br />
                  <Text>{posjab?.nama_asn}</Text>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text>Pejabat penilai kinerja</Text>
                  <div style={{ height: 100 }}></div>
                  <Text strong>{posjabAtasan?.nama_jabatan}</Text>
                  <br />
                  <Text>{posjabAtasan?.nama_asn}</Text>
                </Col>
              </Row>
            </div>

            {/* Tables Page */}
            <div className="tables-page">
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <Image src={pohuwato} alt="Logo Kabupaten Pohuwato" style={{ width: 80, marginBottom: 10 }} preview={false} />
                <Title level={3}>LAMPIRAN PERJANJIAN KINERJA {new Date(data?.skp.periode_start).getFullYear()}</Title>
                <Title level={4}>{posjab?.unor.nama} - KABUPATEN POHUWATO</Title>
                <Divider />
              </div>

              {/* Sasaran Strategis Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 30, marginBottom: 30 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>No</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>Sasaran Strategis</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>Indikator Kinerja</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>Target (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tujuans.map((tujuan, tujuanIndex) =>
                    tujuan.indikator_kinerja_id && tujuan.indikator_kinerja_id.length > 0 ? (
                      tujuan.indikator_kinerja_id.map((indikator, indikatorIndex) => (
                        <tr key={`${tujuanIndex}-${indikatorIndex}`}>
                          {indikatorIndex === 0 && (
                            <>
                              <td rowSpan={tujuan.indikator_kinerja_id.length} style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                                {tujuanIndex + 1}
                              </td>
                              <td rowSpan={tujuan.indikator_kinerja_id.length} style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                                {tujuan.name}
                              </td>
                            </>
                          )}
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{indikator.name}</td>
                          <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                            {indikator.target} {indikator.satuan}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={tujuanIndex}>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{tujuanIndex + 1}</td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{tujuan.description || tujuan.name}</td>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                          No indicators found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* Program Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 30, marginBottom: 50 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>No</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>PROGRAM</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>ANGGARAN</th>
                    <th style={{ border: '1px solid #000', padding: 8, backgroundColor: '#f2f2f2' }}>KET</th>
                  </tr>
                </thead>
                <tbody>
                  {data.programs.map((program, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{program.name}</td>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>Rp. {program.total_anggaran}</td>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>APBD</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signature Table */}
              <Row style={{ marginTop: 50 }}>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text>Pegawai yang dinilai</Text>
                  <div style={{ height: 100 }}></div>
                  <Text strong>{posjab?.nama_jabatan}</Text>
                  <br />
                  <Text>{posjab?.nama_asn}</Text>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text>Pejabat penilai kinerja</Text>
                  <div style={{ height: 100 }}></div>
                  <Text strong>{posjabAtasan?.nama_jabatan}</Text>
                  <br />
                  <Text>{posjabAtasan?.nama_asn}</Text>
                </Col>
              </Row>
            </div>
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
          .cover-page {
            page-break-after: always;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .content-page {
            page-break-after: always;
          }
          .tables-page {
            page-break-before: always;
          }
          @page {
            size: A4;
            margin: 2cm;
          }
          table,
          tr,
          td,
          th {
            page-break-inside: avoid;
          }
          .tables-page table {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PerjanjianKinerjaTemplate;
