import { Card, CardContent, CardHeader } from "../ui/card";
import { useWeatherData } from "@/hooks/useWeatherData";

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
      title: "Air Temperature (Act)",
      icon: "🌡",
      value: airTemperature.actual !== undefined? `${airTemperature.actual} °C` : "0 °C",
      color: "bg-red-900"
    },
    {
      title: "Humidity (Act)", 
      icon: "💧",
      value: humidity.actual !== undefined? `${humidity.actual} %` : "0 %",
      color: "bg-blue-900"
    },
    {
      title: "Wind Speed (Act)",
      icon: "🌬",
      value: windSpeed.actual !== undefined? `${windSpeed.actual} m/s` : "0 m/s",
      color: "bg-teal-900"
    },
    {
      title: "Air Pressure (Act)",
      icon: "⏱",
      value: airPressure.actual !== undefined? `${airPressure.actual} hPa` : "0 hPa",
      color: "bg-purple-900"
    },
    {
      title: "Radiation (Act)",
      icon: "☀",
      value: radiation.actual !== undefined? `${radiation.actual} W/m²` : "0 W/m²",
      color: "bg-amber-900"
    },
    {
      title: "Evaporation (ET0)",
      icon: "💦",
      value: evaporation.evapoTranspiration !== undefined? `${evaporation.evapoTranspiration} mm` : "0 mm",
      color: "bg-indigo-900",
    //   details: [
    //     { label: "Temperature", value: evaporation.temperature !== undefined? `${evaporation.temperature} °C` : "0 °C" }
    //   ]
    }
  ];

  if (isLoading && !lastUpdate) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-500">Error loading weather data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-bold">Weather Station</h2>
        {lastUpdate && (
          <p className="text-sm text-gray-500">Last updated: {lastUpdate}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherSections.map((section, index) => (
          <Card key={index} className="w-full">
            <CardHeader className={`${section.color} py-2`}>
              <div className="flex justify-between items-center">
                <p className="font-bold text-white">{section.icon} {section.title}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-center my-2">{section.value}</p>
                
                {/* {section.details && section.details.length > 0 && (
                  <table className="w-full mt-2">
                    <tbody>
                      {section.details.map((detail, idx) => (
                        <tr key={idx} className="border-t">
                          <th className="py-2 font-medium text-gray-700 text-left">{detail.label}</th>
                          <td className="py-2 text-right font-medium text-gray-600">{detail.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )} */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AwsComponent;