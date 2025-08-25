import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/i18n';
import * as Icons from './Icons';

// Weather data structure from OpenWeatherMap
interface WeatherData {
    name: string;
    main: {
        temp: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
}

// Map OpenWeatherMap condition codes to Lucide icons
const getWeatherIcon = (weatherId: number): React.FC<any> => {
    if (weatherId >= 200 && weatherId < 300) return Icons.CloudLightningIcon; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return Icons.CloudRainIcon; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return Icons.CloudRainIcon; // Rain
    if (weatherId >= 600 && weatherId < 700) return Icons.CloudSnowIcon; // Snow
    if (weatherId >= 700 && weatherId < 800) return Icons.CloudFogIcon; // Atmosphere (fog, mist, etc.)
    if (weatherId === 800) return Icons.SunIcon; // Clear
    if (weatherId === 801) return Icons.CloudSunIcon; // Few clouds
    if (weatherId > 801) return Icons.CloudyIcon; // Scattered/Broken/Overcast clouds
    return Icons.CloudSunIcon; // Default
};


const ClockWeatherWidget: React.FC = () => {
    const { language, t } = useI18n();
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            setLoading(true);
            setError(null); // Reset error state
            try {
                const apiKey = process.env.OPENWEATHER_API_KEY;
                if (!apiKey) {
                    console.error("OpenWeather API key not found. Please set the OPENWEATHER_API_KEY environment variable.");
                    setError(t.clockWidget.apiError || "API Key Missing"); // Set error for UI
                    setLoading(false);
                    return;
                }
                const lang = language === 'vi' ? 'vi' : 'en';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`);
                if (!response.ok) {
                    throw new Error('Weather data not available');
                }
                const data: WeatherData = await response.json();
                setWeather(data);
            } catch (err) {
                console.error("Failed to fetch weather:", err);
                setError(t.clockWidget.unavailable || "Unavailable"); // Set error for UI
                setWeather(null);
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.warn(`Geolocation error (${error.code}): ${error.message}. Defaulting to Ho Chi Minh City.`);
                        fetchWeather(10.762622, 106.660172); // Default to Ho Chi Minh City
                    },
                    { timeout: 10000 }
                );
            } else {
                console.warn("Geolocation is not supported. Defaulting to Ho Chi Minh City.");
                fetchWeather(10.762622, 106.660172); // Default to Ho Chi Minh City
            }
        };

        getLocation();
    }, [language, t.clockWidget.apiError, t.clockWidget.unavailable]);

    const locale = language === 'vi' ? 'vi-VN' : 'en-US';

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
    };

    const formatDate = (date: Date) => {
         return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    };

    const formatDateString = (date: Date) => {
        return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };
    
    const WeatherIcon = weather && weather.weather.length > 0 ? getWeatherIcon(weather.weather[0].id) : Icons.CloudyIcon;

    return (
        <div className="clock-weather-widget">
            <div className="time-display">{formatTime(time)}</div>
            <div className="date-display">
                <span>{formatDate(time)}</span>
                <span>{formatDateString(time)}</span>
            </div>
            
            <div className="weather-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <Icons.LoaderIcon className="animate-spin" size={48} />
                ) : weather ? (
                    <WeatherIcon size={48} />
                ) : (
                    <Icons.CloudFogIcon size={48} /> // Show fog icon on error
                )}
            </div>

            <div className="temperature-display">
                {loading || error ? '--' : weather ? Math.round(weather.main.temp) : '--'}
                <span className="degree-symbol">°</span>
                <span className="degree-celsius">C</span>
            </div>

            <div className="location-display">
                <span>{loading ? t.clockWidget.loading : error ? error : weather ? weather.name : t.clockWidget.unavailable}</span>
            </div>
        </div>
    );
};

export default ClockWeatherWidget;