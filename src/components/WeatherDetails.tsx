import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../services/httpService";
import utilService from "../services/utilService";


const WeatherDetails = () => {
  let params = useParams();

  const [weatherDetails, setWeatherDetails] = useState({})


  useEffect(() => {
    axiosInstance.get('', {
      params: {
        q: params.city,
        appid: 'd7b950541d7264a3b3df80a8b6f2cbf7'
      }
    }).then((response) => {
      setWeatherDetails(utilService.formatWeatherData(response.data));
      console.log(weatherDetails);
    }).catch((err) => {
      console.log(err);
    })
  }, []);


  return (
    <div>
      <h1>WeatherDetails : {params.city}</h1>
      <span>Description: {weatherDetails?.description}</span> <br />
      <span>Temperature: {weatherDetails?.temp}</span>

    </div>
  )
}

export default WeatherDetails