const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

// const API_BASE_URL_local="https://3000-idx-academic-ister-1719265372037.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev/api";

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${BEARER_TOKEN}`,
  };
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
