import { AimOutlined, FileImageOutlined, FileOutlined, FormOutlined, PrinterOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Card, Tabs } from 'antd';
import React from 'react';
import { useAuth, useService } from '@/hooks';
import { SkpsService } from '@/services';
import { useParams } from 'react-router-dom';
import EditorPreview from './EditorPreview';
import { LANDSCAPE_EDITOR_INIT } from './editorInit';
import { Crud } from '@/components';
import { InputType } from '@/constants';
import {
  COVER_TEMPLATE,
  EVALUASI_KINERJA_TEMPLATE,
  HASIL_EVALUASI_TEMPLATE,
  SASARAN_KINERJA_TEMPLATE,
  TABLE_HASIL_KERJA_EVALUASI_KINERJA_TEMPLATE,
  TABLE_HASIL_KERJA_SASARAN_KINERJA_TEMPLATE,
  TABLE_PERILAKU_KERJA_EVALUASI_KINERJA_TEMPLATE,
  TABLE_PERILAKU_KERJA_SASARAN_KINERJA_TEMPLATE
} from './SkpPenilaianTemplate';

const SkpPenilaianDoc = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const { execute, ...getAllDetailSkp } = useService(SkpsService.getById);

  const fetchDetailSkp = React.useCallback(() => {
    execute({ token: token, id: id });
  }, [execute, id, token]);

  React.useEffect(() => {
    fetchDetailSkp();
  }, [fetchDetailSkp]);

  const detailSkp = React.useMemo(() => {
    return getAllDetailSkp.data ?? null;
  }, [getAllDetailSkp.data]);

  const renderTemplate = (template, variables) => {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      return variables[key.trim()] ?? '-';
    });
  };

  const buildVariables = (data) => {
    const dataAsn = data?.posjab?.[data.posjab.length - 1];

    const lastAtasan = data?.atasan_skp?.[data.atasan_skp.length - 1];
    const dataAtasan = lastAtasan?.posjab?.[lastAtasan.posjab.length - 1];

    return {
      nama_asn: dataAsn?.nama_asn ?? '-',
      nama_atasan: dataAtasan?.nama_asn ?? '-',
      nip_asn: dataAsn?.nip_asn ?? '-',
      nip_atasan: dataAtasan?.nip_asn ?? '-',
      jabatan_asn: dataAsn?.nama_jabatan ?? '-',
      jabatan_atasan: dataAtasan?.nama_jabatan ?? '-',
      hasil_kerja_sasaran_kinerja_table: TABLE_HASIL_KERJA_SASARAN_KINERJA_TEMPLATE(data),
      perilaku_kerja_sasaran_kinerja_table: TABLE_PERILAKU_KERJA_SASARAN_KINERJA_TEMPLATE(data),
      hasil_kerja_evaluasi_kinerja_table: TABLE_HASIL_KERJA_EVALUASI_KINERJA_TEMPLATE(data),
      perilaku_kerja_evaluasi_kinerjas_table: TABLE_PERILAKU_KERJA_EVALUASI_KINERJA_TEMPLATE(data)
    };
  };

  const variables = React.useMemo(() => {
    if (!detailSkp) return {};
    return buildVariables(detailSkp);
  }, [detailSkp]);

  const editorRef = React.useRef(null);

  const handlePrint = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePrint');
    }
  };

  const tabConfig = React.useMemo(() => {
    return [
      {
        key: 'cover',
        label: 'Cover',
        icon: <FileImageOutlined />,
        template: COVER_TEMPLATE
      },
      {
        key: 'sasaran_kinerja',
        label: 'Sasaran Kinerja',
        icon: <AimOutlined />,
        template: SASARAN_KINERJA_TEMPLATE
      },
      {
        key: 'evaluasi_kinerja',
        label: 'Evaluasi Kinerja',
        icon: <FormOutlined />,
        template: EVALUASI_KINERJA_TEMPLATE
      },
      {
        key: 'hasil_evaluasi',
        label: 'Hasil Evaluasi',
        icon: <FileOutlined />,
        template: HASIL_EVALUASI_TEMPLATE
      }
    ];
  }, []);

  const buildPrintHtml = React.useCallback(() => {
    return tabConfig
      .map(
        (tab) => `
        <section class="print-page">
          ${renderTemplate(tab.template, variables)}
        </section>
        <div style="page-break-after: always;"></div>
      `
      )
      .join('');
  }, [tabConfig, variables]);

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <Card
          title="Dokumen Detail SKP"
          extra={
            <Button onClick={handlePrint} variant="solid" color="primary" icon={<PrinterOutlined />}>
              Cetak
            </Button>
          }
        >
          <Tabs
            items={tabConfig.map((tab) => ({
              key: tab.key,
              label: (
                <span>
                  {tab.icon} {tab.label}
                </span>
              ),
              children: <EditorPreview value={renderTemplate(tab.template, variables)} />
            }))}
          />
          <div style={{ display: 'none' }}>
            <Editor onInit={(evt, editor) => (editorRef.current = editor)} value={buildPrintHtml()} apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y" init={LANDSCAPE_EDITOR_INIT} />
          </div>

          <Crud
            formFields={[
              {
                label: `Konten `,
                name: 'content',
                type: InputType.DOCUMENT_EDITOR,
                rules: [
                  {
                    required: true,
                    message: `Konten harus diisi`
                  }
                ]
              }
            ]}
            onSubmit={(values) => console.log(values)}
          />
        </Card>
      </div>
    </div>
  );
};

export default SkpPenilaianDoc;
