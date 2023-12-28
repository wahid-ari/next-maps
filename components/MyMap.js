import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import "leaflet-geosearch/dist/geosearch.css";

export default function MyMap({ className, name, marker, setMarker, enableEdit, enableSearch, ...props }) {
  function MapEvent() {
    const map = useMapEvent('click', (e) => {
      setMarker([e.latlng.lat, e.latlng.lng]);
    });
    return null;
  }

  // https://codesandbox.io/p/sandbox/search-box-implementation-in-react-leaflet-v310-sx0rp?file=%2Fsrc%2FMapWrapper.jsx%3A9%2C1
  function LeafletgeoSearch() {
    const map = useMap();
    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        // https://github.com/smeijer/leaflet-geosearch?tab=readme-ov-file#geosearchcontrol
        provider,
        autoCompleteDelay: 150,
        showMarker: false,
      });
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, []);
    return null;
  }

  return (
    <MapContainer
      center={marker}
      zoom={5}
      scrollWheelZoom={true}
      className={`h-96 rounded ${className}`}
      zoomAnimation={true}
      fadeAnimation={true}
      markerZoomAnimation={true}
      closePopupOnClick={true}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {enableEdit && <MapEvent />}
      {enableSearch && <LeafletgeoSearch />}
      <Marker position={marker}>
        <Tooltip>
          <div className='px-4 text-sm font-medium'>{name || 'Destination'}</div>
        </Tooltip>
        <Popup>{name || 'Destination'}</Popup>
      </Marker>
    </MapContainer>
  );
}
