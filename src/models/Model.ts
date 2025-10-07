type ModelKeys = 'visi' | 'misi' | 'renstra' | 'tujuan' | 'program' | 'kegiatan' | 'subkegiatan' | 'penduduk' | 'rkt' | 'periode_penilaian' | 'perjanjian_kinerja';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    visi: undefined,
    misi: undefined,
    renstra: undefined,
    tujuan: undefined,
    program: undefined,
    kegiatan: undefined,
    subkegiatan: undefined,
    penduduk: undefined,
    rkt: undefined,
    periode_penilaian: undefined,
    perjanjian_kinerja: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
