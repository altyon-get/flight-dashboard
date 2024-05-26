// src/App.jsx
import Grid from "./components/Grid";
import Controller from "./components/Controller";
import InformationBar from "./components/InformationBar";
import "./App.css";
import { useSocket } from "./context/SocketContext";

function App() {
  const { cords } = useSocket();
  console.log(cords);
  return (
    <>
      {cords.length === 0 && <InformationBar />}
      {/* <header>Flight Navigation System</header> */}
      <div className="main-container">
        <div className="grid-container">
          <Grid />
        </div>
        <div className="second-component">
          <Controller />
        </div>
      </div>
    </>
  );
}

export default App;
