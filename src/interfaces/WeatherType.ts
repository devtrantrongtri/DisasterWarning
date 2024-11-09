export interface WeatherData {
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    sys: {
      country: string;
    };
    name: string;
  }
  
  export interface City {
    id: number;
    name: string;
    state?: string;
    country: string;
    coord: {
      lon: number;
      lat: number;
    };
  }
  
  export interface ForecastItem {
    dt: number; // thời gian dự báo
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string; // chuỗi thời gian định dạng
  }
