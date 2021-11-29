import React, { useState, useEffect } from 'react';

// Fetch data url based on options and a trigger dependecy 
// @param {string} url - url of fetch, {object} options to fetch -  exemple put, get, post , {any} dependecy for trigger 
const useFetch = (url: any, options = {}, dependecy: any) => {
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
    dependecy && fetchData();
  }, [dependecy]);


  return [response, status, error];
}

export default useFetch;