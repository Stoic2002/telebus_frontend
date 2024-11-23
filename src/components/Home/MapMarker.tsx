import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Location } from '../../types/mapTypes';
import { FaWater, FaBolt } from 'react-icons/fa'; // Import icons from react-icons or any other icon library

interface MapMarkerProps {
  location: Location;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ location }) => (
  <Marker position={location.position}>
    <Popup>
      <div className="bg-white shadow-lg rounded-lg p-4" style={{ minWidth: '200px' }}>
        <h3 className="text-lg font-bold text-center mb-2">{location.name}</h3>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <FaWater className="text-blue-500 mr-2" />
            <span className="font-medium">TMA</span>
            <span>: {location.waterLevel} mdpl</span>
          </div>
          <div className="flex items-center">
            <FaBolt className="text-yellow-500 mr-2" />
            <span className="font-medium">Load</span>
            <span>: {location.loadUnit} MW</span>
          </div>
        </div>
      </div>
    </Popup>
  </Marker>
);