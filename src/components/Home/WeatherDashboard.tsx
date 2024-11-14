import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { fetchWeatherData, WeatherData, onSearch} from '../../services/weatherDashboard.service';

const WeatherDashboard = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city && onSearch) {
      onSearch(city).then((data) => {
        if (data) {
          setWeatherData(data);
        } else {
          console.error('Weather data could not be fetched.');
        }
      });
    }
  };
  

// Get the user's current location
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    },
    (error) => console.error("Lỗi lấy tọa độ:", error),
    { enableHighAccuracy: true }
  );
}, []);

useEffect(() => {
  const getWeatherData = async () => {
    if (coords) {
      const data = await fetchWeatherData(coords.lat, coords.lon);
      setWeatherData(data);
    }
  };

  getWeatherData();
}, [coords]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  // Kiểm tra có dữ liệu trong `forecast` hay không trước khi xử lý
  const hourlyForecast = weatherData.forecast?.forecastday[0]?.hour?.map((hour) => ({
    time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: <img src={`${hour.condition.icon}`} alt={hour.condition.text} className="w-6 h-6" />,
    temp: hour.temp_c,
  })) || [];

  // Dữ liệu ngày
  const dailyForecast = weatherData.forecast?.forecastday.map((day) => ({
    day: new Date(day.date).toLocaleDateString('en-GB', { weekday: 'long' }),
    high: day.day.maxtemp_c,
    low: day.day.mintemp_c,
  })) || [];

  const containerStyle: React.CSSProperties = {
    minHeight: '50vh',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    margin: '0',
    borderRadius: '0.5rem',
  };

  const sectionStyle: React.CSSProperties = {
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const weatherInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '1rem',
  };

  const dayStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#f7fafc',
    borderRadius: '0.375rem',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Enter city name" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                flex: '1',
                marginRight: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#2d3a54',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            >
              Search
            </button>
          </div>

          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation className="w-5 h-5" />
              <span>{weatherData.location.name}, {weatherData.location.country}</span>
            </div>
          </div>

          {/* Current Weather */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',  marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                {new Date(weatherData.current.last_updated).toLocaleString()}
              </div>
              <div style={weatherInfoStyle}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                  {weatherData.current.temp_c}°C
                </span>
                <span style={{ fontSize: '1.25rem', color: '#4a5568' }}>
                  /{weatherData.current.feelslike_c}°
                </span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Chance of Rain: {weatherData.current.humidity}%</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                  Wind-speed: {weatherData.current.wind_kph} kph {weatherData.current.wind_dir}
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {weatherData.current.condition.text}
              </h2>
              <div style={{ marginTop: '1rem', color: '#4a5568' }}>
                {weatherData.current.condition.text}
              </div>
            </div>
          </div>

          {/* 6-Day Forecast */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600',  marginBottom: '1.5rem'}}>6-Day Forecast</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem',  marginBottom: '1.5rem' }}>
              {dailyForecast.map((day) => (
                <div key={day.day} style={dayStyle}>
                  <div style={{ fontWeight: '500', color: '#737475' }}>{day.day}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#737475' }}>
                    {day.high}°<span style={{ color: '#989a9c', fontSize: '1rem' }}>/ {day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Forecast */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem',  marginBottom: '1.5rem' }}>
              {hourlyForecast.map((hour) => (
                <div key={hour.time} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{hour.time}</span>
                  {hour.icon}
                  <span style={{ color: '#4a5568' }}>{hour.temp}°C</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
