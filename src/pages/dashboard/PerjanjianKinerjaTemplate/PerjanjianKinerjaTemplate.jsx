import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Row, Col, Typography, Divider, Image } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import pohuwato from '/public/perjanjian-kinerja/pohuwato.jpg';

const { Title, Text, Paragraph } = Typography;

const PerjanjianKinerjaTemplate = () => {
  const printRef = useRef(null);
  const [dummyData, setDummyData] = useState({
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
          indikator_kinerja: [
            { name: 'Persentase ASN yang Terlatih TIK', target: '75', satuan: '%' }
          ]
        }
      }
    ]
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Card 
        title="Perjanjian Kinerja Template" 
        extra={
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
          >
            Cetak
          </Button>
        }
        style={{ marginBottom: 20 }}
      >
        <div className="print-content" ref={printRef}>
          {/* Cover Page */}
          <div className="cover-page" style={{ textAlign: 'center', marginBottom: 50, pageBreakAfter: 'always' }}>
            <Image 
              src={pohuwato} 
              alt="Logo Kabupaten Pohuwato" 
              style={{ width: 150, marginBottom: 30 }}
              preview={false}
            />
            <Title level={2} style={{ marginTop: 20 }}>PERJANJIAN KINERJA</Title>
            <Title level={3}>{dummyData.tahun}</Title>
            <Title level={4} style={{ marginTop: 40 }}>{dummyData.unit.nama_unor}</Title>
            <Title level={4} style={{ marginTop: 40 }}>KABUPATEN POHUWATO</Title>
          </div>

          {/* Content Page */}
          <div className="content-page" style={{ marginBottom: 50, pageBreakAfter: 'always' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <Image 
                src={pohuwato} 
                alt="Logo Kabupaten Pohuwato" 
                style={{ width: 80, marginBottom: 10 }}
                preview={false}
              />
              <Title level={3}>PERJANJIAN KINERJA {dummyData.tahun}</Title>
              <Title level={4}>{dummyData.unit.nama_unor} - KABUPATEN POHUWATO</Title>
              <Divider />
            </div>

            <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
              Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan, dan akuntabel serta berorientasi
              pada hasil, kami yang bertanda tangan dibawah ini:
            </Paragraph>

            <div style={{ marginLeft: 20, marginBottom: 20 }}>
              <Row>
                <Col span={3}>Nama</Col>
                <Col span={21}>: {dummyData.nama_pihak_pertama}</Col>
              </Row>
              <Row>
                <Col span={3}>Jabatan</Col>
                <Col span={21}>: {dummyData.jabatan_pihak_pertama}</Col>
              </Row>
              <Paragraph style={{ marginTop: 10 }}>Selanjutnya disebut Pihak Pertama</Paragraph>

              <Row>
                <Col span={3}>Nama</Col>
                <Col span={21}>: {dummyData.nama_pihak_kedua}</Col>
              </Row>
              <Row>
                <Col span={3}>Jabatan</Col>
                <Col span={21}>: {dummyData.jabatan_pihak_kedua}</Col>
              </Row>
              <Paragraph style={{ marginTop: 10 }}>Selaku atasan langsung pihak pertama, selanjutnya disebut Pihak Kedua</Paragraph>
            </div>

            <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
              Pihak pertama berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam
              rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan.
              Keberhasilan dan kegagalan pencapaian target kinerja tersebut menjadi tanggung jawab kami.
            </Paragraph>

            <Paragraph style={{ textAlign: 'justify', textIndent: '25px', lineHeight: '2em' }}>
              Pihak kedua akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi terhadap capaian kinerja
              dari perjanjian ini dan mengambil tindakan yang diperlukan dalam rangka pemberian penghargaan dan sanksi.
            </Paragraph>

            {/* Signature Table */}
            <Row style={{ marginTop: 50 }}>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Text>Pegawai yang dinilai</Text>
                <div style={{ height: 100 }}></div>
                <Text strong>{dummyData.jabatan_pihak_pertama}</Text>
                <br />
                <Text>{dummyData.nama_pihak_pertama}</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Text>Pejabat penilai kinerja</Text>
                <div style={{ height: 100 }}></div>
                <Text strong>{dummyData.jabatan_pihak_kedua}</Text>
                <br />
                <Text>{dummyData.nama_pihak_kedua}</Text>
              </Col>
            </Row>
          </div>

          {/* Tables Page */}
          <div className="tables-page">
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <Image 
                src={pohuwato} 
                alt="Logo Kabupaten Pohuwato" 
                style={{ width: 80, marginBottom: 10 }}
                preview={false}
              />
              <Title level={3}>LAMPIRAN PERJANJIAN KINERJA {dummyData.tahun}</Title>
              <Title level={4}>{dummyData.unit.nama_unor} - KABUPATEN POHUWATO</Title>
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
                {dummyData.programs.map((program, programIndex) => (
                  program.tujuan && program.tujuan.indikator_kinerja && program.tujuan.indikator_kinerja.length > 0 ? (
                    program.tujuan.indikator_kinerja.map((indikator, indikatorIndex) => (
                      <tr key={`${programIndex}-${indikatorIndex}`}>
                        {indikatorIndex === 0 && (
                          <>
                            <td 
                              rowSpan={program.tujuan.indikator_kinerja.length} 
                              style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}
                            >
                              {programIndex + 1}
                            </td>
                            <td 
                              rowSpan={program.tujuan.indikator_kinerja.length} 
                              style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}
                            >
                              {program.tujuan.description}
                            </td>
                          </>
                        )}
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{indikator.name}</td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{indikator.target} {indikator.satuan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={programIndex}>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{programIndex + 1}</td>
                      <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{program.tujuan ? program.tujuan.description : program.name}</td>
                      <td colSpan={2} style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>No indicators found</td>
                    </tr>
                  )
                ))}
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
                {dummyData.programs.map((program, index) => (
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
                <Text strong>{dummyData.jabatan_pihak_pertama}</Text>
                <br />
                <Text>{dummyData.nama_pihak_pertama}</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Text>Pejabat penilai kinerja</Text>
                <div style={{ height: 100 }}></div>
                <Text strong>{dummyData.jabatan_pihak_kedua}</Text>
                <br />
                <Text>{dummyData.nama_pihak_kedua}</Text>
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
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
          table, tr, td, th {
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