import { toastError } from "./toast";

const WEATHER_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

export const getTransportSuggestion = (conditionText: string): string => {
  const lowerCondition = conditionText.toLowerCase();
  
  // Check for rainy/thunderstorm conditions
  if (lowerCondition.includes('rain') || 
      lowerCondition.includes('drizzle') || 
      lowerCondition.includes('thunder') ||
      lowerCondition.includes('storm')) {
    return 'car';
  }
  
  // Check for snow conditions
  if (lowerCondition.includes('snow') || 
      lowerCondition.includes('sleet') || 
      lowerCondition.includes('blizzard')) {
    return 'public transport';
  }
  
  // Check for clear/sunny conditions
  if (lowerCondition.includes('clear') || 
      lowerCondition.includes('sunny') ||
      lowerCondition.includes('fair')) {
    return 'bike or walking';
  }
  
  // Default for cloudy/overcast/other conditions
  return 'public transport';
};

export const getWeatherIcon = (conditionText: string): string => {
  const lowerCondition = conditionText.toLowerCase();
  
  if (lowerCondition.includes('thunder')) return '⛈️';
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️';
  if (lowerCondition.includes('snow') || lowerCondition.includes('sleet')) return '❄️';
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return '☁️';
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
  
  return '🌡️';
};

export const fetchWeather = async (location: string): Promise<WeatherData | null> => {
  try {
    const query = `q=${location}`;
    const response = await fetch(
      `${WEATHER_API_URL}?key=${WEATHER_KEY}&${query}&aqi=no`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toastError('Failed to load weather data');
    return null;
  }
};
