import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { City } from '../../interfaces/WeatherType';
import CitySelector from '../Admin/CitySelector';
import { useGetWeatherByParamsQuery } from '../../services/weatherNew.service';
import { useDispatch } from 'react-redux';
import { setType } from '../../stores/slices/weather.slice';

const WeatherDashboard = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const dispatch = useDispatch();

  // Automatically fetch user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => console.error('Error fetching coordinates:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const queryParams = coords
    ? {
        q: `${coords.lat},${coords.lon}`,
        days: 6,
        lang: 'en',
        // hour: new Date().getHours(),
      }
    : {
      q: `,`,
      days: 6,
      lang: 'en',
      // hour: new Date().getHours(),
    };

  const { data: weatherData, isLoading, isError } = useGetWeatherByParamsQuery(queryParams, {
    skip: !coords && !city,
  });


  useEffect(() => {
    if (weatherData) {
      const currentCondition = weatherData.current.condition.text;
      const type = determineWeatherType(currentCondition);
      dispatch(setType(type));
    }
  }, [weatherData]);


  console.log(weatherData)
  const handleCitySelect = (selectedCity: City) => {
    setCity(selectedCity);
    setCoords({
      lat: selectedCity.coord.lat,
      lon: selectedCity.coord.lon,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !weatherData) {
    return <div>Error fetching weather data.</div>;
  }


const now = new Date();
const currentHour = now.getHours();

// Lấy dữ liệu từ giờ hiện tại đến 24 giờ tiếp theo
const hourlyForecast =
  weatherData.forecast?.forecastday
    ?.flatMap((day, index) => {
      return day.hour.map((hour) => ({
        ...hour,
        isToday: index === 0, // Đánh dấu giờ thuộc ngày hiện tại
      }));
    })
    ?.filter((hour) => {
      const hourTime = new Date(hour.time);
      return (
        (hour.isToday && hourTime.getHours() >= currentHour) || // Lọc giờ hiện tại đến hết ngày hôm nay
        (!hour.isToday && hourTime.getHours() < currentHour) // Lọc giờ từ ngày hôm sau nếu cần
      );
    })
    ?.slice(0, 24) // Lấy tối đa 24 giờ tiếp theo
    ?.map((hour) => ({
      time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: <img src={`${hour.condition.icon}`} alt={hour.condition.text} className="w-6 h-6" />,
      temp: hour.temp_c,
    })) || [];



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

  
  const styles = {
    hourlyForecastContainer: {
      display: 'flex',
      gap: '1rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      position: 'relative',
      scrollBehavior: 'smooth',
      animation: 'scrollHourly 24s linear infinite',
    } as React.CSSProperties,
    hourlyForecastItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '80px',
      flexShrink: 0,
    } as React.CSSProperties,
  };

  const repeatedHourlyForecast = [...hourlyForecast, ...hourlyForecast];


  const determineWeatherType = (conditionText: string) => {
    const lowerText = conditionText.toLowerCase();
    if (lowerText.includes('rain')) return 'rainy';
    if (lowerText.includes('cloud')) return 'cloudy';
    if (lowerText.includes('clear')) return 'sunny';
    if (lowerText.includes('snow')) return 'snowy';
    return 'default'; // Mặc định nếu không xác định được
  };

  
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <CitySelector onCitySelect={handleCitySelect} /> {/* Add CitySelector */}

          {/* Header */}
          {city ? (<div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' ,fontSize: '1.75rem'}}>
              <Navigation className="w-5 h-5" />
              <span >
                {city.name}, {city.country}
              </span>
            </div>
          </div>) : (<div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',fontSize: '1.75rem' }}>
              <Navigation className="w-5 h-5" />
              <span>
                {weatherData.location.name}, {weatherData.location.country}
              </span>
            </div>
          </div>)
          
          }
          {/* Current Weather */}
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}
          >
            <div>
              <div style={{ fontSize: '1rem', color: 'black' }}>
                {new Date(weatherData.current.last_updated).toLocaleString()}
              </div>
              <div style={weatherInfoStyle}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                  {weatherData.current.temp_c}°C
                </span>
                <span style={{ fontSize: '1.5rem', color: 'black' }}>
                  /{weatherData.current.feelslike_c}°
                </span>
              </div>
              <div>
                <span>Chance of Rain: {weatherData.current.humidity}%</span>
                <div style={{ fontSize: '1rem', color: 'black' }}>
                  Wind-speed: {weatherData.current.wind_kph} kph {weatherData.current.wind_dir}
                </div>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{weatherData.current.condition.text}</h2>
            </div>
          </div>

          {/* 6-Day Forecast */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>6-Day Forecast</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {dailyForecast.map((day) => (
                <div
                  key={day.day}
                  style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '0.375rem',
                  }}
                >
                  <div style={{ fontWeight: '500', color: '#737475' }}>{day.day}</div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginTop: '0.5rem',
                      color: '#737475',
                    }}
                  >
                    {day.high}°<span style={{ color: '#989a9c', fontSize: '1rem' }}>/ {day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


    <div style={{ padding: '1rem', maxWidth: '110rem', margin: '0 auto' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Hourly Forecast</h3>
      <style>
        {`
          @keyframes scrollHourly {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .scroll-container {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 10rem; /* Fixed height for the scrolling box */
            background: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #ddd;

          }
          .scroll-content {
            display: flex;
            align-items: center;
            animation: scrollHourly 90s linear infinite;
            width: max-content;
            margin: 1rem 1rem;
            
          }
          .scroll-content > div {
            display: flex;
            flex-direction: column; /* Stack elements vertically */
            align-items: center;
            justify-content: space-between; /* Add space between items */
            min-width: 80px;
            text-align: center;
            margin-right: 1rem;
            gap: 0.5rem; /* Add spacing between the spans */
            
            
          }
          .scroll-content:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="scroll-container">
        <div className="scroll-content">
          now
          {hourlyForecast.map((hour, index) => (
            <div key={index}>
              <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{hour.time}</span> 
              <span>{hour.icon} </span>
              <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{hour.temp}°C</span>
            </div>
          ))}
        </div>
      </div>
    </div>

        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;


