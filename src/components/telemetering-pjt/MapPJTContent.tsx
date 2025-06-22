import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/store/dataStore';
import { IoWaterOutline, IoRainyOutline, IoMapOutline, IoLocationOutline, IoRefreshOutline } from 'react-icons/io5';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Declare Leaflet types to avoid TypeScript errors
declare global {
  interface Window {
    L: any;
  }
}

type LatLngTuple = [number, number];

const MapPJTContent: React.FC = () => {
    const { 
      telemeterData,
      loading: { telemetering: loading },
      telemeterError: error,
      activeTab: { telemetering: activeTab },
      fetchTelemeterData,
      setActiveTelemeteringTab,
    } = useDataStore();
  
    const getLatestValidReading = (data: any[], key: 'wl' | 'rf') => {
      const sortedData = [...data].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      const validReading = sortedData.find(reading => reading[key] !== '-');
      return validReading ? validReading[key] : '-';
    };
  
    const toggleMapType = (type: 'waterlevel' | 'rainfall') => {
      setActiveTelemeteringTab(type);
    };
  
    if (loading) {
      return (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-4 text-white">
              <IoRefreshOutline className="w-8 h-8 animate-spin" />
              <span className="text-xl font-medium">Loading map data...</span>
            </div>
          </CardContent>
        </Card>
      );
    }
  
    if (error) {
      return (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-400 text-xl font-medium mb-4">{error}</div>
              <button
                onClick={() => fetchTelemeterData()}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors backdrop-blur-sm"
              >
                Retry Loading Data
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }
  
    const stations = activeTab === 'waterlevel' ? telemeterData.Waterlevel : telemeterData.Rainfall;
  
    const markers = stations?.map(station => {
      const { x, y, name } = station.header;
      if (x && y) {
        const lat = parseFloat(y);
        const lng = parseFloat(x);
        if (!isNaN(lat) && !isNaN(lng)) {
          const value = getLatestValidReading(station.data, activeTab === 'waterlevel' ? 'wl' : 'rf');
          const unit = activeTab === 'waterlevel' ? 'm' : 'mm';
          const iconColor = activeTab === 'waterlevel' ? '#0891b2' : '#3b82f6'; // cyan-600 and blue-500
  
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
  
          return (
            <Marker key={name} position={[lat, lng]} icon={customIcon}>
              <Popup className="custom-popup">
                <div className="p-2 bg-white rounded-lg shadow-lg">
                  <div className="font-bold text-slate-800 mb-2 flex items-center">
                    {activeTab === 'waterlevel' ? 
                      <IoWaterOutline className="w-4 h-4 mr-1 text-cyan-600" /> : 
                      <IoRainyOutline className="w-4 h-4 mr-1 text-blue-600" />
                    }
                    {name}
                  </div>
                  <div className="text-slate-600 text-sm">
                    <strong>Current {activeTab === 'waterlevel' ? 'Water Level' : 'Rainfall'}:</strong> {value} {unit}
                  </div>
                  <div className="text-slate-500 text-xs mt-1 flex items-center">
                    <IoLocationOutline className="w-3 h-3 mr-1" />
                    {y}, {x}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        }
      }
      return null;
    });
  
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardContent className="p-0">
          {/* Enhanced Tab Buttons */}
          <div className="flex space-x-4 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
            <button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'waterlevel' 
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-xl scale-105 border-2 border-cyan-400' 
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-slate-800 backdrop-blur-sm border-2 border-slate-300 hover:border-cyan-400'
              }`}
              onClick={() => toggleMapType('waterlevel')}
            >
              <IoWaterOutline className="w-5 h-5" />
              <span>Water Level Stations ({telemeterData.Waterlevel?.length || 0})</span>
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'rainfall' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-105 border-2 border-blue-400' 
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-slate-800 backdrop-blur-sm border-2 border-slate-300 hover:border-blue-400'
              }`}
              onClick={() => toggleMapType('rainfall')}
            >
              <IoRainyOutline className="w-5 h-5" />
              <span>Rainfall Stations ({telemeterData.Rainfall?.length || 0})</span>
            </button>
          </div>
          
          {/* Map Container with Enhanced Styling */}
          <div className="relative overflow-hidden rounded-b-lg">
            <MapContainer 
              center={[-7.305318, 109.644628]} 
              zoom={9} 
              style={{ height: '500px', width: '100%' }}
              className="z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers}
            </MapContainer>
            
            {/* Station Count Overlay */}
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/50">
              <div className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                {activeTab === 'waterlevel' ? 
                  <IoWaterOutline className="w-4 h-4 text-cyan-600" /> : 
                  <IoRainyOutline className="w-4 h-4 text-blue-600" />
                }
                <span>{stations?.length || 0} Active Stations</span>
              </div>
            </div>

            {/* Empty State Overlay */}
            {(!stations || stations.length === 0) && !loading && (
              <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 text-center shadow-xl">
                  <IoMapOutline className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Station Data Available</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'waterlevel' ? 'Water level' : 'Rainfall'} stations data is not available.
                  </p>
                  <button
                    onClick={() => fetchTelemeterData()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default MapPJTContent;
  