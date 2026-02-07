import { Editor } from '@tinymce/tinymce-react';
import { Button, Card, Skeleton } from 'antd';
import React, { useRef } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import { useAuth, useService } from '@/hooks';
import { PerjanjianKinerjaService } from '@/services';
import { useParams } from 'react-router-dom';
import { PERJANJIAN_KINERJA_TEMPLATE } from './templates';

const PerjanjianKinerjaDoc = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const { execute, ...getAllTemplateData } = useService(PerjanjianKinerjaService.getTemplate);

  const fetchTemplateData = React.useCallback(() => {
    execute({ token, skp_id: id });
  }, [execute, id, token]);

  React.useEffect(() => {
    fetchTemplateData();
  }, [fetchTemplateData]);

  const templateData = React.useMemo(() => {
    return getAllTemplateData.data ?? null;
  }, [getAllTemplateData.data]);

  const renderTemplate = (template, variables) => {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      return variables[key.trim()] ?? '-';
    });
  };

  const buildVariables = (data) => {
    const skp = data?.skp;
    const atasanSkp = data?.atasan_skp;

    const posjab = skp?.posjab?.[0];
    const posjabAtasan = atasanSkp?.posjab?.[0];

    return {
      tahun: new Date(skp?.periode_end).getFullYear(),

      nama_asn: posjab?.nama_asn,
      jabatan_asn: posjab?.nama_jabatan,

      nama_unor: posjab?.unor?.nama,

      nama_atasan: posjabAtasan?.nama_asn,
      jabatan_atasan: posjabAtasan?.nama_jabatan,

      periode_start: skp?.periode_start,
      periode_end: skp?.periode_end
    };
  };

  const variables = React.useMemo(() => {
    if (!templateData) return {};
    return buildVariables(templateData);
  }, [templateData]);

  const editorRef = useRef(null);

  const handlePrint = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePrint');
    }
  };

  return (
    <>
      {getAllTemplateData.isLoading ? (
        <Skeleton active />
      ) : (
        <div className="flex flex-col gap-y-4">
          <Card
            title="Dokumen Perjanjian Kinerja"
            extra={
              <Button onClick={handlePrint} variant="solid" color="primary" icon={<PrinterOutlined />}>
                Cetak
              </Button>
            }
          >
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={renderTemplate(PERJANJIAN_KINERJA_TEMPLATE, variables)}
              apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
              init={{
                plugins: 'print',
                readonly: true,
                height: '100vh',
                content_style: `
                        body {
                        background: #fff;
                        }

                        /* Disable the blue "focus" border for the editable region */
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
                        padding:2rem 0 0 0;
                        text-align: center;
                        }

                        /* Apply page-like styling */
                        @media (min-width: 840px) {
                        html {
                            background: #eceef4;
                            min-height: 100%;
                            padding: 0.5rem;
                        }

                        body {
                            background-color: #fff;
                            box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                            box-sizing: border-box;
                            margin: 1rem auto 0;
                            max-width: 820px;
                            min-height: calc(100vh - 1rem);
                            padding: 2rem 6rem 2rem 6rem;
                        }
                        }
                        `
              }}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default PerjanjianKinerjaDoc;
