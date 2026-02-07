export const PERJANJIAN_KINERJA_TEMPLATE = `
<p style="line-height: 1;">
  <img
    style="width: 85px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;"
    src="/perjanjian-kinerja/pohuwato.jpg"
    height="83"
  />
</p>

<h3 style="text-align: center; line-height: 1;">PERJANJIAN KINERJA {{tahun}}</h3>
<h4 style="text-align: center; line-height: 1;">
  Dinas Komunikasi dan Informatika - KABUPATEN POHUWATO
</h4>

<hr />

<p style="text-align: justify;">
  Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan, dan akuntabel serta berorientasi pada hasil, kami yang bertanda tangan di bawah ini:
</p>

<table
  style="width: 100%; border-collapse: collapse; border: none !important; outline: none !important;"
>
  <tbody>
  <tr>
    <td style="width: 20%; border: none !important; outline: none !important;">
      Nama
    </td>
    <td style="width: 3%; border: none !important; outline: none !important;">
      :
    </td>
    <td style="width: 77%; border: none !important; outline: none !important;">
      {{nama_asn}}
    </td>
  </tr>
  <tr>
    <td style="width: 20%; border: none !important; outline: none !important;">
      Jabatan
    </td>
    <td style="width: 3%; border: none !important; outline: none !important;">
      :
    </td>
    <td style="width: 77%; border: none !important; outline: none !important;">
      {{jabatan_asn}}
    </td>
  </tr>
</tbody>

</table>

<p style="text-align: justify;">
  Selanjutnya disebut <strong>Pihak Pertama</strong>
</p>

<table
  style="width: 100%; border-collapse: collapse; border: none !important; outline: none !important;"
>
  <tbody>
  <tr>
    <td style="width: 20%; border: none !important; outline: none !important;">
      Nama
    </td>
    <td style="width: 3%; border: none !important; outline: none !important;">
      :
    </td>
    <td style="width: 77%; border: none !important; outline: none !important;">
      {{nama_atasan}}
    </td>
  </tr>
  <tr>
    <td style="width: 20%; border: none !important; outline: none !important;">
      Jabatan
    </td>
    <td style="width: 3%; border: none !important; outline: none !important;">
      :
    </td>
    <td style="width: 77%; border: none !important; outline: none !important;">
      {{jabatan_atasan}}
    </td>
  </tr>
</tbody>
</table>

<p style="text-align: justify;">
  Selaku atasan langsung pihak pertama, selanjutnya disebut <strong>Pihak Kedua</strong>
</p>

<p style="text-align: justify;">
  Pihak pertama berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan. Keberhasilan dan kegagalan pencapaian target kinerja tersebut menjadi tanggung jawab kami.
</p>

<p style="text-align: justify;">
  Pihak kedua akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi terhadap capaian kinerja dari perjanjian ini dan mengambil tindakan yang diperlukan dalam rangka pemberian penghargaan dan sanksi.
</p>

<table
  style="width: 100%; margin-top: 60px; text-align: center; border-collapse: collapse; border: none !important; outline: none !important;"
>
  <tbody>
    <tr>
      <td style="border: none !important; outline: none !important;">
        Pegawai yang dinilai<br /><br /><br /><br />
        {{nama_asn}}<br /><br />
        <strong>{{jabatan_asn}}</strong>
      </td>
      <td style="border: none !important; outline: none !important;">
        Pejabat penilai kinerja<br /><br /><br /><br />
        I{{nama_atasan}}<br /><br />
        <strong>{{jabatan_atasan}}</strong>
      </td>
    </tr>
  </tbody>
</table>
`;

export const SKP_KINERJA_TEMPLATE = (data) => {
  const utama = data.rhk
    .filter((item) => item.jenis === 'UTAMA')
    .map((rhk, rhkIndex) => {
      const aspekRows = (rhk.aspek || [])
        .map(
          (aspek) => `
          <tr>
            <td style="font-family: terminal, monaco, monospace;">${aspek.jenis}</td>
            <td style="font-family: terminal, monaco, monospace;">${aspek.indikator?.name ?? ''}</td>
            <td style="font-family: terminal, monaco, monospace;">${aspek.target_tahunan?.target ?? ''}${aspek.target_tahunan?.satuan ?? ''}</td>
          </tr>
        `
        )
        .join('');

      return `
        <tr>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">${rhkIndex + 1}</td>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">
            <p style="font-family: terminal, monaco, monospace;">${rhk.desc}</p>
          </td>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">
            <p style="font-family: terminal, monaco, monospace;">${rhk.desc}</p>
            ${rhk.klasifikasi ?? ''}
          </td>
        </tr>
        ${aspekRows}
      `;
    })
    .join('');

  const tambahan = data.rhk
    .filter((item) => item.jenis === 'TAMBAHAN')
    .map((rhk, rhkIndex) => {
      const aspekRows = (rhk.aspek || [])
        .map(
          (aspek) => `
          <tr style="font-family: terminal, monaco, monospace;">
            <td style="font-family: terminal, monaco, monospace;">${aspek.jenis}</td>
            <td style="font-family: terminal, monaco, monospace;">${aspek.indikator?.name ?? ''}</td>
            <td style="font-family: terminal, monaco, monospace;">${aspek.target_tahunan?.target ?? ''}${aspek.target_tahunan?.satuan ?? ''}</td>
          </tr>
        `
        )
        .join('');

      return `
        <tr>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">${rhkIndex + 1}</td>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">
            <p style="font-family: terminal, monaco, monospace;">${rhk.desc}</p>
          </td>
          <td rowspan="${(rhk.aspek?.length ?? 0) + 1}" style="font-family: terminal, monaco, monospace;">
            <p style="font-family: terminal, monaco, monospace;">${rhk.desc}</p>
            ${rhk.klasifikasi ?? ''}
          </td>
        </tr>
        ${aspekRows}
      `;
    })
    .join('');

  return `
    <table border="1" style="width:100%; border-collapse:collapse;" style="font-family: terminal, monaco, monospace;">
      <tbody style="font-family: terminal, monaco, monospace;">
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;">NO</th>
          <th style="font-family: terminal, monaco, monospace;">RENCANA HASIL KERJA PIMPINAN</th>
          <th style="font-family: terminal, monaco, monospace;">RENCANA HASIL KERJA</th>
          <th style="font-family: terminal, monaco, monospace;">ASPEK</th>
          <th style="font-family: terminal, monaco, monospace;">INDIKATOR</th>
          <th style="font-family: terminal, monaco, monospace;">TARGET</th>
        </tr>

        <tr><td colspan="6"><strong style="font-family: terminal, monaco, monospace;">Utama</strong></td></tr>
        ${utama}

        <tr><td colspan="6"><strong style="font-family: terminal, monaco, monospace;">Tambahan</strong></td></tr>
        ${tambahan}
      </tbody>
    </table>
  `;
};

export const SKP_PERILAKU_TEMPLATE = (data) => {
  const rows = (data.perilaku_id || [])
    .map(
      (perilaku, index) => `
      <tr>
        <td style="width: 4.23302%; border-width: 1px;" style="font-family: terminal, monaco, monospace;">${index + 1}</td>
        <td style="width: 69.5424%; border-width: 1px;" style="font-family: terminal, monaco, monospace;">
          <div style="font-family: terminal, monaco, monospace;">
            <strong style="font-family: terminal, monaco, monospace;">${perilaku.name}</strong>
            <ol style="font-family: terminal, monaco, monospace;">
              ${(perilaku.content || []).map((item) => `<li style="font-family: terminal, monaco, monospace;">${item}</li>`).join('')}
            </ol>
          </div>
        </td>
        <td style="width: 26.2044%; border-width: 1px;" style="font-family: terminal, monaco, monospace;">&nbsp;</td>
      </tr>
    `
    )
    .join('');

  return `
    <table style="width: 100%; border-collapse: collapse;" border="1" style="font-family: terminal, monaco, monospace;">
      <tbody style="font-family: terminal, monaco, monospace;">
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="width: 4.23302%;" style="font-family: terminal, monaco, monospace;">NO</th>
          <th style="width: 69.5424%;" style="font-family: terminal, monaco, monospace;">PERILAKU KERJA</th>
          <th style="width: 26.2044%;" style="font-family: terminal, monaco, monospace;">EKSPEKTASI KHUSUS PIMPINAN</th>
        </tr>
        ${rows}
      </tbody>
    </table>
  `;
};

export const SKP_PENILAIAN_COVER_TEMPLAT = `
<p><img style="width: 85px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;" src="../../../../image_asset/garuda.png" height="83"></p>
<p style="text-align: center;"><span style="font-size: 18px; font-family: 'times new roman', times, serif;"><strong>PENILAIAN PRESTASI KERJA</strong></span><br><span style="font-size: 18px; font-family: 'times new roman', times, serif;"><strong>PEGAWAI NEGERI SIPIL</strong></span></p>
<p style="text-align: center;"><br><span style="font-family: 'times new roman', times, serif;"><strong>Jangka Waktu Penilaian</strong></span><br><span style="font-family: 'times new roman', times, serif;"><strong>{{periode_penilaian}}</strong></span></p>
<p style="text-align: center;">&nbsp;</p>
<table style="border-collapse: collapse; width: 66.8347%; height: 201.6px; margin-left: auto; margin-right: auto;" border="0">
   <colgroup>
      <col style="width: 37.7152%;">
      <col style="width: 62.2848%;">
   </colgroup>
   <tbody>
      <tr style="height: 36px;">
         <td><span style="font-family: 'times new roman', times, serif;">Nama Pegawai</span></td>
         <td><span style="font-family: 'times new roman', times, serif;">: {{nama_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: 'times new roman', times, serif;">NIP</span></td>
         <td><span style="font-family: 'times new roman', times, serif;">: {{nip_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: 'times new roman', times, serif;">Pangkat/Gol.Ruang&nbsp;</span></td>
         <td><span style="font-family: 'times new roman', times, serif;">: {{pangkat_asn}}</span></td>
      </tr>
      <tr style="height: 57.6px;">
         <td><span style="font-family: 'times new roman', times, serif;">Jabatan</span></td>
         <td><span style="font-family: 'times new roman', times, serif;">: {{jabatan_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: 'times new roman', times, serif;">Unit Kerja&nbsp;</span></td>
         <td><span style="font-family: 'times new roman', times, serif;">: {{unit_asn}}</span></td>
      </tr>
   </tbody>
</table>
<p style="text-align: center;">&nbsp;</p>
<p style="text-align: center;"><span style="font-family: 'times new roman', times, serif;"><strong>BADAN KEPEGAWAIAN PENDIDIKAN DAN PELATIHAN</strong></span><br><span style="font-family: 'times new roman', times, serif;"><strong>KABUPATEN POHUWATO</strong></span><br><span style="font-family: 'times new roman', times, serif;"><strong>TAHUN {{tahun}}</strong></span></p>
`;

export const SKP_TEMPLATE = `
<div class="title-wrapper">
   <h3 class="ant-typography css-dev-only-do-not-override-p45i5k css-var-r1" style="text-align: center; line-height: 1;"><span style="font-size: 17px; font-family: terminal, monaco, monospace;">SASARAN KINERJA PEGAWAI</span></h3>
   <h3 class="ant-typography css-dev-only-do-not-override-p45i5k css-var-r1" style="text-align: center; line-height: 1;"><span style="font-size: 17px; font-family: terminal, monaco, monospace;">PENDEKATAN HASIL KERJA {{pendekatan}}</span></h3>
   <h3 class="ant-typography css-dev-only-do-not-override-p45i5k css-var-r1" style="text-align: center; line-height: 1;"><span style="font-size: 17px; font-family: terminal, monaco, monospace;">BAGI PEJABAT ADMINISTRASI DAN PEJABAT FUNGSIONAL</span></h3>
</div>
<div style="text-align: center;"><strong><span class="ant-typography css-dev-only-do-not-override-p45i5k css-var-r1" style="font-family: terminal, monaco, monospace;">PERIODE : {{periode}}</span></strong></div>
<div>&nbsp;</div>
<table style="border-collapse: collapse; border-width: 1px; width: 100%; height: 219px;" border="1">
   <tbody>
      <tr style="height: 20.6px;">
         <th style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">NO</span></th>
         <th style="border-width: 1px; width: 44.7631%;" colspan="2"><span style="font-family: terminal, monaco, monospace;">PEGAWAI YANG DINILAI</span></th>
         <th style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">NO</span></th>
         <th style="border-width: 1px; width: 43.3821%;" colspan="2"><span style="font-family: terminal, monaco, monospace;">PEGAWAI PENILAI KINERJA</span></th>
      </tr>
      <tr style="height: 37.6px;">
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">1</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">NAMA</span></td>
         <td style="border-width: 1px; width: 37.1724%;"><span style="font-family: terminal, monaco, monospace;">{{nama_asn}}</span></td>
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">1</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">NAMA</span></td>
         <td style="border-width: 1px; width: 35.7913%;"><span style="font-family: terminal, monaco, monospace;">{{nama_atasan}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">2</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">NIP</span></td>
         <td style="border-width: 1px; width: 37.1724%;"><span style="font-family: terminal, monaco, monospace;">{{nip_asn}}</span></td>
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">2</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">NIP</span></td>
         <td style="border-width: 1px; width: 35.7913%;"><span style="font-family: terminal, monaco, monospace;">{{nip_atasan}}</span></td>
      </tr>
      <tr style="height: 61.6px;">
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">4</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">JABATAN</span></td>
         <td style="border-width: 1px; width: 37.1724%;"><span style="font-family: terminal, monaco, monospace;">{{jabatan_asn}}</span></td>
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">4</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">JABATAN</span></td>
         <td style="border-width: 1px; width: 35.7913%;"><span style="font-family: terminal, monaco, monospace;">{{jabatan_atasan}}</span></td>
      </tr>
      <tr style="height: 61.6px;">
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">5</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">UNIT KERJA</span></td>
         <td style="border-width: 1px; width: 37.1724%;"><span style="font-family: terminal, monaco, monospace;">{{unit_asn}}</span></td>
         <td style="border-width: 1px; width: 1.77419%;"><span style="font-family: terminal, monaco, monospace;">5</span></td>
         <td style="border-width: 1px; width: 7.59073%;"><span style="font-family: terminal, monaco, monospace;">UNIT KERJA</span></td>
         <td style="border-width: 1px; width: 35.7913%;"><span style="font-family: terminal, monaco, monospace;">{{unit_atasan}}</span></td>
      </tr>
   </tbody>
</table>
<p>&nbsp;</p>
<span style="font-family: terminal, monaco, monospace;">{{kinerja_table}}</span>
<p style="line-height: 1;">&nbsp;</p>
{{perilaku_table}}</span>
<p>&nbsp;</p>
<table style="width: 100%; height: 272.8px;">
   <tbody>
      <tr style="height: 36px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">Pegawai YANG DINILAI</span></td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">Pejabat PENILAI KINERJA</span></td>
      </tr>
      <tr style="height: 106.4px;">
         <td style="width: 34.1001%; text-align: center;">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
         </td>
         <td style="width: 32.7873%; text-align: center;">
            <p>&nbsp;</p>
         </td>
         <td style="width: 33.0924%; text-align: center;">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
         </td>
      </tr>
      <tr style="height: 58.4px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>{{jabatan_asn}}</strong></span></td>
         <td style="width: 32.7873%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>&nbsp;</strong></span></td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>{{jabatan_atasan}}</strong></span></td>
      </tr>
      <tr style="height: 36px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nama_asn}}</span></td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nama_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nip_asn}}</span></td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nip_atasan}}</span></td>
      </tr>
   </tbody>
</table>
<p style="text-align: right;"><img src="/image_asset/ekin_logo.png" width="64" height="64"></p>
`;
