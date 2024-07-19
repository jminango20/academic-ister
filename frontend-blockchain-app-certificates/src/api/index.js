const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

// const API_BASE_URL_local="https://3000-idx-academic-ister-1719265372037.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev/api";

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${BEARER_TOKEN}`,
  };
};

export const getAllCertificates_ByType = async (page, limit, type) => {
  try {
    const url = new URL(`${API_BASE_URL}/academic/certificates_by_type`);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    url.searchParams.append('type', type);

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    // console.log(response)

    if (!response.ok) {
      throw new Error('Error fetching certificates');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllCertificates = async (page, limit) => {
  try {
    const url = new URL(`${API_BASE_URL}/academic/certificates`);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    // console.log(response)

    if (!response.ok) {
      throw new Error('Error fetching certificates');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllContracts = async () => {
  try {
    const url = new URL(`${API_BASE_URL}/academic/get_allcontracts`);

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Error fetching contracts');
    }
    return await response.json();
  } catch (error) {
    console.error('Ocurrió el siguiente error:',error);
    throw error;
  }
};

export const createCertificate = async (data) => {
  
  try {
    const response = await fetch(`${API_BASE_URL}/academic/issueCertificate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Error creando el certificado');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createContract = async (data) => {
  
  try {
    const response = await fetch(`${API_BASE_URL}/academic/issueContract`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    // console.log(response)
    if (!response.ok) {
      throw new Error('Error al agregar el contrato a la base de datos');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

