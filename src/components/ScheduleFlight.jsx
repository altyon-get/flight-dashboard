import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import "../assets/styles/FlightSchedule.css";
import socket from "../services/socket"; // Adjust the path if necessary

const FlightSchedule = () => {
  const [planeName, setPlaneName] = useState("");
  const [startId, setStartId] = useState("");
  const [goalId, setGoalId] = useState("");
  const [depTime, setDepTime] = useState("");
  const [arrTime, setArrTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const {
    planes,
    airports,
    createFlight,
    setSelectedAirports,
    setScheduledFlights,
  } = useSocket();

  const handleSubmit = (e) => {
    console.log("Submitting flight schedule...");
    e.preventDefault();
    if (startId === goalId) {
      alert("Source and Destination cannot be the same.");
      return;
    }

    const flightData = {
      airPlaneName: planeName,
      departureAirport: startId,
      destinationAirport: goalId,
      departureTime: depTime,
      // destinationTime: depTime
    };

    setLoading(true);
    setResponse(null);
    createFlight(flightData);

    socket.on("flightCreated", (data) => {
      console.log('flightCreated', data);
      setScheduledFlights((prev) => [...prev, data.planeId]);
      setResponse(data);
      setLoading(false);
      const departureTime = new Date(`1970-01-01T${depTime}Z`);
      const arrivalTime = new Date(
        departureTime.getTime() + data.reserveCord.length * 3000
      );
      // console.log('gap:', data.reserveCord.length * 4000);
      // console.log("Expected arrival time:", arrivalTime.toISOString().slice(11, 19));

      setArrTime(arrivalTime.toISOString().slice(11, 19));
      setSelectedAirports([]);
    });
  };

  const handleAirportChange = (e, type) => {
    const value = e.target.value;
    if (type === "start") {
      setStartId(value);
      setSelectedAirports((prev) => ({ ...prev, start: value }));
    } else if (type === "goal") {
      setGoalId(value);
      setSelectedAirports((prev) => ({ ...prev, goal: value }));
    }
  };

  return (
    <div className="flight-schedule">
      <h2>Schedule Flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Plane:</label>
          <select
            value={planeName}
            onChange={(e) => setPlaneName(e.target.value)}
            required
          >
            <option value="">Select Plane</option>
            {planes.map((plane) => (
              <option key={plane} value={plane}>
                {plane}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Source:</label>
          <select
            value={startId}
            onChange={(e) => handleAirportChange(e, 'start')}
            required
          >
            <option value="">Select Source</option>
            {airports
              .filter(({ airPortName }) => airPortName !== goalId)
              .map(({ airPortName }) => (
                <option key={airPortName} value={airPortName}>
                  {airPortName}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <select
            value={goalId}
            onChange={(e) => handleAirportChange(e, 'goal')}
            required
          >
            <option value="">Select Destination</option>
            {airports
              .filter(({ airPortName }) => airPortName !== startId)
              .map(({ airPortName }) => (
                <option key={airPortName} value={airPortName}>
                  {airPortName}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Departure Time (HH:MM:SS):</label>
          <input
            type="text"
            pattern="\d{2}:\d{2}:\d{2}"
            value={depTime}
            onChange={(e) => setDepTime(e.target.value)}
            placeholder="HH:MM:SS"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Flight"}
        </button>
      </form>
      {response && (
        <div className="response">
          <h3>Flight Scheduled Successfully</h3>
          <p>Flight Name: {planeName}</p>
          <p>Expected Arrival Time: {arrTime}</p>
        </div>
      )}
    </div>
  );
};

export default FlightSchedule;
