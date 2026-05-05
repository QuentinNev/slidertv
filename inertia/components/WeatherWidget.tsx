export default function WeatherWidget() {
  return (
    <div className="tv-weather">
      <div className="tv-weather-icon">⛅</div>
      <div className="tv-weather-temp">22°C</div>
      <div className="tv-weather-desc">Partiellement nuageux</div>
      <div className="tv-weather-loc">Paris, France</div>
      <div className="tv-weather-details">
        <span>Humidité 65%</span>
        <span>Vent 12 km/h</span>
      </div>
    </div>
  )
}
