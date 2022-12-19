import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useState } from 'react';
import Button from '@components/Button';
import MinimapControl from "./MinimapControl"

export default function Maps() {

  const [markers, setMarkers] = useState([
    { description: 'Auditorium', position: [-7.12609, 112.72264] },
    { description: 'Cakra', position: [-7.12930, 112.72472] },
    { description: 'Rektorat', position: [-7.12907, 112.72229] },
  ]);

  const [isAddNewMarker, setIsAddNewMarker] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  const [isEditingOldMarker, setIsEditingOldMarker] = useState(false)

  function addMarkers(e) {
    if (isAddNewMarker) {
      setMarkers([...markers, { description: 'untitled', position: [e.latlng.lat, e.latlng.lng] }]);
      handleExitEdit();
    }
  };

  function MyMap() {
    const map = useMapEvent({
      click: addMarkers,
    });
    return null;
  }

  function handleEdit(id) {
    setIsEditingOldMarker(true)
    setEditedIndex(parseInt(id));
    setEditedValue(markers[parseInt(id)].description);
  };

  function handleDelete(id) {
    setMarkers(
      markers.filter((_, index) => index !== parseInt(id))
    );
    setIsAddNewMarker(false);
  };

  function handleEditChange(e) {
    setEditedValue(e.currentTarget.value);
  };

  function handleExitEdit() {
    setIsEditingOldMarker(true)
    setEditedIndex(null);
    setEditedValue('');
    setIsAddNewMarker(false);
  };

  function handleMarkerUpdate() {
    let marks = markers.filter((_, index) => index !== editedIndex);
    setMarkers([
      ...marks,
      { description: editedValue, position: markers[editedIndex].position },
    ]);
    handleExitEdit();
    setIsAddNewMarker(false);
  };

  return (
    <>
      <table className="border rounded text-sm mb-4">
        <thead>
          <tr>
            <td className="px-2.5 py-1 border font-medium">Name</td>
            <td className="px-2.5 py-1 border font-medium">Latitude</td>
            <td className="px-2.5 py-1 border font-medium">Longtitude</td>
          </tr>
        </thead>
        <tbody>
          {markers.map((marker, index) => (
            <tr key={index + 1} className="border">
              <td className="px-2.5 py-1 border">{marker.description}</td>
              <td className="px-2.5 py-1 border">{marker.position[0]}</td>
              <td className="px-2.5 py-1 border">{marker.position[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 justify-end mb-4">
        {isAddNewMarker ?
          <Button.success onClick={() => setIsAddNewMarker(false)}>Done</Button.success>
          :
          <Button onClick={() => setIsAddNewMarker(true)}>Add Marker</Button>
        }
      </div>
      {isAddNewMarker && <p className="mb-4">Tips : click on map to add a new marker</p>}

      <MapContainer
        center={[-7.12817, 112.72430]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-[32rem] z-[48] rounded"
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        closePopupOnClick={true}
      >
        <MinimapControl position="topright" zoom={10} />
        <MyMap />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => {
          return (
            <Marker position={marker.position} key={index}>
              <Tooltip>
                <div className="px-4 text-sm font-semibold">
                  {marker.description}
                </div>
              </Tooltip>
              <Popup>
                <div className="w-32">
                  {editedIndex === index && isEditingOldMarker ? (
                    <div className="mb-8">
                      <div className="mb-4">
                        <label className="text-sm text-left font-medium">Name</label>
                        <input
                          name="description"
                          value={editedValue}
                          placeholder="Description"
                          onChange={handleEditChange}
                          type="text"
                          className="text-sm transition-all font-medium bg-white w-full px-4 py-[0.4rem] rounded-md mt-2 border focus:ring-1 ring-gray-300 focus:ring-blue-500 border-gray-300 focus:border-blue-500 outline-none"
                          autoComplete="off"
                          required
                        />
                      </div>
                      <button
                        title='Save New Name'
                        onClick={handleMarkerUpdate}
                        className="w-full mb-2 text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-white bg-green-600 hover:bg-green-700 border border-neutral-300"
                      >
                        Save
                      </button>
                      <button
                        title='Cancel Edit Name'
                        onClick={handleExitEdit}
                        className="w-full text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-neutral-800 bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}

                  <div>
                    <h1 className="font-semibold mb-4 text-center">{marker.description}</h1>
                    <div className="flex items-center gap-2">
                      <button
                        title='Delete'
                        onClick={() => handleDelete(index)}
                        className="w-full flex items-center justify-center text-xs text-red-500 transition-all outline-none px-4 py-2 rounded font-semibold bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                      >
                        Delete
                      </button>
                      <button
                        title='Edit'
                        onClick={() => handleEdit(index)}
                        className="w-full flex items-center justify-center text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-sky-500 bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
