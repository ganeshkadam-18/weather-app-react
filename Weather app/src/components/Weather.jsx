import React, { useEffect, useState } from 'react'
import "./Weather.css"
import search_icon from "../assets/search.png"
import snow_icon from "../assets/snow.png"
import clear_icon from "../assets/clear.png"
import drizzle_icon from "../assets/drizzle.png"
import humidity_icon from "../assets/humidity.png"
import rain_icon from "../assets/rain.png"
import wind_icon from "../assets/wind.png"
import cloud_icon from "../assets/cloud.png"

const Weather = () => {

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  // Mapping weather condition → icons
  const weatherIcons = {
    Clear: clear_icon,
    Clouds: cloud_icon,
    Drizzle: drizzle_icon,
    Rain: rain_icon,
    Snow: snow_icon,
    Default: cloud_icon
  };

  // Search function
  const search = async (cityName) => {
    if (!cityName) return;

    try {
      const API_KEY = "5f496ddb273e55029531b26fc2cf6332"; 
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

      const response = await fetch(URL);
      const data = await response.json();
      console.log(data);

      if (data.cod === "404") {
        setError("City not found ❌");
        setWeatherData(null);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: weatherIcons[data.weather[0].main] || weatherIcons.Default
      });

      setError("");

    } catch (error) {
      setError("Network Error ❌");
      setWeatherData(null);
    }
  }

  // On first load: London
  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className='weather'>
      
      {/* Search bar */}
      <div className="searchbar">
        <input 
          type="text" 
          placeholder='Search City'
          onChange={(e) => setCity(e.target.value)}
        />
        <img 
          src={search_icon} 
          alt="" 
          onClick={() => search(city)}
        />
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Weather Data */}
      {weatherData && (
        <>
          <img 
            src={weatherData.icon} 
            alt="" 
            className='weather_icon'
          />

          <p className='temperature'>{weatherData.temperature}°c</p>
          <p className='location'>{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windspeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Weather
