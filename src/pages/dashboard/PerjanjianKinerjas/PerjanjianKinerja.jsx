import { useAuth, useNotification, useService } from '@/hooks';
import { PerjanjianKinerjaService, SkpsService, UnitKerjaService } from '@/services';
import capitalizeWords from '@/utils/CapitalizeWord';
import { CheckCircleFilled, CloseCircleFilled, DownOutlined, PaperClipOutlined, FolderOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Result, Select, Skeleton, Tree } from 'antd';
import React from 'react';

const PerjanjianKinerja = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchAllUnor, ...getAllUnor } = useService(UnitKerjaService.getAll);
  const { execute: fetchDetails, ...getDetails } = useService(UnitKerjaService.getDetails);
  const { execute: fetchSkp, ...getSkp } = useService(SkpsService.getAll);
  const downloadPerjanjianKinerja = useService(PerjanjianKinerjaService.download);
  const [selectedData, setSelectedData] = React.useState(null);
  const [selectedUnor, setSelectedUnor] = React.useState(null);

  // Declare variables before useEffect hooks
  const unitDetail = getDetails.data ?? null;
  const unitKerja = getAllUnor.data ?? [];

  // Fetch all units on mount
  React.useEffect(() => {
    fetchAllUnor({ token });
  }, [fetchAllUnor, token]);

  // Fetch unit details when unit is selected
  React.useEffect(() => {
    if (!selectedUnor) return;
    fetchDetails(token, selectedUnor);
    setSelectedData(null);
  }, [selectedUnor, fetchDetails, token]);

  // Update selected data when unit detail is fetched
  React.useEffect(() => {
    if (unitDetail && !selectedData) {
      setSelectedData(unitDetail);
    }
  }, [unitDetail, selectedData]);

  // Get the appropriate icon based on hierarchy level
  const getHierarchyIcon = (level) => {
    if (level === 0) return <FolderOutlined className="text-blue-600 text-lg" />;
    if (level === 1) return <FileOutlined className="text-green-600 text-lg" />;
    return <TeamOutlined className="text-orange-600 text-lg" />;
  };

  // Get styling based on hierarchy level
  const getNodeStyle = (level) => {
    const styles = [
      'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600',
      'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600',
      'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-600',
    ];
    return styles[level % styles.length];
  };

  const mapToTreeData = React.useCallback(
    (node, level = 0) => ({
      title: capitalizeWords(node.namaUnor),
      key: node.id,
      level: level,
      dataRef: node,
      children: node.bawahan?.map((child) => mapToTreeData(child, level + 1)) || []
    }),
    []
  );

  const treeData = React.useMemo(() => {
    if (!unitDetail) return [];
    return [
      mapToTreeData(unitDetail, 0)
    ];
  }, [unitDetail, mapToTreeData]);

  const onSelect = (selectedKeys, info) => {
    if (info.node.dataRef) {
      setSelectedData(info.node.dataRef);
    }
  };

  // Custom title render for tree nodes
  const renderTitle = (node) => {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${getNodeStyle(node.level)} hover:shadow-lg transition-all w-full border-2 border-transparent`}>
        <div className="flex items-center gap-3 flex-1">
          {getHierarchyIcon(node.level)}
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900">{node.dataRef?.namaUnor}</span>
            <span className="text-xs text-gray-600">{node.dataRef?.namaJabatan}</span>
            {node.dataRef?.user && (
              <span className="text-xs text-gray-700 font-medium">{node.dataRef.user.nama || node.dataRef.user.nip_asn}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (selectedData?.user?.nip_asn) {
      fetchSkp({ token, user_id: selectedData.user.nip_asn });
    }
  }, [fetchSkp, selectedData?.user?.nip_asn, token]);

  const skpByUser = getSkp.data ?? [];

  const hasEmptyPerjanjian = skpByUser.some((item) => Array.isArray(item.perjanjian_kinerja) && item.perjanjian_kinerja.length === 0);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit">
        <Skeleton className="mb-4" loading={getAllUnor.isLoading}>
          <Select
            placeholder="Pilih Unit Kerja"
            className="w-full"
            value={selectedUnor}
            onChange={(value) => setSelectedUnor(value)}
            options={unitKerja?.map((item) => ({
              label: item.nama_unor || item.name,
              value: item.id_simpeg || item.id
            })) || []}
          />
        </Skeleton>
        <Skeleton loading={getDetails.isLoading} className="mt-4">
          <div>
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandedAll
              onSelect={onSelect}
              treeData={treeData}
              titleRender={(node) => renderTitle(node)}
            />
          </div>
        </Skeleton>
      </Card>
      <Card className="col-span-8 h-fit">
        <Skeleton loading={getDetails.isLoading}>
          {!selectedData ? (
            <Result status="info" title="Pilih Unor Yang Terdaftar" subTitle="Mohon pilih unor yang terdaftar dalam menu untuk melihat detail perjanjian kinerja" />
          ) : (
            <>
              <>
                <Descriptions bordered column={1} className="mb-4">
                  <Descriptions.Item label="Nama Unor">{selectedData?.namaUnor}</Descriptions.Item>
                  <Descriptions.Item label="Jabatan">{selectedData?.namaJabatan}</Descriptions.Item>
                  {selectedData?.induk && <Descriptions.Item label="Induk Organisasi">{selectedData.induk.nama}</Descriptions.Item>}
                </Descriptions>

                {!selectedData?.user ? (
                  <>
                    <Result status="500" title="User Tidak Terdaftar" subTitle="User dalam unor ini belum terdaftar dalam sistem, status perjanjian kinerja tidak dapat di lihat" />
                  </>
                ) : (
                  <Descriptions bordered column={1} className="mb-4">
                    <Descriptions.Item label="Nama ASN">{selectedData?.user?.nama}</Descriptions.Item>
                    <Descriptions.Item label="NIP">{selectedData?.user?.nip_asn}</Descriptions.Item>
                  </Descriptions>
                )}
              </>

              {selectedData?.user && (
                <Skeleton loading={getSkp.isLoading}>
                  {skpByUser.length === 0 ? (
                    <Result status="warning" title="SKP Kosong" subTitle="Tidak ada data SKP yang tersedia untuk user ini." />
                  ) : (
                    <>
                      <Result
                        status={hasEmptyPerjanjian ? 'error' : 'success'}
                        title={hasEmptyPerjanjian ? 'Ada perjanjian kinerja kosong!' : 'Semua perjanjian kinerja lengkap'}
                        subTitle={hasEmptyPerjanjian ? 'Mohon lengkapi data yang kosong' : 'Semua data sudah siap'}
                      />
                      {skpByUser.map((item) => (
                        <Descriptions key={item.id} bordered column={2} className="mb-4">
                          <Descriptions.Item label="Pendekatan">{item.pendekatan}</Descriptions.Item>
                          <Descriptions.Item label="Periode Mulai">{item.periode_start}</Descriptions.Item>
                          <Descriptions.Item label="Periode Berakhir">{item.periode_end}</Descriptions.Item>
                          <Descriptions.Item label="Perjanjian Kinerja" span={2}>
                            <div className="flex flex-col gap-y-4">
                              {Array.isArray(item.perjanjian_kinerja) && item.perjanjian_kinerja.length > 0 ? (
                                item.perjanjian_kinerja.map((pk_item) => (
                                  <div key={pk_item.id} className="inline-flex items-center gap-x-2">
                                    <CheckCircleFilled className="text-green-500" />
                                    <Button
                                      icon={<PaperClipOutlined />}
                                      variant="text"
                                      color="primary"
                                      loading={downloadPerjanjianKinerja.isLoading}
                                      onClick={async () => {
                                        const { isSuccess, message } = await downloadPerjanjianKinerja.execute(token, pk_item.id);
                                        if (isSuccess) success('Berhasil', message);
                                        else error('Gagal', message);
                                      }}
                                    >
                                      {pk_item.id}
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="inline-flex items-center gap-x-2">
                                  <CloseCircleFilled className="text-red-500" />
                                  <p>Perjanjian Kinerja Kosong</p>
                                </div>
                              )}
                            </div>
                          </Descriptions.Item>
                        </Descriptions>
                      ))}
                    </>
                  )}
                </Skeleton>
              )}
            </>
          )}
        </Skeleton>
      </Card>
    </div>
  );
};

export default PerjanjianKinerja;
