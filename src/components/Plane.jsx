// src/components/Plane.jsx
import React from "react";

const Plane = ({ plane }) => {
  const spacing = 50; // Adjust as needed for spacing
  const { reserveCord } = plane;

  const calculateAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };

  return (
    <g key={plane._id}>
      {reserveCord.map((cord, index) => {
        if (index < reserveCord.length - 1) {
          const nextCord = reserveCord[index + 1];
          return (
            <line
              key={`${cord.x}-${cord.y}-${nextCord.x}-${nextCord.y}`}
              x1={cord.x * spacing + 10}
              y1={cord.y * spacing + 10}
              x2={nextCord.x * spacing + 10}
              y2={nextCord.y * spacing + 10}
              stroke="red"
              strokeWidth="2"
            />
          );
        }
        return null;
      })}
      <text
        x={reserveCord[0].x * spacing + 10}
        y={reserveCord[0].y * spacing + 10}
        fontSize="20"
        fill="blue"
        transform={`rotate(${calculateAngle(
          reserveCord[0].x,
          reserveCord[0].y,
          reserveCord[1].x,
          reserveCord[1].y
        )}, ${reserveCord[0].x * spacing + 10}, ${reserveCord[0].y * spacing + 10})`}
      >
        ✈️
      </text>
    </g>
  );
};

export default Plane;