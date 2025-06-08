type ModelKeys =
  | 'profil_desa'
  | 'dusun'
  | 'visi_misi'
  | 'perangkat_desa'
  | 'lembaga_desa'
  | 'jabatan'
  | 'anggota_lembaga'
  | 'penduduk'
  | 'keluarga'
  | 'calon_pemilih'
  | 'statistik_penduduk'
  | 'artikel'
  | 'laporan_apbd'
  | 'item_apbd'
  | 'bantuan'
  | 'anggota_bantuan'
  | 'potensi_desa'
  | 'pemetaan'
  | 'produk_hukum'
  | 'permohonan_surat'
  | 'jenis_surat'
  | 'atribut_surat'
  | 'template_surat'
  | 'pengguna';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    profil_desa: undefined,
    dusun: undefined,
    visi_misi: undefined,
    perangkat_desa: undefined,
    lembaga_desa: undefined,
    jabatan: undefined,
    anggota_lembaga: undefined,
    penduduk: undefined,
    keluarga: undefined,
    calon_pemilih: undefined,
    statistik_penduduk: undefined,
    artikel: undefined,
    laporan_apbd: undefined,
    item_apbd: undefined,
    bantuan: undefined,
    anggota_bantuan: undefined,
    potensi_desa: undefined,
    pemetaan: undefined,
    produk_hukum: undefined,
    permohonan_surat: undefined,
    jenis_surat: undefined,
    atribut_surat: undefined,
    template_surat: undefined,
    pengguna: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
