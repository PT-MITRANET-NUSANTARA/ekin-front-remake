import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';

export interface IncomingApiData {
  id: string;
  name: string;
  unitId: string;
  label?: 'Kinerja Berbasis Anggaran' | 'Kinerja Berbasis Non-Anggaran' | null;
  total_anggaran: number;
  renstraId: string;
  renstra: {
    id: string;
    name: string;
    desc: string;
    startDate: string;
    endDate: string;
    unitId: string;
    createdAt: string;
    updatedAt: string;
  };
  subKegiatan: {
    id: string;
    name: string;
    unitId: string;
    total_anggaran: number;
  }[];
  input: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  output: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  outcome: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  unitId: number;
  label: string;
  total_anggaran: number;
  renstraId: string;
  subKegiatan: string[];
  input: {
    name: string;
    target: string;
    satuan: string;
  }[];
  output: {
    name: string;
    target: string;
    satuan: string;
  }[];
  outcome: {
    name: string;
    target: string;
    satuan: string;
  }[];
}

interface FormValue {
  nama: string;
  id_unit: number;
  label: string;
  total_anggaran: number;
  id_renstra: string;
  id_sub_kegiatan: string[];
  input_indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
  output_indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
  outcome_indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Rkts extends Model {
  constructor(
    public id: string,
    public nama: string,
    public id_unit: string,
    public label: 'Kinerja Berbasis Anggaran' | 'Kinerja Berbasis Non-Anggaran' | null,
    public total_anggaran: number,
    public id_renstra: string,
    public renstra: {
      id: string;
      nama: string;
      deskripsi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      id_unit: string;
      created_at: string;
      updated_at: string;
    },
    public id_sub_kegiatan: {
      id: string;
      nama: string;
      id_unit: string;
      total_anggaran: number;
    }[],
    public input: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public output: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public outcome: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }
  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Rkts> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Rkts>;
    return new Rkts(
      apiData.id,
      apiData.name,
      apiData.unitId,
      apiData.label || 'KINERJA_NON_ANGGARAN',
      Number(apiData.totalAnggaran),
      apiData.renstraId,
      {
        id: apiData.renstra?.id || '',
        nama: apiData.renstra?.name || '',
        deskripsi: apiData.renstra?.desc || '',
        tanggal_mulai: apiData.renstra?.startDate || '',
        tanggal_selesai: apiData.renstra?.endDate || '',
        id_unit: apiData.renstra?.unitId || '',
        created_at: apiData.renstra?.createdAt || '',
        updated_at: apiData.renstra?.updatedAt || ''
      },
      apiData.subKegiatan?.map((item) => ({
        id: item.id,
        nama: item.name,
        total_anggaran: item.totalAnggaran,
        id_unit: item.unitId
      })) || [],
      apiData.input?.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })) || [],
      apiData.output?.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })) || [],
      apiData.outcome?.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })) || [],
      apiData.createdAt,
      apiData.updatedAt
    ) as ReturnType<T, IncomingApiData, Rkts>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(rkts: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(rkts)) return rkts.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    // Handle both array of IDs (from form) and array of objects (from edit)
    const subKegiatanIds = Array.isArray(rkts.id_sub_kegiatan)
      ? rkts.id_sub_kegiatan.map((item) => (typeof item === 'string' ? item : item.id))
      : [];
    const apiData: OutgoingApiData = {
      name: rkts.nama,
      unitId: Number(rkts.id_unit),
      label: rkts.label,
      totalAnggaran: rkts.total_anggaran,
      renstraId: rkts.id_renstra,
      subKegiatan: subKegiatanIds,
      input: (rkts.input_indikador_kinerja ?? []).map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      output: (rkts.output_indikador_kinerja ?? []).map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      outcome: (rkts.outcome_indikador_kinerja ?? []).map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
