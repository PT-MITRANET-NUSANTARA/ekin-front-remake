import { Delete, Edit } from '@/components/dashboard/button';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { RktsService } from '@/services';
import { Card, Space } from 'antd';
import React from 'react';
import { SubActivities as SubActivityModel } from '@/models';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import { indicatorFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const Rkts = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchRktDetail, ...getDetailRkt } = useService(RktsService.getById);
  const updateRkt = useService(RktsService.update);
  const [inputIndicators, setInputndicators] = React.useState([]);
  const [outputIndicators, setOutputIndicators] = React.useState([]);
  const [outcomeIndicators, setOutcomeIndicators] = React.useState([]);

  React.useEffect(() => {
    fetchRktDetail(token, id);
  }, [fetchRktDetail, id, token]);

  const detailRkt = React.useMemo(() => getDetailRkt.data ?? [], [getDetailRkt.data]);

  React.useEffect(() => {
    if (detailRkt) {
      setInputndicators(detailRkt.input_indikator_kinerja);
      setOutputIndicators(detailRkt.output_indikator_kinerja);
      setOutcomeIndicators(detailRkt.outcome_indikator_kinerja);
    }
  }, [detailRkt]);

  const getColumns = (type) => {
    const baseColumns = [
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
      baseColumns.push({
        title: 'Aksi',
        render: (_, record) => (
          <Space size="small">
            <Edit title={`Edit ${Modul.SUBACTIVITY}`} model={SubActivityModel} onClick={() => onEdit(type, record)} />
            <Delete title={`Delete ${Modul.SUBACTIVITY}`} model={SubActivityModel} onClick={() => onDelete(type, record)} />
          </Space>
        )
      });
    }

    return baseColumns;
  };

  const onDelete = (type, record) => {
    modal.delete.default({
      title: `Hapus Indikator`,
      data: record,
      onSubmit: async () => {
        let updatedIndicators = [];

        if (type === 'input') {
          updatedIndicators = inputIndicators.filter((item) => item.id !== record.id);
        } else if (type === 'output') {
          updatedIndicators = outputIndicators.filter((item) => item.id !== record.id);
        } else if (type === 'outcome') {
          updatedIndicators = outcomeIndicators.filter((item) => item.id !== record.id);
        }

        const payload = {
          ...detailRkt,
          id_sub_kegiatan: detailRkt.id_sub_kegiatan.map((item) => item.id),
          input_indikator_kinerja: inputIndicators ?? [],
          output_indikator_kinerja: outputIndicators ?? [],
          outcome_indikator_kinerja: outcomeIndicators ?? []
        };

        // replace yang sesuai
        if (type === 'input') payload.input_indikator_kinerja = updatedIndicators;
        if (type === 'output') payload.output_indikator_kinerja = updatedIndicators;
        if (type === 'outcome') payload.outcome_indikator_kinerja = updatedIndicators;

        const { isSuccess, message } = await updateRkt.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchRktDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const onEdit = (type, record) => {
    modal.edit({
      title: `Ubah ${type} indikator`,
      formFields: indicatorFormFields(),
      data: { ...record },
      onSubmit: async (values) => {
        // pilih indikator sesuai type
        let updatedInput = inputIndicators ?? [];
        let updatedOutput = outputIndicators ?? [];
        let updatedOutcome = outcomeIndicators ?? [];

        if (type === 'input') {
          updatedInput = updatedInput.map((item) => (item.id === record.id ? { ...item, ...values } : item));
        } else if (type === 'output') {
          updatedOutput = updatedOutput.map((item) => (item.id === record.id ? { ...item, ...values } : item));
        } else if (type === 'outcome') {
          updatedOutcome = updatedOutcome.map((item) => (item.id === record.id ? { ...item, ...values } : item));
        }

        const payload = {
          ...detailRkt,
          id_sub_kegiatan: detailRkt.id_sub_kegiatan.map((item) => item.id),
          input_indikator_kinerja: updatedInput,
          output_indikator_kinerja: updatedOutput,
          outcome_indikator_kinerja: updatedOutcome
        };

        const { isSuccess, message } = await updateRkt.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchRktDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const onCreate = (type) => {
    modal.create({
      title: `Tambah ${type} indikator`,
      formFields: indicatorFormFields(),
      onSubmit: async (values) => {
        let payload = {
          ...detailRkt,
          id_sub_kegiatan: detailRkt.id_sub_kegiatan.map((item) => item.id),
          input_indikator_kinerja: inputIndicators ?? [],
          output_indikator_kinerja: outputIndicators ?? [],
          outcome_indikator_kinerja: outcomeIndicators ?? []
        };

        if (type === 'input') {
          payload.input_indikator_kinerja = [...(inputIndicators || []), values];
        } else if (type === 'output') {
          payload.output_indikator_kinerja = [...(outputIndicators || []), values];
        } else if (type === 'outcome') {
          payload.outcome_indikator_kinerja = [...(outcomeIndicators || []), values];
        }

        const { isSuccess, message } = await updateRkt.execute(id, payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchRktDetail(token, id);
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <DataTableHeader onStore={() => onCreate('input')} modul={`Rkt ${detailRkt?.nama ?? ''}- Input`} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={inputIndicators ?? []} columns={getColumns('input')} loading={getDetailRkt.isLoading} map={(innput) => ({ key: innput.id, ...innput })} />
        </div>
      </Card>
      <Card>
        <DataTableHeader onStore={() => onCreate('output')} modul={`Rkt ${detailRkt?.nama ?? ''}- Output`} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={outputIndicators ?? []} columns={getColumns('output')} loading={getDetailRkt.isLoading} map={(output) => ({ key: output.id, ...output })} />
        </div>
      </Card>
      <Card>
        <DataTableHeader onStore={() => onCreate('outcome')} modul={`Rkt ${detailRkt?.nama ?? ''}- Outcome`} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={outcomeIndicators ?? []} columns={getColumns('output')} loading={getDetailRkt.isLoading} map={(outcome) => ({ key: outcome.id, ...outcome })} />
        </div>
      </Card>
    </div>
  );
};

export default Rkts;
