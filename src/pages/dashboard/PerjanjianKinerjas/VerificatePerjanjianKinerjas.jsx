import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { AuthService, PerjanjianKinerjaService, SkpsService, UnitKerjaService } from '@/services';
import capitalizeWords from '@/utils/CapitalizeWord';
import { CheckCircleFilled, CheckOutlined, CloseCircleFilled, DownOutlined, PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Menu, Result, Select, Skeleton, Tree } from 'antd';
import React from 'react';

const VerificatePerjanjianKinerjas = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute, ...getAllHierarchy } = useService(UnitKerjaService.getAllHirarchy);
  const { execute: fetchSkp, ...getSkp } = useService(SkpsService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const { execute: fetchUserInUnit, ...getUserInUnit } = useService(AuthService.getUserInUnit);
  const downloadPerjanjianKinerja = useService(PerjanjianKinerjaService.download);
  const updateSkp = useService(SkpsService.update);
  const [selectedData, setSelectedData] = React.useState(null);
  const [selectedUnor, setSelectedUnor] = React.useState(user?.isAdmin ? null : user?.unor?.id);

  const fetchHierarchy = React.useCallback(() => {
    const unorId = user?.isAdmin ? selectedUnor : user?.unor?.id;
    if (!unorId) return;
    execute(token, unorId);
  }, [execute, token, selectedUnor, user?.isAdmin, user?.unor?.id]);

  React.useEffect(() => {
    fetchHierarchy();
    fetchUnitKerja({ token: token });
  }, [fetchHierarchy, fetchUnitKerja, token]);

  const hierarchy = getAllHierarchy.data ?? null;
  const unitKerja = getAllUnitKerja.data ?? null;

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
      fetchUserInUnit(token, selectedData.induk.id_simpeg, selectedData.induk.id_sapk);
    }
  }, [fetchUserInUnit, selectedData?.induk?.id_sapk, selectedData?.induk?.id_simpeg, selectedData?.user?.nip_asn, token]);

  const userInUnit = getUserInUnit.data ?? [];

  const menuItems = userInUnit.map((user) => ({
    label: user.nama_asn,
    key: user.nip_asn,
    icon: <UserOutlined />
  }));

  const [activeMenu, setActiveMenu] = React.useState(menuItems[0]?.key);

  const handleMenuClick = (e) => {
    const selectedKey = e.key;
    setActiveMenu(selectedKey);

    // fetch SKP data untuk user yang dipilih
    fetchSkp({
      token: token,
      user_id: selectedKey
    });
  };

  const skpUser = getSkp.data ?? [];

  const handleVerify = (data) => {
    modal.create({
      title: `Tambah ${Modul.VISION}`,
      formFields: [
        {
          label: `Rencana strategi`,
          name: 'cascading',
          type: InputType.SELECT,
          rules: [
            {
              required: true,
              message: `Rencana Strategi harus diisi`
            }
          ],
          size: 'large',
          options: [
            { label: 'NON_DIRECT_CASCADING', value: 'NON_DIRECT_CASCADING' },
            { label: 'DIRECT_CASCADING', value: 'DIRECT_CASCADING' }
          ]
        }
      ],
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateSkp.execute(data.id, { ...values }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSkp({
            token: token,
            user_id: activeMenu.key
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit">
        {user?.isAdmin && (
          <Skeleton className="mb-4" loading={getAllUnitKerja.isLoading}>
            <Select placeholder="Pilih Unit Kerja" className="mb-4 w-full" value={selectedUnor} onChange={(value) => setSelectedUnor(value)}>
              {unitKerja?.map((item) => (
                <Select.Option key={item.id_simpeg} value={item.id_simpeg}>
                  {item.nama_unor}
                </Select.Option>
              ))}
            </Select>
          </Skeleton>
        )}
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
                  <Skeleton loading={getUserInUnit.isLoading}>
                    {userInUnit.length === 0 ? (
                      <Result status="warning" title="User dalam unor ini kosong" subTitle="Tidak ada data user yang tersedia untuk unor ini." />
                    ) : (
                      <>
                        <Menu items={menuItems} mode="horizontal" selectedKeys={[activeMenu]} onClick={handleMenuClick} className="mb-6" />
                        {skpUser?.map((item) => (
                          <>
                            <Descriptions size="default" column={3} bordered>
                              <Descriptions.Item label="Pendekatan">{item.pendekatan}</Descriptions.Item>
                              <Descriptions.Item label="Periode Mulai">{item.periode_start}</Descriptions.Item>
                              <Descriptions.Item label="Periode Akhir">{item.periode_end}</Descriptions.Item>
                              <Descriptions.Item label="Unit Kerja" span={3}>
                                {item.unit_id.nama_unor}
                              </Descriptions.Item>
                              <Descriptions.Item label="Status SKP" span={3}>
                                {(() => {
                                  switch (item.status) {
                                    case 'DRAFT':
                                      return <Badge status="processing" text="Draft" />;
                                    case 'SUBMITTED':
                                      return <Badge status="warning" text="Submitted" />;
                                    case 'REJECTED':
                                      return <Badge status="error" text="Rejected" />;
                                    case 'APPROVED':
                                      return <Badge status="success" text="Approved" />;
                                    default:
                                      return <Badge status="default" text={item.status} />;
                                  }
                                })()}
                              </Descriptions.Item>
                              <Descriptions.Item label="Jabatan" span={2}>
                                {item.posjab?.[0]?.nama_jabatan ?? ''}
                              </Descriptions.Item>
                              <Descriptions.Item label="Status Pegawai">{item.posjab?.[0]?.jabatan_status.nama ?? ''}</Descriptions.Item>
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
                              <Descriptions.Item label="Status SKP" span={3}>
                                {item.cascading !== null ? (
                                  <div className="inline-flex items-center gap-x-2">
                                    <CheckCircleFilled className="text-green-500" />
                                    {item.cascading}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-2">
                                    <CloseCircleFilled className="text-red-500" />
                                    Berlum Terverfikasi
                                    <Button onClick={() => handleVerify(item)} icon={<CheckOutlined />} variant="solid" color="primary">
                                      Verifikasi
                                    </Button>
                                  </div>
                                )}
                              </Descriptions.Item>
                            </Descriptions>
                          </>
                        ))}
                      </>
                    )}
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

export default VerificatePerjanjianKinerjas;
