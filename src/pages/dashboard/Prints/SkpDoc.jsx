import { PrinterOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Card } from 'antd';
import React from 'react';
import { useAuth, useService } from '@/hooks';
import { SkpsService } from '@/services';
import { useParams } from 'react-router-dom';
import { SKP_KINERJA_TEMPLATE, SKP_PERILAKU_TEMPLATE, SKP_TEMPLATE } from './templates';

const SkpDoc = () => {
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
      kinerja_table: SKP_KINERJA_TEMPLATE(data),
      perilaku_table: SKP_PERILAKU_TEMPLATE(data)
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
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={renderTemplate(SKP_TEMPLATE, variables)}
            apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
            init={{
              plugins: 'print',
              visual: false,
              readonly: true,
              height: '100vh',
              content_style: `
                                body {
                                background: #fff;
                                }

                                /* Disable focus outline */
                                .editable-section:focus-visible {
                                outline: none !important;
                                }

                                .header,
                                .footer {
                                font-size: 0.8rem;
                                color: #ddd;
                                }

                                .header {
                                display: flex;
                                justify-content: space-between;
                                padding: 0 0 1rem 0;
                                }

                                .header .right-text {
                                text-align: right;
                                }

                                .footer {
                                padding: 2rem 0 0 0;
                                text-align: center;
                                }

                                /* === LANDSCAPE PAGE STYLE === */
                                @media (min-width: 1100px) {
                                html {
                                    background: #eceef4;
                                    min-height: 100%;
                                    padding: 0.5rem;
                                }

                                body {
                                    background-color: #fff;
                                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
                                    box-sizing: border-box;
                                    margin: 1rem auto 0;

                                    /* Landscape adjustments */
                                    max-width: 1120px;      /* lebih lebar */
                                    min-height: 720px;      /* lebih pendek */
                                    padding: 2.5rem 4rem;  /* kiri-kanan lebih sempit */

                                }
                            }
                        `
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default SkpDoc;
