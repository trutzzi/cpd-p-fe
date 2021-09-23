import React, { useState, useEffect } from 'react';

const useFetch = (url: any, options = {}) => {
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<null | number>(null);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options);
        setStatus(res.status);
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);


  return [response, status, error];
}

export default useFetch;