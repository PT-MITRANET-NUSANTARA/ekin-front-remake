import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';

export interface IncomingApiData {
  id: string;
  name: string;
  unit_id: number;
  label: 'KINERJA_BERBASIS_ANGGARAN' | 'KINERJA_NON_ANGGARAN';
  total_anggaran: number;
  renstra_id: string;
  sub_kegiatan_id: {
    id: string;
    name: string;
    unit_id: number;
    total_anggaran: number;
  }[];
  input_indikator_kinerja: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  output_indikator_kinerja: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  outcome_indikator_kinerja: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  name: string;
  unit_id: number;
  label: string;
  total_anggaran: number;
  renstra_id: string;
  sub_kegiatan_id: string[];
  input_indikator_kinerja: {
    name: string;
    target: string;
    satuan: string;
  }[];
  output_indikator_kinerja: {
    name: string;
    target: string;
    satuan: string;
  }[];
  outcome_indikator_kinerja: {
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
    public id_unit: number,
    public label: 'KINERJA_BERBASIS_ANGGARAN' | 'KINERJA_NON_ANGGARAN',
    public total_anggaran: number,
    public id_renstra: string,
    public id_sub_kegiatan: {
      id: string;
      nama: string;
      id_unit: number;
      total_anggaran: number;
    }[],
    public input_indikator_kinerja: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public output_indikator_kinerja: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public outcome_indikator_kinerja: {
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
      apiData.unit_id,
      apiData.label,
      Number(apiData.total_anggaran),
      apiData.renstra_id,
      apiData.sub_kegiatan_id.map((item) => ({
        id: item.id,
        nama: item.name,
        total_anggaran: item.total_anggaran,
        id_unit: item.unit_id
      })),
      apiData.input_indikator_kinerja.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.output_indikator_kinerja.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.outcome_indikator_kinerja.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Rkts>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(rkts: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(rkts)) return rkts.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: rkts.nama,
      unit_id: rkts.id_unit,
      label: rkts.label,
      total_anggaran: rkts.total_anggaran,
      renstra_id: rkts.id_renstra,
      sub_kegiatan_id: rkts.id_sub_kegiatan,
      input_indikator_kinerja: rkts.input_indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      output_indikator_kinerja: rkts.output_indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      outcome_indikator_kinerja: rkts.outcome_indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
