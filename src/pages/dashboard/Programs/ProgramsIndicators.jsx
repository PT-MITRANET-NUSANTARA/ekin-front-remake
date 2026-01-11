import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { ProgramsService } from '@/services';
import { Card, Descriptions, Space } from 'antd';
import React from 'react';
import { Programs as ProgramModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { indicatorFormFields } from './FormFields';
import { useParams } from 'react-router-dom';
import { rupiahFormat } from '@/utils/rupiahFormat';

const ProgramsIndicators = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchProgramDetail, ...getDetailProgram } = useService(ProgramsService.getById);
  const updatePrograms = useService(ProgramsService.update);
  const [indicators, setIndicators] = React.useState([]);

  React.useEffect(() => {
    fetchProgramDetail(token, id);
  }, [fetchProgramDetail, id, token]);

  const detailProgram = React.useMemo(() => getDetailProgram.data ?? [], [getDetailProgram.data]);

  React.useEffect(() => {
    if (detailProgram) {
      setIndicators(detailProgram.indikator_kinerja);
    }
  }, [detailProgram]);

  const column = [
    {
      title: 'Nama Indikator',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Target Indikator',
      dataIndex: 'target',
      sorter: (a, b) => a.target.length - b.target.length,
      searchable: true
    },
    {
      title: 'Satuan Indikator',
      dataIndex: 'satuan',
      sorter: (a, b) => a.satuan.length - b.satuan.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.PROGRAM}`}
            model={ProgramModel}
            onClick={() => {
              modal.edit({
                title: `Ubah Indikator`,
                formFields: indicatorFormFields(),
                data: { ...record },
                onSubmit: async (values) => {
                  const updatedIndicators = indicators.map((item) => (item.id === record.id ? { ...item, ...values } : item));

                  const payload = {
                    nama: detailProgram.nama,
                    id_tujuan: detailProgram.id_tujuan.id,
                    total_anggaran: detailProgram.total_anggaran,
                    id_unit: detailProgram.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updatePrograms.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchProgramDetail(token, id);
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.PROGRAM}`}
            model={ProgramModel}
            onClick={() => {
              modal.delete.default({
                title: `Hapus Indikator`,
                data: record,
                onSubmit: async () => {
                  const updatedIndicators = indicators.filter((item) => item.id !== record.id);

                  const payload = {
                    nama: detailProgram.nama,
                    id_tujuan: detailProgram.id_tujuan.id,
                    total_anggaran: detailProgram.total_anggaran,
                    id_unit: detailProgram.id_unit.id_simpeg,
                    indikator_kinerja: updatedIndicators
                  };

                  const { isSuccess, message } = await updatePrograms.execute(id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchProgramDetail(token, id);
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.PROGRAM}`,
      formFields: indicatorFormFields(),
      onSubmit: async (values) => {
        const payload = {
          nama: detailProgram.nama,
          id_tujuan: detailProgram.id_tujuan.id,
          total_anggaran: detailProgram.total_anggaran,
          id_unit: detailProgram.id_unit.id_simpeg,
          indikator_kinerja: [...(indicators || []), values]
        };

        const { isSuccess, message } = await updatePrograms.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchProgramDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={detailProgram?.nama ?? ''} />
      <Descriptions size="default" column={2} bordered className="mb-4">
        <Descriptions.Item label="Unit Kerja">{detailProgram?.id_unit?.nama_unor}</Descriptions.Item>
        <Descriptions.Item label="Judul Program">{detailProgram?.nama}</Descriptions.Item>
        <Descriptions.Item label="Tujuan">{detailProgram?.id_tujuan?.nama}</Descriptions.Item>
        <Descriptions.Item label="Total Anggaran">{rupiahFormat(detailProgram.total_anggaran)}</Descriptions.Item>
      </Descriptions>
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={indicators ?? []} columns={column} loading={getDetailProgram.isLoading} map={(goals) => ({ key: goals.id, ...goals })} />
      </div>
    </Card>
  );
};

export default ProgramsIndicators;
