export const COVER_TEMPLATE = `
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

export const TABLE_HASIL_KERJA_SASARAN_KINERJA_TEMPLATE = (data) => {
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
          <th style="font-family: terminal, monaco, monospace;" colSpan="6">HASIL KERJA</th>
        </tr>
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;">NO</th>
          <th style="font-family: terminal, monaco, monospace;">RENCANA HASIL KERJA PIMPINAN YANG DI INTERVENSI*</th>
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

export const TABLE_PERILAKU_KERJA_SASARAN_KINERJA_TEMPLATE = (data) => {
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
          <th style="width: 4.23302%;" style="font-family: terminal, monaco, monospace;" colSpan="3">PERILAKU KERJA**</th>
        </tr>
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

export const SASARAN_KINERJA_TEMPLATE = `
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
<div style="page-break-after: always;"></div>
<span style="font-family: terminal, monaco, monospace;">{{hasil_kerja_sasaran_kinerja_table}}</span>
<div style="page-break-after: always;"></div>
<span style="font-family: terminal, monaco, monospace;">{{perilaku_kerja_sasaran_kinerja_table}}</span>
<div style="page-break-after: always;"></div>
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
<p style="text-align: justify;">&nbsp;</p>
<p style="text-align: justify;">&nbsp;</p>
<p style="text-align: justify;"><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">* Dalam hal rencana hasil kerja Pimpinan yang diintervensi adalah hasil kerja pejabat pimpinan tinggi dan Pimpinan unit kerja mandiri/</span></em></span><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">organisasi maka dituliskan rencana hasil kerja beserta indikator kinerja individu pejabat pimpinan tinggi dan Pimpinan unit kerja mandiri </span></em></span><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">atau sasaran dan indikator kinerja organisasi yang diintervensi</span></em></span></p>
<p style="text-align: justify;"><br><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">** Pimpinan dapat memberikan Ekspektasi khusus terhadap satu atau lebih aspek perilaku kerja Pegawai&nbsp;</span></em></span></p>
<p style="text-align: right;"><img src="../../../../image_asset/ekin_logo.png" width="64" height="64"></p>
`;

export const TABLE_HASIL_KERJA_EVALUASI_KINERJA_TEMPLATE = (data) => {
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
            <td style="font-family: terminal, monaco, monospace;">-</td>
            <td style="font-family: terminal, monaco, monospace;">-</td>
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
            <td style="font-family: terminal, monaco, monospace;">-</td>
            <td style="font-family: terminal, monaco, monospace;">-</td>
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
          <th style="font-family: terminal, monaco, monospace;" colSpan="8">
            <p style="font-family: terminal, monaco, monospace;">CAPAIAN KINERJA ORGANISASI*</p>
            <p style="font-family: terminal, monaco, monospace;">ISTIMEWA / BAIK / BUTUH PERBAIKAN/ KURANG / SANGAT KURANG</p>
          </th>
        </tr>
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;" colSpan="8">
            <p style="font-family: terminal, monaco, monospace;">POLA DISTRIBUSI :</p>
            <p style="font-family: terminal, monaco, monospace;">ISTIMEWA / BAIK / BUTUH PERBAIKAN/ KURANG / SANGAT KURANG</p>
          </th>
        </tr>
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;" colSpan="8">HASIL KERJA</th>
        </tr>
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;">NO</th>
          <th style="font-family: terminal, monaco, monospace;">RENCANA HASIL KERJA PIMPINAN YANG DI INTERVENSI*</th>
          <th style="font-family: terminal, monaco, monospace;">RENCANA HASIL KERJA</th>
          <th style="font-family: terminal, monaco, monospace;">ASPEK</th>
          <th style="font-family: terminal, monaco, monospace;">INDIKATOR</th>
          <th style="font-family: terminal, monaco, monospace;">TARGET</th>
          <th style="font-family: terminal, monaco, monospace;">REALISASI BERDASARKAN BUKTI DUKUNG</th>
          <th style="font-family: terminal, monaco, monospace;">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</th>
        </tr>

        <tr><td colspan="8"><strong style="font-family: terminal, monaco, monospace;">Utama</strong></td></tr>
        ${utama}

        <tr><td colspan="8"><strong style="font-family: terminal, monaco, monospace;">Tambahan</strong></td></tr>
        ${tambahan}
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;" colSpan="8">
            <p style="font-family: terminal, monaco, monospace;">RATING HASIL KERJA :</p>
            <p style="font-family: terminal, monaco, monospace;">ISTIMEWA / BAIK / BUTUH PERBAIKAN/ KURANG / SANGAT KURANG</p>
          </th>
        </tr>
      </tbody>
    </table>
  `;
};

export const TABLE_PERILAKU_KERJA_EVALUASI_KINERJA_TEMPLATE = (data) => {
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
        <td style="width: 26.2044%; border-width: 1px;" style="font-family: terminal, monaco, monospace;">&nbsp;</td>
      </tr>
    `
    )
    .join('');

  return `
    <table style="width: 100%; border-collapse: collapse;" border="1" style="font-family: terminal, monaco, monospace;">
      <tbody style="font-family: terminal, monaco, monospace;">
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="width: 4.23302%;" style="font-family: terminal, monaco, monospace;" colSpan="4">PERILAKU KERJA**</th>
        </tr>
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="width: 4.23302%;" style="font-family: terminal, monaco, monospace;">NO</th>
          <th style="width: 69.5424%;" style="font-family: terminal, monaco, monospace;">PERILAKU KERJA</th>
          <th style="width: 26.2044%;" style="font-family: terminal, monaco, monospace;">EKSPEKTASI KHUSUS PIMPINAN</th>
          <th style="width: 26.2044%;" style="font-family: terminal, monaco, monospace;">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</th>
        </tr>
        ${rows}
        <tr style="font-family: terminal, monaco, monospace;">
          <th style="font-family: terminal, monaco, monospace;" colSpan="8">
            <p style="font-family: terminal, monaco, monospace;">RATING PERILAKU KERJA :</p>
            <p style="font-family: terminal, monaco, monospace;">ISTIMEWA / BAIK / BUTUH PERBAIKAN/ KURANG / SANGAT KURANG</p>
          </th>
        </tr>
      </tbody>
    </table>
  `;
};

export const EVALUASI_KINERJA_TEMPLATE = `
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
<div style="page-break-after: always;"></div>
<span style="font-family: terminal, monaco, monospace;">{{hasil_kerja_evaluasi_kinerja_table}}</span>
<div style="page-break-after: always;"></div>
<span style="font-family: terminal, monaco, monospace;">{{perilaku_kerja_evaluasi_kinerjas_table}}</span>
<table style="border-collapse: collapse; width: 100%;" border="1">
   <colgroup>
      <col style="width: 99.8992%;">
   </colgroup>
   <tbody>
      <tr>
         <td style="text-align: center;">
            <p style="font-family: terminal, monaco, monospace;"><strong>PREDIKAT KINERJA PEGAWAI :</strong></p>
            <p style="font-family: terminal, monaco, monospace;"><strong>ISTIMEWA / BAIK / BUTUH PERBAIKAN/ KURANG / SANGAT KURANG</strong></p>
         </td>
      </tr>
   </tbody>
</table>
<div style="page-break-after: always;"></div>

<p>&nbsp;</p>
<table style="width: 35.2823%; height: 272.8px; border-collapse: collapse; margin-right: 0px; margin-left: auto;" border="0">
   <tbody>
      <tr style="height: 36px;">
         <td style="width: 100%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">Pejabat PENILAI KINERJA</span></td>
      </tr>
      <tr style="height: 106.4px;">
         <td style="width: 100%; text-align: center;">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
         </td>
      </tr>
      <tr style="height: 58.4px;">
         <td style="width: 100%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>{{jabatan_atasan}}</strong></span></td>
      </tr>
      <tr style="height: 36px;">
         <td style="width: 100%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nama_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td style="width: 100%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">{{nip_atasan}}</span></td>
      </tr>
   </tbody>
</table>
<p style="text-align: justify;">&nbsp;</p>
<p style="text-align: justify;">&nbsp;</p>
<p style="text-align: right;"><img src="/image_asset/ekin_logo.png" width="64" height="64"></p>
`;

export const HASIL_EVALUASI_TEMPLATE = `
<p style="text-align: center;"><img style="width: 85px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;" src="../../../../image_asset/garuda.png" height="83"></p>
<p style="text-align: center;"><span style="font-family: 'times new roman', times, serif;">DOKUMEN EVALUASI KINERJA PEGAWAI</span><br><span style="font-family: 'times new roman', times, serif;">PERIODE(*) : TRIWULAN I/II/III/IV-AKHIR(**)</span></p>
<p style="text-align: center; line-height: 1;">&nbsp;</p>
<hr>
<table style="width: 100%; height: 36px; border-collapse: collapse;" border="0">
   <colgroup>
      <col style="width: 50%;">
      <col style="width: 50%;">
   </colgroup>
   <tbody>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">PEMERINTAH KAB. POHUWATO</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">PERIODE PENILAIAN :</span><br><span style="font-family: terminal, monaco, monospace;">1 JANUARI 2022 SD 31 DESEMBER 2022</span></td>
      </tr>
   </tbody>
</table>
<table style="border-collapse: collapse; width: 100%; height: 216px; border-width: 1px; background-color: #ffffff;" border="1">
   <colgroup>
      <col style="width: 4.43906%;">
      <col style="width: 26.4326%;">
      <col style="width: 1.91752%;">
      <col style="width: 67.1906%;">
   </colgroup>
   <tbody>
      <tr style="height: 36px;">
         <td style="text-align: center;" rowspan="6"><span style="font-family: terminal, monaco, monospace;"><strong>1</strong></span></td>
         <td colspan="3"><span style="font-family: terminal, monaco, monospace;"><strong>PEGAWAI YANG DINILAI</strong><strong><br></strong></span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">NAMA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nama_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">NIP</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nip_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">PANGKAT/GOL RUANG</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{pangkat_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">JABATAN</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{jabatan_asn}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">UNIT KERJA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{unit_asn}}</span></td>
      </tr>
   </tbody>
</table>
<table style="width: 100%; height: 216px; border-width: 1px;" border="1">
   <colgroup>
      <col style="width: 4.43906%;">
      <col style="width: 26.4326%;">
      <col style="width: 1.91752%;">
      <col style="width: 67.1906%;">
   </colgroup>
   <tbody>
      <tr style="height: 36px;">
         <td style="text-align: center;" rowspan="6"><span style="font-family: terminal, monaco, monospace;"><strong>2</strong></span></td>
         <td colspan="3"><span style="font-family: terminal, monaco, monospace;"><strong>PEJABAT PENILAI KINERJA</strong><strong><br></strong></span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">NAMA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nama_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">NIP</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nip_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">PANGKAT/GOL RUANG</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{pangkat_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">JABATAN</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{jabatan_atasan}}</span></td>
      </tr>
      <tr style="height: 36px;">
         <td><span style="font-family: terminal, monaco, monospace;">UNIT KERJA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{unit_atasan}}</span></td>
      </tr>
   </tbody>
</table>
<table style="width: 100%; height: 225.6px; border-width: 1px;" border="1">
   <colgroup>
      <col style="width: 4.43906%;">
      <col style="width: 26.3317%;">
      <col style="width: 2.21953%;">
      <col style="width: 66.9895%;">
   </colgroup>
   <tbody>
      <tr style="height: 37.6px;">
         <td style="text-align: center;" rowspan="6"><span style="font-family: terminal, monaco, monospace;"><strong>3</strong></span></td>
         <td colspan="3"><span style="font-family: terminal, monaco, monospace;"><strong>ATASAN PEJABAT PENILAI KINERJA<br></strong></span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">NAMA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nama_atasan_penilai}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">NIP</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{nip_atasan_penilai}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">PANGKAT/GOL RUANG</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{pangkat_atasan_penilai}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">JABATAN</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{jabatan_atasan_penilai}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">UNIT KERJA</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{unit_atasan_penilai}}</span></td>
      </tr>
   </tbody>
</table>
<table style="width: 100%; height: 116.45px; border-width: 1px;" border="1">
   <colgroup>
      <col style="width: 4.43906%;">
      <col style="width: 26.3317%;">
      <col style="width: 2.21953%;">
      <col style="width: 66.9895%;">
   </colgroup>
   <tbody>
      <tr style="height: 38.925px;">
         <td style="text-align: center;" rowspan="3"><span style="font-family: terminal, monaco, monospace;"><strong>4</strong></span></td>
         <td colspan="3"><span style="font-family: terminal, monaco, monospace;"><strong>EVALUASI KINERJA</strong></span></td>
      </tr>
      <tr style="height: 39.925px;">
         <td><span style="font-family: terminal, monaco, monospace;">CAPAIAN KINERJA ORGANISASI</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{capaian_kinerja_organisasi}}</span></td>
      </tr>
      <tr style="height: 37.6px;">
         <td><span style="font-family: terminal, monaco, monospace;">PREDIKAT KINERJA PEGAWAI</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">:</span></td>
         <td><span style="font-family: terminal, monaco, monospace;">{{predikat_kinerja_pegawai}}</span></td>
      </tr>
   </tbody>
</table>
<table style="width: 100%; height: 116.45px; border-width: 1px;" border="1">
   <colgroup>
      <col style="width: 4.43906%;">
      <col style="width: 95.5408%;">
   </colgroup>
   <tbody>
      <tr style="height: 38.925px;">
         <td style="text-align: center;" rowspan="2"><span style="font-family: terminal, monaco, monospace;"><strong>5</strong></span></td>
         <td><span style="font-family: terminal, monaco, monospace;"><strong>CATATAN/REKOMENDASI</strong></span></td>
      </tr>
      <tr style="height: 39.925px;">
         <td><span style="font-family: terminal, monaco, monospace;">{{catatan}}</span></td>
      </tr>
   </tbody>
</table>
<p>&nbsp;</p>
<p>&nbsp;</p>
<table style="width: 100%; height: 373.6px;">
   <tbody>
      <tr style="height: 108.8px;">
         <td style="width: 34.1001%; text-align: center;">
            <p><span style="font-family: terminal, monaco, monospace;">Marisa, {{date_dinilai}}</span></p>
            <p><span style="font-family: terminal, monaco, monospace;">Pegawai YANG DINILAI</span></p>
         </td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;">
            <p><span style="font-family: terminal, monaco, monospace;">Marisa, {{date_penilai}}</span></p>
            <p><span style="font-family: terminal, monaco, monospace;">Pejabat PENILAI KINERJA</span></p>
         </td>
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
      <tr style="height: 84.8px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</strong></span></td>
         <td style="width: 32.7873%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>&nbsp;</strong></span></td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;"><strong>KEPALA BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</strong></span></td>
      </tr>
      <tr style="height: 36.8px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">SYAIFUL SAFRIL LUMA</span></td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">SUPRATMAN NENTO</span></td>
      </tr>
      <tr style="height: 36.8px;">
         <td style="width: 34.1001%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">197904012005011015</span></td>
         <td style="width: 32.7873%; text-align: center;">&nbsp;</td>
         <td style="width: 33.0924%; text-align: center;"><span style="font-family: terminal, monaco, monospace;">196710281989021002</span></td>
      </tr>
   </tbody>
</table>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p style="text-align: justify;"><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">* periode disesuaikan dengan periode evaluasi kinerja Pegawai yang berlaku padaInstansi Pemerintah</span></em></span></p>
<p style="text-align: justify;"><span style="font-size: 14px;"><em><span style="font-family: terminal, monaco, monospace;">** Pilih salah satu</span></em></span></p>
<p><span style="font-size: 14px;"><img style="float: right;" src="../../../../image_asset/ekin_logo.png" width="64" height="64"></span></p>
`;
