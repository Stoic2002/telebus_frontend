import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TelemeterData } from '@/types/telemeteringPjtTypes';
import axios from 'axios';
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
    const [telemeterData, setTelemeterData] = useState<TelemeterData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'waterlevel' | 'rainfall'>('waterlevel');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [waterLevelRes, rainfallRes] = await Promise.all([
            axios.get('/api/pjt-wl'),
            axios.get('/api/pjt-rf')
          ]);
          setTelemeterData({
            Waterlevel: waterLevelRes.data.Waterlevel,
            Rainfall: rainfallRes.data.Rainfall
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch telemetry data');
          setLoading(false);
        }
      };
  
      fetchData();
  
      // Refresh data every 5 minutes
      const intervalId = setInterval(fetchData, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, []);
  
    const getLatestValidReading = (data: any[], key: 'wl' | 'rf') => {
      const sortedData = [...data].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      const validReading = sortedData.find(reading => reading[key] !== '-');
      return validReading ? validReading[key] : '-';
    };
  
    const toggleMapType = (type: 'waterlevel' | 'rainfall') => {
      setActiveTab(type);
    };
  
    if (loading) {
      return (
        <div className="p-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">Loading map data...</div>
            </CardContent>
          </Card>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-red-500 text-center">{error}</div>
            </CardContent>
          </Card>
        </div>
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
          const iconColor = activeTab === 'waterlevel' ? 'blue' : 'green';
  
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
  
          return (
            <Marker key={name} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <strong>{name}</strong><br />
                Current {activeTab === 'waterlevel' ? 'Water Level' : 'Rainfall'}: {value} {unit}<br />
                Coordinates: {y}, {x}
              </Popup>
            </Marker>
          );
        }
      }
      return null;
    });
  
    return (
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-green-500 to-gray-300 text-white rounded-t-md">
            <CardTitle>Telemetering Perum Jasa Tirta - Map View</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex space-x-2 p-2 bg-gray-50">
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'waterlevel' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleMapType('waterlevel')}
              >
                Water Level Stations
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'rainfall' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleMapType('rainfall')}
              >
                Rainfall Stations
              </button>
            </div>
            <MapContainer center={[-7.305318, 109.644628]} zoom={9} style={{ height: '400px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default MapPJTContent;
  