import { useAuth, useNotification, useService } from '@/hooks';
import { PerjanjianKinerjaService, SkpsService, UnitKerjaService } from '@/services';
import capitalizeWords from '@/utils/CapitalizeWord';
import { CheckCircleFilled, DownOutlined, PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Result, Skeleton, Tree } from 'antd';
import React from 'react';

const PerjanjianKinerja = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllHierarchy } = useService(UnitKerjaService.getAllHirarchy);
  const { execute: fetchSkp, ...getSkp } = useService(SkpsService.getAll);
  const downloadPerjanjianKinerja = useService(PerjanjianKinerjaService.download);
  const [selectedData, setSelectedData] = React.useState(null);

  const fetchHierarchy = React.useCallback(() => {
    if (!user?.unor.id) return;
    execute(token, user.unor.id);
  }, [execute, token, user?.unor.id]);

  React.useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy, token]);

  const hierarchy = getAllHierarchy.data ?? null;

  const mapToTreeData = React.useCallback(
    (node) => ({
      title: capitalizeWords(node.namaUnor),
      key: node.id,
      icon: <UserOutlined />,
      dataRef: node,
      children: node.bawahan?.map(mapToTreeData) || []
    }),
    []
  );

  const treeData = React.useMemo(() => {
    if (!hierarchy) return [];
    return [
      {
        title: capitalizeWords(hierarchy.namaUnor),
        key: hierarchy.id,
        icon: <UserOutlined />,
        dataRef: hierarchy,
        children: hierarchy.bawahan?.map(mapToTreeData) || []
      }
    ];
  }, [hierarchy, mapToTreeData]);

  const onSelect = (selectedKeys, info) => {
    if (info.node.dataRef) {
      setSelectedData(info.node.dataRef);
    }
  };

  React.useEffect(() => {
    if (selectedData?.user?.nip_asn) {
      fetchSkp({ token, user_id: selectedData.user.nip_asn });
    }
  }, [fetchSkp, selectedData?.user?.nip_asn, token]);

  const skpByUser = getSkp.data ?? [];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit">
        <Skeleton loading={getAllHierarchy.isLoading}>
          <div>
            <Tree showLine switcherIcon={<DownOutlined />} defaultExpandedKeys={['0-0-0']} onSelect={onSelect} treeData={treeData} />
          </div>
        </Skeleton>
      </Card>
      <Card className="col-span-8 h-fit">
        <Skeleton loading={getAllHierarchy.isLoading}>
          {!selectedData ? (
            <Result status="info" title="Pilih Unor Yang Terdaftar" subTitle="Mohon pilih unor yang terdaftar dalam menu untuk melihat detail perjanjian kinerja" />
          ) : (
            <>
              {!selectedData?.user ? (
                <>
                  <Result status="500" title="User Tidak Terdaftar" subTitle="User dalam unor ini belum terdaftar dalam sistem, status perjanjian kinerja tidak dapat di lihat" />
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Nama Unor">{selectedData?.namaUnor}</Descriptions.Item>
                    <Descriptions.Item label="Jabatan">{selectedData?.namaJabatan}</Descriptions.Item>
                    <Descriptions.Item label="Induk Organisasi">{selectedData?.induk.nama}</Descriptions.Item>
                  </Descriptions>
                </>
              ) : (
                <>
                  <Skeleton loading={getSkp.isLoading}>
                    <Result status="success" title="Perjanjian Kinerja Sudah di Upload" subTitle="Perjanjian kinerja pada seluruh daftar skp oleh user ini telah berhasil di upload" />
                    {skpByUser.map((item) => (
                      <Descriptions key={item.id} bordered column={2}>
                        <Descriptions.Item label="Pendekatan">{item.pendekatan}</Descriptions.Item>
                        <Descriptions.Item label="Periode Mulai">{item.periode_start}</Descriptions.Item>
                        <Descriptions.Item label="Periode Berakhir">{item.periode_end}</Descriptions.Item>
                        <Descriptions.Item label="Periode Berakhir">{item.periode_end}</Descriptions.Item>
                        <Descriptions.Item label="Perjanjian Kinerja" span={3}>
                          <div className="flex flex-col gap-y-4">
                            {item.perjanjian_kinerja.map((pk_item) => (
                              <div key={pk_item.id} className="inline-flex items-center gap-x-2">
                                <CheckCircleFilled className="text-green-500" />
                                <Button
                                  icon={<PaperClipOutlined />}
                                  variant="text"
                                  color="primary"
                                  loading={downloadPerjanjianKinerja.isLoading}
                                  onClick={async () => {
                                    const { isSuccess, message } = await downloadPerjanjianKinerja.execute(token, pk_item.id);
                                    if (isSuccess) {
                                      success('Berhasil', message);
                                    } else {
                                      error('Gagal', message);
                                    }
                                    return isSuccess;
                                  }}
                                >
                                  {pk_item.id}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                    ))}
                  </Skeleton>
                </>
              )}
            </>
          )}
        </Skeleton>
      </Card>
    </div>
  );
};

export default PerjanjianKinerja;
