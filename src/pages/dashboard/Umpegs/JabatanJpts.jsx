import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { JptService, UnitKerjaService } from '@/services';
import { Card, Skeleton, Tree, Space } from 'antd';
import React from 'react';
import { DataTableHeader, PageExplanation } from '@/components';
import { useParams } from 'react-router-dom';
import { FolderOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { Edit as EditBtn } from '@/components/dashboard/button';
import { pimpinanUnitKerjaFormFields } from './FormFields';

const JabatanJpts = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  
  const { execute, ...getDetailJpt } = useService(JptService.getById);
  const { execute: fetchPimpinanList, ...getPimpinanList } = useService(JptService.getByUnitId);
  const { execute: fetchJptList, ...getJptList } = useService(JptService.getJptByUnitId);
  const { execute: fetchAsnList, ...getAsnList } = useService(UnitKerjaService.getAllAsn);
  const storeJpt = useService(JptService.store);
  const storePimpinan = useService(JptService.storePimpinanUnitKerja);
  const updateJpt = useService(JptService.update);
  const updatePimpinan = useService(JptService.updatePimpinanUnitKerja);
  
  const detailJpt = getDetailJpt.data ?? {};
  const pimpinanList = getPimpinanList.data ?? [];
  const jptList = getJptList.data ?? [];
  const asnList = getAsnList.data ?? [];

  const fetchJptDetail = React.useCallback(() => {
    execute(token, id);
  }, [execute, id, token]);

  const fetchPimpinan = React.useCallback(() => {
    fetchPimpinanList(token, id);
  }, [fetchPimpinanList, id, token]);

  const fetchJpt = React.useCallback(() => {
    fetchJptList(token, id);
  }, [fetchJptList, id, token]);

  const fetchAsn = React.useCallback(() => {
    fetchAsnList(token, id);
  }, [fetchAsnList, id, token]);

  React.useEffect(() => {
    fetchJptDetail();
    fetchPimpinan();
    fetchJpt();
    fetchAsn();
  }, [fetchJptDetail, fetchPimpinan, fetchJpt, fetchAsn, id, token]);

  // Debug logs
  React.useEffect(() => {
    if (jptList.length > 0) {
      console.log('JPT Records:', jptList);
    }
    if (pimpinanList.length > 0) {
      console.log('Pimpinan Records:', pimpinanList);
    }
  }, [jptList, pimpinanList]);

  // Transform the data into a tree structure for the Tree component
  const transformToTreeData = (node, level = 0) => {
    if (!node) return null;
    
    const treeNode = {
      title: `${node.namaUnor} - ${node.namaJabatan}`,
      key: node.id,
      children: [],
      level
    };

    if (node.bawahan && Array.isArray(node.bawahan) && node.bawahan.length > 0) {
      treeNode.children = node.bawahan.map((child) => transformToTreeData(child, level + 1)).filter(Boolean);
    }

    return treeNode;
  };

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

  // Custom title render for tree nodes with action buttons
  const renderTitle = (node) => {
    // Get the appropriate record based on hierarchy level
    let record;
    if (node.level === 0) {
      // For JPT (top level): match against the organization unit ID from params
      // Since JPT records are fetched for this specific organization unit
      record = jptList.find(p => 
        String(p.unitId) === String(id)
      );
      console.log('Top level (JPT) search - org id:', id, 'node.key:', node.key, 'found record:', !!record);
    } else {
      // For Pimpinan (lower levels): match against the hierarchy node ID
      record = pimpinanList.find(p => 
        String(p.unitKerjaId) === String(node.key) || 
        String(p.unit_kerja_id) === String(node.key) || 
        String(p.unitId) === String(node.key)
      );
    }
    const hasRecord = !!record;
    
    // Get full ASN data for display - return array for multiple NIPs
    const getAsnDataList = (nip) => {
      // Handle NIP as array or single value
      const nipArray = Array.isArray(nip) ? nip : [nip];
      const asnDataList = [];
      
      for (const nipVal of nipArray) {
        const asn = asnList.find(a => a.nip === nipVal);
        if (asn) {
          asnDataList.push(asn);
        }
      }
      
      return asnDataList.length > 0 ? asnDataList : null;
    };
    
    // Extract jabatan name from node
    const jabatanName = node.title.split(' - ')[1] || '';
    
    // Get ASN data if record exists and has NIP
    const asnDataList = hasRecord && record?.nip ? getAsnDataList(record.nip) : null;
    
    return (
      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg ${getNodeStyle(node.level)} hover:shadow-lg transition-all w-full border-2 ${hasRecord ? 'border-green-300' : 'border-transparent'}`}>
        <div className="flex items-center gap-3 flex-1">
          {getHierarchyIcon(node.level)}
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900">{jabatanName}</span>
            {hasRecord && asnDataList && asnDataList.length > 0 && (
              <div className="space-y-2">
                {asnDataList.map((asnData, idx) => (
                  <div key={idx} className="text-xs space-y-0.5 bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-green-900 font-medium">
                      ✓ {asnData.nip}
                    </div>
                    <div className="text-green-800 font-medium">
                      {asnData.name}
                    </div>
                    {asnData.jabatan && (
                      <div className="text-green-700">
                        {asnData.jabatan}
                      </div>
                    )}
                    {asnData.unitKerja?.name && (
                      <div className="text-green-700 text-xs">
                        Unit: {asnData.unitKerja.name}
                      </div>
                    )}
                    {asnData.unor?.name && (
                      <div className="text-green-700 text-xs">
                        Org: {asnData.unor.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {hasRecord && !asnDataList && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                ⚠ Belum ada data ASN untuk NIP: {Array.isArray(record.nip) ? record.nip.join(', ') : record.nip}
              </span>
            )}
          </div>
        </div>
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          {hasRecord && (
            <EditBtn
              title="Edit JPT"
              onClick={() => {
                modal.edit({
                  title: `Edit ${jabatanName}`,
                  formFields: pimpinanUnitKerjaFormFields({ options: { asn: asnList }, nameDisabled: true }),
                  data: { 
                    ...record,
                    name: jabatanName
                  },
                  onSubmit: async (values) => {
                    let isSuccess, message;
                    const updateData = {
                      name: jabatanName, // Always use jabatan name
                      nip: values.nip || []
                    };
                    
                    if (node.level === 0) {
                      // Top level - update JPT record
                      const result = await updateJpt.execute(record.id, updateData, token);
                      isSuccess = result.isSuccess;
                      message = result.message;
                    } else {
                      // Lower levels - update Pimpinan record
                      const result = await updatePimpinan.execute(record.id, updateData, token);
                      isSuccess = result.isSuccess;
                      message = result.message;
                    }
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchPimpinan();
                      fetchJpt();
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
            />
          )}
          {!hasRecord && (
            <button
              onClick={() => {
                modal.create({
                  title: `Tambah ${jabatanName}`,
                  formFields: pimpinanUnitKerjaFormFields({ options: { asn: asnList }, nameDisabled: true }),
                  initialValues: { name: jabatanName },
                  onSubmit: async (values) => {
                    let isSuccess, message;
                    const createData = {
                      name: jabatanName, // Auto-fill with jabatan name
                      nip: values.nip || []
                    };
                    
                    if (node.level === 0) {
                      // Top level - create JPT record
                      const result = await storeJpt.execute(
                        {
                          ...createData,
                          unitId: node.key
                        },
                        token
                      );
                      isSuccess = result.isSuccess;
                      message = result.message;
                    } else {
                      // Lower levels - create Pimpinan record
                      const result = await storePimpinan.execute(
                        {
                          ...createData,
                          unitId: detailJpt.induk?.id_simpeg,
                          unitKerjaId: node.key
                        },
                        token
                      );
                      isSuccess = result.isSuccess;
                      message = result.message;
                    }
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchPimpinan();
                      fetchJpt();
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
              className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              ➕ Tambah
            </button>
          )}
        </Space>
      </div>
    );
  };

  const treeData = detailJpt.id ? [transformToTreeData(detailJpt)] : [];

  // Transform treeData to include custom title rendering
  const enhancedTreeData = treeData.map((node) => {
    const enhance = (item) => ({
      ...item,
      title: renderTitle(item),
      children: item.children?.map(enhance) || []
    });
    return enhance(node);
  });


  return (
    <>
      <PageExplanation title={`Hierarki ${detailJpt?.namaUnor || 'Loading...'}`} subTitle={'Lihat struktur organisasi dan kelola JPT untuk setiap posisi. Klik "+ JPT" untuk menambah JPT.'} />
      <Card title={<DataTableHeader modul={`Hierarki - ${detailJpt?.namaUnor || 'Loading...'}`}></DataTableHeader>}>
        <div className="w-full p-4">
          <Skeleton loading={getDetailJpt.isLoading}>
            {treeData.length > 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <Tree
                  treeData={enhancedTreeData}
                  defaultExpandAll
                  showIcon
                  blockNode
                  className="!bg-transparent"
                  style={{
                    fontSize: '14px',
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data hierarki
              </div>
            )}
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default JabatanJpts;
