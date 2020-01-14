import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyTable from '../../components/table/MyTable';
import Loader from '../../components/loader/Loader';
import './RestApi.css';

/**
 * Our RestApi page
 */
const RestApi = () => {
  // Our url to which we will make http request
  const url = 'https://jsonplaceholder.typicode.com/albums';
  // Our table data
  const [data, setData] = useState([]);
  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // Error msg in case the http request failed
	const [isError, setIsError] = useState(false);

  // Using useEffect to retrieve data from an API (similar to componentDidMount in a class)
  useEffect(() => {
    const source = axios.CancelToken.source();
    
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        // Making our HTTP request to the specified url
        const response = await axios(url, {
					cancelToken: source.token
				});
        // Updating the state with the data we got from the response
        setData(response.data);
      } catch (error) {
        setIsError(true);
        if (axios.isCancel(error)) {
					console.log('request cancelled');
				} else {
					throw error;
				}
      }

      setIsLoading(false);
    };

    // Invoke the async function
    fetchData();

    // Unmount
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <div className="RestApi">
      {
        isError ? <div className="page-center">Something went wrong ...</div> :
        isLoading ? <Loader/>:
        <MyTable data={data}></MyTable>
      }
    </div>
  );
}

export default RestApi;
