import { DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { PerjanjianKinerjaService, RenstrasService, SkpsService, UnitKerjaService } from '@/services';
import { CheckCircleFilled, CheckSquareOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, InfoCircleOutlined, PaperClipOutlined, TableOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Alert, Badge, Button, Card, Descriptions, Skeleton } from 'antd';
import React from 'react';
import { formFields, perjanjianKinerjaFormFields, skpFilterFields } from './FormFields';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { InputType } from '@/constants';

const Skps = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllSkps } = useService(SkpsService.getAll);
  const { execute: fetchRenstras, ...getAllRenstras } = useService(RenstrasService.getAll);
  const { execute: fetchUnitKerja, ...getAllUnitKerja } = useService(UnitKerjaService.getAll);
  const deleteSkp = useService(SkpsService.delete);
  const downloadPerjanjianKinerja = useService(PerjanjianKinerjaService.download);
  const storePerjanjianKinerja = useService(PerjanjianKinerjaService.store);
  const deletePerjanjianKinerja = useService(PerjanjianKinerjaService.delete);
  const storeSkp = useService(SkpsService.store);
  const updateSkp = useService(SkpsService.update);
  const [filterValues, setFilterValues] = React.useState({
    unit_id: user?.isAdmin || user?.umpegs?.length ? [] : user?.unor.id,
    search: ''
  });
  const pagination = usePagination({ totalData: getAllSkps.totalData });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user?.newNip) return;
    execute({
      token,
      user_id: user.newNip,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      unit_id: user?.isAdmin || user?.umpegs ? filterValues.unit_id : user?.unor.id
    });

    fetchRenstras({ token: token });
    fetchUnitKerja({ token: token });
  }, [execute, fetchRenstras, fetchUnitKerja, filterValues.search, filterValues.unit_id, pagination.page, pagination.per_page, token, user?.isAdmin, user?.newNip, user?.umpegs, user?.unor.id]);

  const skps = getAllSkps.data ?? [];
  const renstras = getAllRenstras.data ?? [];
  const unitKerja = getAllUnitKerja.data ?? [];

  const onEdit = (data) => {
    modal.edit({
      title: `Ubah ${Modul.SKP}`,
      formFields: formFields,
      data: { ...data, tanggal_mulai: dayjs(data.periode_start), tanggal_selesai: dayjs(data.periode_end) },
      onSubmit: async (values) => {
        const { isSuccess, message } = await updateSkp.execute(data.id, { ...values, id_user: user.newNip }, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onDelete = (data) => {
    modal.delete.default({
      title: `Delete ${Modul.VISION}`,
      data: data,
      onSubmit: async () => {
        const { isSuccess, message } = await deleteSkp.execute(data.id, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.SKP}`,
      formFields: formFields({ options: { renstras: renstras } }),
      onSubmit: async (values) => {
        const { isSuccess, message } = await storeSkp.execute({ ...values, id_user: user.newNip }, token);
        if (isSuccess) {
          success('Berhasil', message);
          execute({
            token,
            user_id: user.newNip,
            page: pagination.page,
            per_page: pagination.per_page,
            search: filterValues.search
          });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: [
      ...skpFilterFields(),
      ...(user?.isAdmin || user?.umpegs?.length
        ? [
            {
              label: `Nama Unit`,
              name: 'unit_id',
              type: InputType.SELECT,
              mode: 'multiple',
              options: user?.isAdmin
                ? unitKerja.map((item) => ({
                    label: item.nama_unor,
                    value: item.id_simpeg
                  }))
                : user.umpegs.map((item) => ({
                    label: item.unit.nama_unor,
                    value: item.unit.id_simpeg
                  }))
            }
          ]
        : [])
    ],
    initialData: {
      unit_id: filterValues.unit_id
    },
    isLoading: getAllSkps.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        ...filterValues,
        unit_id: user?.isAdmin || user?.umpegs?.length ? values.unit_id : user?.unor.id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader filter={filter} modul={Modul.SKP} {...(user?.isJpt ? { onStore: onCreate } : {})} onSearch={(values) => setFilterValues({ search: values })} />
      <Skeleton loading={getAllSkps.isLoading}>
        <div className="flex w-full max-w-full flex-col gap-y-6 overflow-x-auto">
          {skps.map((item) => (
            <Card key={item.id}>
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
                <Descriptions.Item label="Jenis Pegawai">{item.posjab?.[0]?.jenis_asn ?? ''}</Descriptions.Item>
                {user.pimpinan && (
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
                                execute({
                                  token,
                                  user_id: user.newNip,
                                  page: pagination.page,
                                  per_page: pagination.per_page,
                                  search: filterValues.search
                                });
                              } else {
                                error('Gagal', message);
                              }
                              return isSuccess;
                            }}
                          >
                            {pk_item.id}
                          </Button>
                          <Button
                            variant="text"
                            color="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              modal.delete.default({
                                title: `Delete ${Modul.PERJANJIAN_KINERJA}`,
                                onSubmit: async () => {
                                  const { isSuccess, message } = await deletePerjanjianKinerja.execute(pk_item.id, token);
                                  if (isSuccess) {
                                    success('Berhasil', message);
                                    execute({
                                      token,
                                      user_id: user.newNip,
                                      page: pagination.page,
                                      per_page: pagination.per_page,
                                      search: filterValues.search
                                    });
                                  } else {
                                    error('Gagal', message);
                                  }
                                  return isSuccess;
                                }
                              });
                            }}
                          />
                        </div>
                      ))}
                      {!item.perjanjian_kinerja.length && <Alert message="Mohon upload perjanjian kinerja terlebih dahulu" type="warning" showIcon />}
                      <hr />
                      <div className="flex gap-x-2">
                        <Button
                          className="w-fit"
                          variant="solid"
                          color="primary"
                          onClick={() => {
                            modal.create({
                              title: `Tambah ${Modul.PERJANJIAN_KINERJA}`,
                              formFields: perjanjianKinerjaFormFields,
                              onSubmit: async (values) => {
                                const { isSuccess, message } = await storePerjanjianKinerja.execute({ ...values, unit_id: item.posjab[0].unor.induk.id_simpeg, unor_id: item.posjab[0].unor.id, skp_id: item.id }, token, values.file.file);
                                if (isSuccess) {
                                  success('Berhasil', message);
                                  execute({
                                    token,
                                    user_id: user.newNip,
                                    page: pagination.page,
                                    per_page: pagination.per_page,
                                    search: filterValues.search
                                  });
                                } else {
                                  error('Gagal', message);
                                }
                                return isSuccess;
                              }
                            });
                          }}
                        >
                          Tambah
                        </Button>
                        <Button
                          className="w-fit"
                          variant="solid"
                          color="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            navigate('/dashboard/perjanjian-kinerja-template');
                          }}
                        >
                          Template
                        </Button>
                      </div>
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
              <div className="mt-4 flex w-full items-center justify-between">
                <div className="inline-flex items-center gap-x-2">
                  <Button size="small" variant="filled" color="primary" icon={<InfoCircleOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id)}>
                    Detail SKP
                  </Button>
                  {user?.pimpinan && (
                    <Button disabled={!item.perjanjian_kinerja.length} size="small" variant="filled" color="primary" icon={<TableOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/matriks')}>
                      Matriks Peran Hasil
                    </Button>
                  )}
                  {user?.pimpinan && (
                    <Button disabled={!item.perjanjian_kinerja.length} size="small" variant="filled" color="primary" icon={<UserSwitchOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/skp_bawahan')}>
                      SKP Bawahan
                    </Button>
                  )}
                  <Button disabled={!item.perjanjian_kinerja.length} size="small" variant="filled" color="primary" icon={<CheckSquareOutlined />} onClick={() => navigate(window.location.pathname + '/' + item.id + '/assessment_periods')}>
                    Penilaian
                  </Button>
                </div>
                <div className="inline-flex items-center gap-x-2">
                  {user.isJpt && (
                    <>
                      <Button disabled={item.status !== 'DRAFT'} variant="solid" color="primary" icon={<EditOutlined />} onClick={() => onEdit(item)}>
                        Edit
                      </Button>
                      <Button variant="solid" color="danger" icon={<DeleteOutlined />} onClick={() => onDelete(item)}>
                        Hapus
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Skeleton>
    </Card>
  );
};

export default Skps;
