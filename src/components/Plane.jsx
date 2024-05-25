// src/components/Plane.jsx
import PropTypes from "prop-types";
import io from "socket.io-client";

const Plane = ({ plane, index, isSelected , spacing, flightId}) => {
  // const spacing = 40; 
  // Adjust as needed for spacing
  const { reserveCord } = plane;
  // console.log('index: ', index, isSelected)
  const calculateAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };

  if (reserveCord.length === 0) return null;

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
              stroke= {isSelected ? "red" : "#ccc"}
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
        // fill="blue"
        transform={`rotate(${
          calculateAngle(
            reserveCord[0].x,
            reserveCord[0].y,
            reserveCord[reserveCord.length > 1 ? 1 : 0].x,
            reserveCord[reserveCord.length > 1 ? 1 : 0].y
          ) + 40
        }, ${reserveCord[0].x * spacing + 10}, ${
          reserveCord[0].y * spacing + 10
        })`}
      >
        ✈️
        {10-index}
      </text>
        {/* {flightId} */}
    </g>
  );
};

Plane.propTypes = {
  plane: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    reserveCord: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Plane;
