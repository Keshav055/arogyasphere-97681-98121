import React from "react";

/**
 * Static Community Resource Map – stub using static SVG for demo.
 * Shows pins for clinics, gyms, events, filtered by type.
 */
const fakePlaces = [
  { name: "Local Health Clinic", lat: 25.7, lon: 81.0, type: "clinic" },
  { name: "Yoga Center", lat: 25.7105, lon: 81.0005, type: "mind" },
  { name: "Pharmacy", lat: 25.71, lon: 81.01, type: "pharmacy" },
  { name: "Fitness Gym", lat: 25.715, lon: 81.008, type: "fitness" },
  { name: "Public Health Camp", lat: 25.712, lon: 81.007, type: "event" }
];

const mapWidth = 360, mapHeight = 196;

function latlonToXY(lat, lon) {
  // Fake mapping for demo: normalize to a rectangle
  const minLat = 25.7, maxLat = 25.72, minLon = 80.99, maxLon = 81.02;
  const x = ((lon - minLon) / (maxLon - minLon)) * mapWidth;
  const y = mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight; // invert Y for svg
  return { x, y };
}

const pinColors = {
  clinic: "#34a853", mind: "#3c83af", pharmacy: "#f8823c", fitness: "#a123bf", event: "#fb1e46"
};

const ResourceMapPage = () => (
  <div className="container" style={{ marginTop: 24, maxWidth: 420 }}>
    <h2>Community Resource Map</h2>
    <div className="card" style={{ textAlign: "center", padding: 16 }}>
      <svg width={mapWidth} height={mapHeight} style={{ background: "#e3f5e0", borderRadius: 18 }}>
        {/* Fake boundary box/map area */}
        <rect x="8" y="8" rx="14" ry="14" width={mapWidth - 16} height={mapHeight - 16} fill="#fbfdf7" stroke="#bfe2eb" />
        {/* Render test markers */}
        {fakePlaces.map((place, i) => {
          const { x, y } = latlonToXY(place.lat, place.lon);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill={pinColors[place.type] || "#3c83af"} opacity="0.92" />
              <text x={x} y={y + 23} fill="#444" fontSize="12" textAnchor="middle">{place.name}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 12, fontSize: 15, color: "#3c83af" }}>
        <b>Markers:</b> Local clinics, Yoga, Pharmacy, Gym, Events<br />
        (Demo static map. Real maps TBA.)
      </div>
    </div>
  </div>
);

export default ResourceMapPage;
