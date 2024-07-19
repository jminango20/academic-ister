let academicCertificateI_abi = null;

// Función para cargar la ABI desde academicCertificateI_abi.json usando fetch
function loadAcademicCertificateI_ABI() {
  return fetch('/src/smartContract/academicCertificateI_abi.json')
    .then(response => response.json())
    .then(data => {
      academicCertificateI_abi = data.abi;
      return academicCertificateI_abi;
    })
    .catch(error => {
      console.error('Error al cargar academicCertificateI_abi:', error);
      throw error; // Lanza el error para manejarlo en la llamada
    });
}

// Exporta la función en lugar de la ABI directamente
export { loadAcademicCertificateI_ABI };
