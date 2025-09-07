// src/components/MapDisplay.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '8px',
  marginTop: '10px'
};

function MapDisplay({ lat, lng, accuracy }) {
  const position = [lat, lng];
const fillBlueOptions = { fillColor: 'blue' };

  return (
    <MapContainer center={position} zoom={15} style={mapContainerStyle}>
      {/* This TileLayer uses the free OpenStreetMap map images */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
       {accuracy && (
        <Circle center={position} pathOptions={fillBlueOptions} radius={accuracy} />
      )}
      
      <Marker position={position}>
        <Popup>
          Submission Location
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapDisplay;