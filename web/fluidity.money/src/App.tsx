import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        {/* switch 
        route 
        route
        switch */}
      </div>
    </Router>
  );
}

export default App;
