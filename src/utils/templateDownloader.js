export const templateDownloader = (filename) => {
  const baseUrl = '/public/template/'; // Path statis tempat file berada
  const url = baseUrl + filename;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename); // Memberikan atribut download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
