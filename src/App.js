import React, { Component } from "react";
import { JSXGraph } from "jsxgraph";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      trajectoryGraph: null,
      projectile: null,
      model: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      },
      params: {
        v: 50,
        alpha: 60,
        m: 2,
        c: 0.7,
        dt: 0.01,
        g: 9.81
      },
      xValues: [],
      yValues: []
    };
  }

  componentDidMount() {
    this.reset();
  }

  getUpdatedParams = params => {
    const { alpha, c, m, v } = params;
    const alphaRadian = (Math.PI * alpha) / 180;

    return {
      model: Object.assign({}, this.state.model, {
        x: 0,
        y: 0,
        vx: v * Math.cos(alphaRadian),
        vy: v * Math.sin(alphaRadian)
      }),
      params: Object.assign({}, params, {
        alphaRadian,
        r: c / m
      })
    };
  };

  changeInput = (value, field) => {
    this.setState(() => {
      const params = Object.assign({}, this.state.params, {
        [field]: Number(value)
      });

      return this.getUpdatedParams(params);
    });
  };

  update = () => {
    const { model, projectile, trajectoryGraph } = this.state;

    if (model.y > 0) {
      projectile
        .prepareUpdate()
        .update()
        .updateRenderer();

      trajectoryGraph
        .prepareUpdate()
        .update()
        .updateRenderer();

      this.setState(() => ({
        animation: window.requestAnimationFrame(this.update)
      }));
    } else {
      window.cancelAnimationFrame(this.state.animation);

      this.setState(() => ({
        animation: null
      }));
    }
  };

  updateX = () => {
    const {
      model,
      params: { dt, r }
    } = this.state;

    const vx = model.vx - r * model.vx * dt;
    const x = model.x + vx * dt - 0.5 * r * vx * dt * dt;

    this.setState(({ model, xValues }) => ({
      model: Object.assign({}, model, { x, vx }),
      xValues: [...xValues, x]
    }));

    return x;
  };

  updateY = () => {
    const {
      model,
      params: { g, dt, r }
    } = this.state;

    const vy = model.vy - g * dt - r * model.vy * dt;
    const y = model.y + vy * dt - 0.5 * g * dt * dt + 0.5 * r * vy * dt * dt;

    this.setState(({ model, yValues }) => ({
      model: Object.assign({}, model, { y, vy }),
      yValues: [...yValues, y]
    }));

    return y;
  };

  start = () => {
    const { board } = this.state;
    const component = this;

    const projectile = board.create("point", [this.updateX, this.updateY], {
      name: "projectile",
      withLabel: false,
      fixed: true,
      size: 4,
      color: "red"
    });

    const trajectoryGraph = board.create("curve", [[0], [0]], {
      strokeColor: "blue"
    });

    trajectoryGraph.updateDataArray = function() {
      this.dataX = component.state.xValues;
      this.dataY = component.state.yValues;
    };

    this.setState(() => ({
      projectile,
      trajectoryGraph,
      animation: window.requestAnimationFrame(this.update)
    }));
  };

  stop = () => {
    if (this.state.animation) {
      window.cancelAnimationFrame(this.state.animation);
    }
  };

  reset = () => {
    const { animation, board: currentBoard } = this.state;

    if (animation) {
      window.cancelAnimationFrame(animation);
    }

    if (currentBoard) {
      JSXGraph.freeBoard(currentBoard);
    }

    const board = JSXGraph.initBoard("simulation", {
      boundingbox: [-10, 100, 100, -10],
      axis: true,
      showNavigation: false,
      showCopyright: false
    });

    this.setState(({ params }) => ({
      board,
      xValues: [],
      yValues: [],
      ...this.getUpdatedParams(params)
    }));
  };

  render() {
    const { model, params, xValues } = this.state;

    return (
      <div>
        <div>
          <button onClick={this.start}>Start</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={this.reset}>Reset</button>
        </div>
        <div>
          <form id="sim-form">
            <label>alpha</label>
            <input
              type="number"
              value={params.alpha}
              onChange={event => this.changeInput(event.target.value, "alpha")}
            />
          </form>
        </div>

        <div id="simulation" style={{ width: "500px", height: "500px" }}></div>
        {JSON.stringify({ params, model, xValues: xValues.length })}
      </div>
    );
  }
}
