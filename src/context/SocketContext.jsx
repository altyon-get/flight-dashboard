import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket"; // Adjust the path if necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [cords, setCords] = useState([]);
  const [flights, setFlights] = useState([]);
  const [flightLogs, setFlightLogs] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [scheduledFlights, setScheduledFlights] = useState([]);
  const [planeIds, setPlaneIds] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState({
    start: null,
    goal: null,
  });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [highlightRoute, setHighlightRoute] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on("flightLog", (data) => {
      console.log(data, "flight log");
      setFlightLogs((prevLogs) => [...prevLogs, data]);
    });

    // socket.on("stopFlight", (data) => {
      // console.log(data, "flight log");
      // setFlightLogs((prevLogs) => [...prevLogs, data]);
    // });

    socket.on("initData", ({ cords, flights, airport, airplane }) => {
      // console.log("cord data", cords);
      setCords(cords);
      setFlights(flights);
      
      const planeIdsArray = flights.map((flight) => flight?.flightId);
      setPlaneIds(planeIdsArray);

      const names = airplane.map((plane) => plane?.airPlaneName);
      setPlanes(names);

      setAirports(airport);
      
      toast.success("All data fetched successfully");
    });

    socket.on('globalData', ({cordAll,flightAll})=>{
      console.log('global data fetched', cordAll,flightAll);
      setCords(cordAll);
      setFlights(flightAll);
      const planeIdsArray = flightAll.map((flight) => flight?.flightId);
      setPlaneIds(planeIdsArray); 
    });

    socket.on("weatherUpdate", (updatedCords) => {
      console.log("second socket data succesful");
      setCords((prevCords) => {
        const cordsMap = new Map(prevCords.map((c) => [`${c.x},${c.y}`, c]));
        updatedCords.forEach((c) => cordsMap.set(`${c.x},${c.y}`, c));
        return Array.from(cordsMap.values());
      });
    });

    // socket.on("getFlight", (data) => {
    //   setFlights(data);
    //   const planeIdsArray = data.map((flight) => flight?.flightId);
    //   setPlaneIds(planeIdsArray);
    //   console.log("third socket data succesful");
    // });

    socket.on("getAirPlane", (planeNames) => {
      const names = planeNames.map((plane) => plane?.airPlaneName);
      setPlanes(names);
      console.log("fourth socket data succesful");
    });

    socket.on("getAirports", (airportNames) => {
      setAirports(airportNames);
      console.log("fifth socket data succesful");
    });

    // socket.on("flightCreated", (data) => {
    //   setScheduledFlights((prev) => [...prev, data.planeId]);
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createFlight = (flightData) => {
    socket.emit("createFlight", flightData);
  };

  const changeWeather = (weatherData) => {
    console.log(weatherData, "weather data");
    socket.emit("changeWeather", weatherData);
  };

  return (
    <SocketContext.Provider
      value={{
        cords,
        flights,
        planes,
        airports,
        scheduledFlights,
        createFlight,
        planeIds,
        selectedAirports,
        setSelectedAirports,
        selectedFlight,
        setSelectedFlight,
        flightLogs,
        setFlightLogs,
        setHighlightRoute,
        setScheduledFlights,
        changeWeather
      }}
    >
      {children}
      <ToastContainer />
    </SocketContext.Provider>
  );
};
