export default function isSkpBawahan(skp, user) {
  if (!skp.atasan_skp_id || skp.atasan_skp_id.length === 0) {
    return false;
  }

  const nipAsnAtasan = skp?.atasan_skp?.[0]?.posjab?.[0]?.nip_asn;

  if (!nipAsnAtasan) {
    return false;
  }

  return nipAsnAtasan === user.newNip;
}
