import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import "../assets/styles/AllFlights.css";

const AllFlights = () => {
  const { flights, setSelectedFlight, selectedFlight } = useSocket();
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("plane");
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  useEffect(() => {
    setFilteredFlights(flights);
  }, [flights]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterFlights(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    filterFlights(searchTerm);
  };

  const filterFlights = (term) => {
    if (!term) {
      setFilteredFlights(flights);
      return;
    }

    const filtered = flights.filter((flight) => {
      if (searchType === "plane") {
        return flight.airPlaneName.toLowerCase().includes(term.toLowerCase());
      } else if (searchType === "source") {
        return flight.departureAirport
          .toLowerCase()
          .includes(term.toLowerCase());
      } else if (searchType === "destination") {
        return flight.destinationAirport
          .toLowerCase()
          .includes(term.toLowerCase());
      }
      return false;
    });
    setFilteredFlights(filtered);
  };

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (flight) => {
    // console.log(flight.flightId, " -clicked");
    setSelectedFlight(flight);
  };

  return (
    <div className="all-flights-container">
      <h1>All Flights</h1>
      <div className="search-bar">
        <select onChange={handleSearchTypeChange} value={searchType}>
          <option value="plane">Plane Name</option>
          <option value="source">Source</option>
          <option value="destination">Destination</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="flight-table">
        <thead>
          <tr>
            <th>F.No</th>
            <th>F.Name</th>
            <th>F.Source</th>
            <th>F.Dest</th>
          </tr>
        </thead>
        <tbody>
          {currentFlights.length > 0 ? (
            currentFlights.map((flight, index) => (
              <tr
                key={flight._id}
                onClick={() => handleRowClick(flight)}
                className={selectedFlight?._id === flight._id ? 'selectedRow' : ''}
              >
                <td>{10-index}</td>
                <td>{flight.airPlaneName}</td>
                <td>{flight.departureAirport}</td>
                <td>{flight.destinationAirport}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No flights found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredFlights.length / flightsPerPage) },
          (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AllFlights;
