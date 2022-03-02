import {useEffect, useState} from "react"
import Titlebar from "./components/Titlebar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LeftPanel, PanelContainer, RightPanel} from "./components/Panel";
import "./stub.css";
import Sidebar from "./components/Sidebar";
import ContactForm from "./components/ContactForm";
import ReactFullpage, {fullpageOptions}  from '@fullpage/react-fullpage';
import {ScrollContext} from "./components/scrollContext";
import {RedemptionContext} from "./components/redemptionContext";

const pluginWrapper = () => {
  require('fullpage.js/vendors/scrolloverflow.min.js');
};

const App = () => {
  // track scroll position to hack the fixed position box into appearing correctly.
  // loaded represents the current container (finished movement)
  // nowLeaving represents the current scroll action
  const [scrollState, setScrollState] = useState({
    loaded: {index: 0, length: 0, offset: ""},
    nowLeaving: {originIndex: 0, destinationIndex: 0}
  });
  const [redemptionState, setRedemptionState] = useState("");

  const submitRedemption = () => {

  }


  // on DOM load, obtain number of sections
  useEffect(() => {
    setScrollState(s => {
      return {
        ...s,
        loaded: {
          ...s.loaded,
          length: document.getElementsByClassName("section").length
        }
      }
    })
  }, [])

  const afterLoad: fullpageOptions["afterLoad"] = (origin, destination) => {
    const parentOffset = document.getElementById("fullpage")!.style.transform;
    const offset = destination.isLast ? scrollState.loaded.offset : parentOffset.replace('-', ''); //invert by removing negative offset
    // update offset and index
    setScrollState(scrollState => {
      return {
        ...scrollState,
        loaded: {
          ...scrollState.loaded, 
          offset,
          index: destination.index,
        }
      }
    })
  }

  const onLeave: fullpageOptions["onLeave"] = (origin, destination) => {
    // update origin/destination indexes
    setScrollState(scrollState => {
      return {
        ...scrollState,
        nowLeaving: {
          ...scrollState.nowLeaving,
          destinationIndex: destination.index,
          originIndex: origin.index,
        }
      }
    })
  }
  
  return (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <ScrollContext.Provider value={scrollState}>
            <RedemptionContext.Provider value={{
              value: redemptionState,
              setValue: setRedemptionState,
              submit: submitRedemption,
            }}>
            <i className="icon background-vector" />
            <i className="icon background-vector secondary" />
                    {/*
                        <Titlebar />
              <div style={{position: 'relative', overflow: 'clip'}}>
                <Sidebar />
                <div className="flex column">
                <div className="flex" style={{position: 'relative'}}>
                {/*<PanelContainer>*/}
            <ReactFullpage
              afterLoad={afterLoad}
              onLeave={onLeave}
              licenseKey={process.env.REACT_APP_FULLPAGE_JS_KEY}
              navigation={true}
              scrollOverflow={true}
              pluginWrapper={pluginWrapper}
              render={() => (
                <>
                  <LeftPanel />
                </>
              )}
            />
            <RightPanel staticPos/>
          </RedemptionContext.Provider>
          </ScrollContext.Provider>
        } />
      </Routes>
    </Router>
  )
}

export default App;
