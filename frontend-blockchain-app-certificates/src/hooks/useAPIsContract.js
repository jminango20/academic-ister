import { useState } from 'react';
import { createContract, getAllContracts } from '../api';

const useAPIsContract = () => {
  const [data, setData] = useState(null);
  const [dataContract, setDataContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDataContract, setLoadingDataContract] = useState(false);
  const [error, setError] = useState(null);
  const [errorDataContract, setErrorDataContract] = useState(null);

  const submitContract = async (contractData) => {
    setLoading(true);
    try {
      const result = await createContract(contractData);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getContracts = async () => {
    setLoadingDataContract(true);
    try {
      const result = await getAllContracts();
      setDataContract(result.data);
      // console.log("API Response:", result.data)
    } catch (err) {
      setErrorDataContract(err);
      console.log("Error:", err);
    } finally {
      setLoadingDataContract(false);
    }
  }

  return { data, loading, error, submitContract, 
    dataContract, loadingDataContract, errorDataContract, getContracts };
};


export default useAPIsContract;
