import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWeatherData } from "@/hooks/useWeatherData";
import { 
  IoThermometerOutline, 
  IoWaterOutline, 
  IoCloudyOutline, 
  IoSpeedometerOutline, 
  IoSunnyOutline, 
  IoLeafOutline 
} from 'react-icons/io5';

const AwsComponent = () => {
  // Use the weather data hook with a 10 second refresh interval
  const {
    evaporation,
    humidity,
    airPressure,
    radiation,
    airTemperature,
    windSpeed,
    lastUpdate,
    isLoading,
    error
  } = useWeatherData({ interval: 30000 });

  // Define weather sections for display
  const weatherSections = [
    {
      title: "Air Temperature",
      icon: IoThermometerOutline,
      value: airTemperature.actual !== undefined? `${airTemperature.actual} °C` : "0 °C",
      gradient: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconBg: "bg-red-100"
    },
    {
      title: "Humidity", 
      icon: IoWaterOutline,
      value: humidity.actual !== undefined? `${humidity.actual} %` : "0 %",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100"
    },
    {
      title: "Wind Speed",
      icon: IoCloudyOutline,
      value: windSpeed.actual !== undefined? `${windSpeed.actual} m/s` : "0 m/s",
      gradient: "from-teal-500 to-emerald-500",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      iconBg: "bg-teal-100"
    },
    {
      title: "Air Pressure",
      icon: IoSpeedometerOutline,
      value: airPressure.actual !== undefined? `${airPressure.actual} hPa` : "0 hPa",
      gradient: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      iconBg: "bg-purple-100"
    },
    {
      title: "Solar Radiation",
      icon: IoSunnyOutline,
      value: radiation.actual !== undefined? `${radiation.actual} W/m²` : "0 W/m²",
      gradient: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconBg: "bg-amber-100"
    },
    {
      title: "Evapotranspiration",
      icon: IoLeafOutline,
      value: evaporation.evapoTranspiration !== undefined? `${evaporation.evapoTranspiration} mm` : "0 mm",
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      iconBg: "bg-indigo-100"
    }
  ];

  if (isLoading && !lastUpdate) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse border-0 shadow-lg">
            <CardHeader className="bg-gray-200 h-16"></CardHeader>
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Weather Data</h3>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with last update */}
      {lastUpdate && (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Weather Station Active</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Last updated: {lastUpdate}
          </span>
        </div>
      )}
      
      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherSections.map((section, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${section.gradient} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${section.iconBg} rounded-lg flex items-center justify-center`}>
                    <section.icon className="text-xl text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`${section.bgColor} p-6`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${section.textColor} mb-2`}>
                  {section.value}
                </div>
                <div className="w-full bg-white/50 rounded-full h-1">
                  <div className={`bg-gradient-to-r ${section.gradient} h-1 rounded-full transition-all duration-1000`} style={{width: '75%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default AwsComponent;