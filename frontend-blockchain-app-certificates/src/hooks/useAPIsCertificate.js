import { useState } from 'react';
import { createCertificate, getAllCertificates } from '../api';

const useAPIsCertificate = () => {
  const [data, setData] = useState(null);
  const [dataCertificate, setDataCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [errorData, setErrorData] = useState(null);

  const submitCertificate = async (certificateData) => {
    setLoading(true);
    try {
      const result = await createCertificate(certificateData);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCertificatesPagination = async (page, limit) => {
    setLoadingData(true);
    try {
      const result = await getAllCertificates(page, limit);
      setDataCertificate(result.data);
      // console.log("API Response:", result.data)
    } catch (err) {
      setErrorData(err);
      console.log("Error:", err);
    } finally {
      setLoadingData(false);
    }
  }

  return { data, loading, error, submitCertificate, 
    dataCertificate, loadingData, errorData, getCertificatesPagination };
};


export default useAPIsCertificate;