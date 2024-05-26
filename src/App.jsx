// src/App.jsx
import Grid from "./components/Grid";
import Controller from "./components/Controller";
import InformationBar from "./components/InformationBar";
import "./App.css";

function App() {
  return (
    <>
      <InformationBar />
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
