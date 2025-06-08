import { useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

/* eslint-disable react/prop-types */
const CoordinatePicker = ({ onChange, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);

  useMapEvents({
    click(e) {
      const newCoords = [e.latlng.lat, e.latlng.lng];
      setPosition(newCoords);
      onChange(newCoords);
    }
  });

  return position ? <Marker position={position} /> : null;
};

export default CoordinatePicker;
