import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker Fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Refresh map size
function ResizeMap() {

  const map = useMap();

  useEffect(() => {

    const timer = setTimeout(() => {

      map.invalidateSize();

    }, 100);

    return () => clearTimeout(timer);

  }, [map]);

  return null;

}

// Click Marker
function LocationMarker({ onLocationSelect, loading }) {

  const [position, setPosition] = useState(null);

  useMapEvents({

    click(e) {

      if (loading) return;

      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      onLocationSelect(lat, lng);

    },

  });

  if (!position) return null;

  return (

    <Marker position={position}>

      <Popup>

        <strong>Selected Location</strong>

        <br />

        {position[0].toFixed(6)}

        <br />

        {position[1].toFixed(6)}

      </Popup>

    </Marker>

  );

}

export default function DisasterMap({

  onLocationSelect,

  loading,

}) {

  return (

    <div className="relative h-[720px] w-full rounded-2xl overflow-visible border border-slate-800 shadow-xl">

      {/* Disable map while loading */}

      {loading && (

        <div className="absolute inset-0  bg-black/20 backdrop-blur-[2px] flex items-center justify-center">

          <div className="bg-slate-900/90 rounded-xl px-6 py-3 border border-slate-700">

            <p className="text-white font-medium">

              AI is analyzing this location...

            </p>

          </div>

        </div>

      )}

      <MapContainer

        center={[10.8505, 76.2711]}

        zoom={8}

        className="h-full w-full"

        zoomControl={true}

        scrollWheelZoom={true}

        dragging={!loading}

        doubleClickZoom={!loading}

        touchZoom={!loading}

        keyboard={!loading}

        zoomAnimation={false}

        fadeAnimation={false}

        markerZoomAnimation={false}

        inertia={false}

        worldCopyJump={false}

        preferCanvas={true}

      >

        <ResizeMap />

        <TileLayer

          attribution="© OpenStreetMap"

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          updateWhenIdle={true}

          updateWhenZooming={false}

          keepBuffer={5}

        />

        <LocationMarker

          loading={loading}

          onLocationSelect={onLocationSelect}

        />

      </MapContainer>

    </div>

  );

}