import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from "./components/Nav";
import Main from "./pages/Main";

function App() {
  useEffect(() => {

  }, []);

  return (
    <div className="App">
        <div>
          <Nav/>
          <div className="main-view">
            <Switch>
              <Route exact path="/" component={Main} />
            </Switch>
          </div>
      </div>
    </div>
  );
}

export default App;
