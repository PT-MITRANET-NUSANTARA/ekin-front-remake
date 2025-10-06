import { useAuth, useService } from '@/hooks';
import { AuthService } from '@/services';
import { Avatar, Card, Descriptions, Skeleton, Typography } from 'antd';
import React from 'react';

const UserProfile = () => {
  const { token, user, photoProfile } = useAuth();
  const { execute, ...getAllDetailProfile } = useService(AuthService.getDetailProfile);
  const { execute: fetchSubordinate, ...getAllSubOrdinate } = useService(AuthService.getSubordinate);

  const detailProfile = getAllDetailProfile.data ?? null;
  const subordinate = getAllSubOrdinate.data ?? null;

  React.useEffect(() => {
    if (!user?.newNip) return;
    execute(token, user.newNip);
  }, [execute, token, user?.newNip]);

  React.useEffect(() => {
    if (!detailProfile?.unor?.id || !detailProfile?.unor?.induk?.id_simpeg) return;
    fetchSubordinate({ token: token, unit: detailProfile.unor.induk.id_simpeg, unor: detailProfile.unor.id });
  }, [detailProfile, fetchSubordinate, token]);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-12 flex w-full flex-col gap-y-4 lg:col-span-4">
        <Card className="w-full" cover={<img src="/image_asset/card_background.png" />}>
          <div className="relative px-4">
            <div className="absolute -top-16 rounded-full bg-white p-1 shadow-md">
              <Avatar size={90} src={photoProfile} style={{ color: 'black' }} className="shadow-md" />
            </div>
          </div>
          <div className="mt-12 px-4">
            <Skeleton loading={getAllDetailProfile.isLoading}>
              <Typography.Title level={5}>{detailProfile?.nama_asn}</Typography.Title>
              <Typography.Text>{detailProfile?.nip_asn}</Typography.Text>
            </Skeleton>
          </div>
        </Card>
        <Skeleton loading={getAllSubOrdinate.isLoading} avatar>
          {(user?.isJpt ? subordinate : subordinate?.slice(1))?.map((item) => (
            <Card key={item.id}>
              <div className="inline-flex gap-x-4">
                <div className="h-fit w-fit rounded-full bg-white p-1 shadow-md">
                  <Avatar size="large" className="shadow-md">
                    U
                  </Avatar>
                </div>
                <div className="flex flex-col gap-y-1">
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {item?.nama_asn} {`(${item?.jenis_asn})`}
                  </Typography.Title>
                  <p className="text-xs">{item?.nip_asn}</p>
                  <p className="text-xs">{item?.nama_jabatan}</p>
                </div>
              </div>
            </Card>
          ))}
        </Skeleton>
      </div>
      <div className="col-span-12 flex flex-col gap-y-4 lg:col-span-8">
        <Card>
          <Skeleton loading={getAllDetailProfile.isLoading}>
            <Descriptions bordered column={4}>
              <Descriptions.Item label="Jenis ASN" span={2}>
                {detailProfile?.jenis_asn}
              </Descriptions.Item>
              <Descriptions.Item label="TMT Jabatan" span={2}>
                {detailProfile?.tmt_jabatan}
              </Descriptions.Item>
              <Descriptions.Item label="Pejabat SK" span={2}>
                {detailProfile?.pejabat_sk}
              </Descriptions.Item>
              <Descriptions.Item label="Nomor SK" span={2}>
                {detailProfile?.nomor_sk}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal SK" span={2}>
                {detailProfile?.tgl_sk}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Jabatan" span={4}>
                {detailProfile?.nama_jabatan}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </Card>
        <Card>
          <Skeleton loading={getAllDetailProfile.isLoading}>
            <Descriptions bordered column={3}>
              <Descriptions.Item label="Nama Unor" span={3}>
                {detailProfile?.unor?.nama}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Jabatan">{detailProfile?.jenis_jabatan?.nama}</Descriptions.Item>
              <Descriptions.Item label="Status Jabatan">{detailProfile?.jabatan_status?.nama}</Descriptions.Item>
              <Descriptions.Item label="Eselon">{detailProfile?.eselon?.nama}</Descriptions.Item>
              <Descriptions.Item label="Golongan PNS">{detailProfile?.golongan_pns?.nama}</Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </Card>
        <Card>
          <Skeleton loading={getAllDetailProfile.isLoading}>
            <Descriptions bordered column={3}>
              <Descriptions.Item label="Nama Atasan" span={3}>
                {detailProfile?.unor?.atasan?.asn?.nama_atasan}
              </Descriptions.Item>
              <Descriptions.Item label="Unor Atasan" span={3}>
                {detailProfile?.unor?.atasan?.unor_nama}
              </Descriptions.Item>
              <Descriptions.Item label="Jabatan Atasan" span={3}>
                {detailProfile?.unor?.atasan?.unor_jabatan}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
