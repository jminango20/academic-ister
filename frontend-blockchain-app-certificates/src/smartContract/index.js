let academicCertificateABI = null;

// Función para cargar la ABI desde academicCertificateABI.json usando fetch
async function loadAcademicCertificateABI() {
  try {
    const response = await fetch('/src/smartContract/academicCertificateABI.json');
    const data = await response.json();
    academicCertificateABI = data.abi;
  } catch (error) {
    console.error('Error al cargar academicCertificateABI:', error);
  }
}

// Llama a la función para cargar la ABI al iniciar la aplicación
loadAcademicCertificateABI();

export { academicCertificateABI };