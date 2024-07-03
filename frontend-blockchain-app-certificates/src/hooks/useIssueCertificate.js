import { useState } from 'react';
import { createCertificate } from '../api';

const useIssueCertificate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { data, loading, error, submitCertificate };
};

export default useIssueCertificate;
