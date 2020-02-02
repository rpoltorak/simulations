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
import GameOfLife from "./GameOfLife";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <div>Wybierz:</div>
          <ul>
            <li>
              <Link to="/projectile-motion">Rzut ukośny</Link>
            </li>
            <li>
              <Link to="/game-of-life">Gra w życie</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/projectile-motion" />}
          />
          <Route path="/projectile-motion">
            <ProjectileMotion />
          </Route>
          <Route path="/game-of-life">
            <GameOfLife />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
