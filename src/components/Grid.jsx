import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import GridCell from "./GridCell";
import Plane from "./Plane";
import "../assets/styles/Grid.css";

const Grid = () => {
  const { cords, flights, airports, selectedAirports, selectedFlight } =
    useSocket();
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const totalPlanes = 10;
  const remainingPlanes = totalPlanes - flights.length;

  const getColor = (cord) => {
    if (cord.reserve) {
      // console.log(cord.x,cord.y, ' - reserve');
      return "red";
    }
    switch (cord.weather) {
      // case "good":
      //   return "green";
      // case "rainy":
      //   return "blue";
      // case "stormy":
      //   return "red";
      default:
        return "gray";
    }
  };

  const handleZoomIn = () => {
    // console.log('zoom in', zoomLevel);
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 10));
  };

  const handleZoomOut = () => {
    // console.log('zoom out', zoomLevel);
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1));
  };

  const renderGrid = () => {
    const gridSize = 20;
    const spacing = 35 + zoomLevel * 5;
    const svgSize = spacing * gridSize;
    return (
      <div className="grid">
        <svg
          width={svgSize}
          height={svgSize}
          className="grid-svg"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {Array.from({ length: gridSize }).map((_, y) =>
            Array.from({ length: gridSize }).map((_, x) => {
              const cord = cords.find((c) => c.x === x && c.y === y) || {};
              const weather = cord.weather;
              const fillColor = getColor(cord);
              const airport = airports.find((o) => o.x === x && o.y === y);

              const isHighlighted = airports.some(
                (airport) =>
                  (airport.airPortName === selectedAirports.start ||
                    airport.airPortName === selectedAirports.goal) &&
                  airport.x === x &&
                  airport.y === y
              );

              const isAirport = airports.some((o) => o.x === x && o.y === y);
              return (
                <GridCell
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  fillColor={fillColor}
                  isAirport={isAirport}
                  isHighlighted={isHighlighted}
                  airportName={airport ? airport.airPortName : null}
                  showCoordinates={showCoordinates}
                  spacing={spacing}
                  weather={weather}
                />
              );
            })
          )}
          {flights &&
            flights.map((plane, index) => {
              const isSelected = plane._id === selectedFlight?._id;
              return (
                <Plane
                  key={plane._id}
                  flightId={plane.flightId}
                  plane={plane}
                  index={index}
                  isSelected={isSelected}
                  spacing={spacing}
                />
              );
            })}
        </svg>
      </div>
    );
  };

  return (
    <div className="grid-container">
      <div className="tracker">Flight Navigation System</div>
      {renderGrid()}
      <div className="grid-info">
        <div className="remaining-planes">
          {Array.from({ length: remainingPlanes }).map((_, index) => (
            <React.Fragment key={index}>
              <p className="plane-index">{index + 1}</p>
              <span className={`plane-icon plane-color-${index % 5}`}>✈️</span>
            </React.Fragment>
          ))}
        </div>
        <button onClick={() => setShowCoordinates(!showCoordinates)}>
          {showCoordinates ? "Show Airport Names" : "Show Coordinates"}
        </button>
        <div className="zoom-controls">
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleZoomIn}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Grid;
