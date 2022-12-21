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
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

function SetViewOnClick() {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom())
  })

  return null
}

export default function Map() {
  const [permanentMarkers, setPermanentMarkers] = useState([
    { description: 'untitled', position: [-7.12435755, 112.7190227512834] },
  ]);
  const [markers, setMarkers] = useState([
    { description: 'untitled', position: [-7.12435755, 112.7190227512834] },
  ]);

  const [isEdit, setIsEdit] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  function addMarkers(e) {
    if (isEdit) {
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
    setEditedIndex(parseInt(id));
    setEditedValue(markers[parseInt(id)].description);
  };

  function handleDelete(id) {
    setMarkers(
      markers.filter((_, index) => index !== parseInt(id))
    );
    setIsEdit(false);
  };

  function handleEditChange(e) {
    setEditedValue(e.currentTarget.value);
  };

  function handleExitEdit() {
    setEditedIndex(null);
    setEditedValue('');
    setIsEdit(false);
  };

  function handleMarkerUpdate() {
    let marks = markers.filter((mark, index) => index !== editedIndex);
    setMarkers([
      ...marks,
      { description: editedValue, position: markers[editedIndex].position },
    ]);
    handleExitEdit();
    setIsEdit(false);
  };

  function handleEditMarker() {
    setIsEdit(true);
  };

  function handleUpdateMarker() {
    setPermanentMarkers(markers);
    setIsEdit(false);
  };

  function handleDismissEdit() {
    setIsEdit(false);
    setMarkers(permanentMarkers);
  };

  return (
    <>
      <p className="mb-4">Tips : you can click or drag on map to move</p>
      <div className="flex items-center gap-2 justify-end mb-4">
        {isEdit ? (
          <>
            <Button.secondary onClick={handleDismissEdit}>
              Cancel
            </Button.secondary>
            <Button onClick={handleUpdateMarker}>Update</Button>
          </>
        ) : (
          <Button onClick={handleEditMarker}>Add / Edit Marker</Button>
        )}
      </div>
      {isEdit && <p className="mb-4">Tips : you can click on map to add a new marker or click to existing blue marker to edit them</p>}
      <MapContainer
        center={[-7.12435755, 112.7190227512834]}
        zoom={20}
        scrollWheelZoom={false}
        className="h-[30rem] z-[48] rounded"
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        closePopupOnClick={true}
      >
        <MyMap />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <SetViewOnClick />

        {markers.map((marker, index) => {
          return (
            <Marker position={marker.position} key={index}>
              <Tooltip>
                <div className="px-4 text-sm font-medium">
                  {marker.description}
                </div>
              </Tooltip>
              <Popup>
                <div className="w-32">
                  {editedIndex === index && isEdit ? (
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
                        title='Save New Title'
                        onClick={handleMarkerUpdate}
                        className="w-full mb-2 text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-white bg-green-600 hover:bg-green-700 border border-neutral-300"
                      >
                        Save
                      </button>
                      <button
                        title='Cancel Edit'
                        onClick={handleExitEdit}
                        className="w-full text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-neutral-800 bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}

                  {isEdit ? (
                    <>
                      <h1 className="font-semibold mb-4 text-center">{marker.description}</h1>
                      <div className="flex items-center gap-2">
                        <button
                          title='Delete'
                          onClick={() => handleDelete(index)}
                          className="w-full flex items-center justify-center text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-neutral-800 bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </button>
                        <button
                          title='Edit'
                          onClick={() => handleEdit(index)}
                          className="w-full flex items-center justify-center text-xs transition-all outline-none px-4 py-2 rounded font-semibold text-neutral-800 bg-gray-50 hover:bg-gray-100 border border-neutral-300"
                        >
                          <PencilIcon className="h-4 w-4 text-sky-500" />
                        </button>
                      </div>
                    </>
                  ) :
                    <h1 className="text-center font-semibold">{marker.description}</h1>
                  }
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
