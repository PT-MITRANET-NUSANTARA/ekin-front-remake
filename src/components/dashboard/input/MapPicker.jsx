import { MapContainer, TileLayer } from 'react-leaflet';
import CoordinatePicker from './CoordinatePicker';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MapPicker = ({ form, handleValuesChange, realtimeData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
  }, []);

  return (
    <div style={{ height: '300px', marginBottom: '16px' }}>
      <MapContainer center={[-0.7893, 113.9213]} zoom={5} style={{ height: '100%', width: '100%' }} whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CoordinatePicker
          onChange={(coords) => {
            form.setFieldsValue({ latitude: coords[0], longitude: coords[1] });
            handleValuesChange({ latitude: coords[0], longitude: coords[1] });
          }}
          initialPosition={realtimeData?.latitude && realtimeData?.longitude ? [realtimeData.latitude, realtimeData.longitude] : null}
        />
      </MapContainer>
    </div>
  );
};

MapPicker.propTypes = {
  form: PropTypes.object.isRequired,
  handleValuesChange: PropTypes.func.isRequired,
  realtimeData: PropTypes.object
};

export default MapPicker;
