import React from "react";
import {
  Switch,
  Route,
  Link,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";

import ProjectileMotion from "./ProjectileMotion";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <div>Wybierz:</div>
          <ul>
            <li>
              <Link to="/projectile">Rzut ukośny</Link>
            </li>
            <li>
              <Link to="/pendulum">Wahadło podwójne</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/projectile" />} />
          <Route path="/projectile">
            <ProjectileMotion />
          </Route>
          <Route path="/pendulum">pendulum</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
