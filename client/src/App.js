import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from "./components/Nav";
import Wrapper from "./components/Wrapper";
import Main from "./pages/Main";
import About from "./pages/About";
import Keys from "./pages/Keys";

function App() {
  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <div>
        <Nav />
        <Wrapper>
          <div className="main-view">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/keys" component={Keys} />
              <Route exact path="/about" component={About} />
            </Switch>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}

export default App;
