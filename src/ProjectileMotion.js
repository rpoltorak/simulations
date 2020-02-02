import React, { Component } from "react";
import { JSXGraph } from "jsxgraph";

const getRandomColor = () => {
  const colors = [
    "blue",
    "green",
    "violet",
    "turquoise",
    "orange",
    "olive",
    "coral",
    "cyan"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
};

export default class ProjectileMotion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simId: 0,
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
        alphaRadians: null,
        m: 2,
        c: 0.7,
        dt: 0.01,
        g: 9.81,
        frictionEnabled: true
      },
      xValues: {},
      yValues: {}
    };
  }

  componentDidMount() {
    this.reset();
  }

  getUpdatedParams = params => {
    const { alpha, m, v, frictionEnabled } = params;
    const alphaRadians = (Math.PI * alpha) / 180;
    const c = frictionEnabled ? params.c : 0;

    return {
      model: Object.assign({}, this.state.model, {
        x: 0,
        y: 0,
        vx: v * Math.cos(alphaRadians),
        vy: v * Math.sin(alphaRadians)
      }),
      params: Object.assign({}, params, {
        alphaRadians,
        r: c / m
      })
    };
  };

  changeInput = (value, field) => {
    this.setState(() => {
      const params = Object.assign({}, this.state.params, {
        [field]: value
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
      this.stop();
    }
  };

  updateX = () => {
    const {
      model,
      params: { dt, r }
    } = this.state;

    const vx = model.vx - r * model.vx * dt;
    const x = model.x + vx * dt - 0.5 * r * vx * dt * dt;

    this.setState(({ model, xValues, simId }) => {
      const values = xValues[simId] ? xValues[simId] : [];

      return {
        model: Object.assign({}, model, { x, vx }),
        xValues: Object.assign({}, xValues, {
          [simId]: [...values, x]
        })
      };
    });

    return x;
  };

  updateY = () => {
    const {
      model,
      params: { g, dt, r }
    } = this.state;

    const vy = model.vy - g * dt - r * model.vy * dt;
    const y = model.y + vy * dt - 0.5 * g * dt * dt + 0.5 * r * vy * dt * dt;

    this.setState(({ model, yValues, simId }) => {
      const values = yValues[simId] ? yValues[simId] : [];

      return {
        model: Object.assign({}, model, { y, vy }),
        yValues: Object.assign({}, yValues, {
          [simId]: [...values, y]
        })
      };
    });

    return y;
  };

  start = () => {
    const { board, simId } = this.state;
    const component = this;

    const projectile = board.create("point", [this.updateX, this.updateY], {
      name: "projectile",
      withLabel: false,
      fixed: true,
      size: 4,
      color: "red"
    });

    const trajectoryGraph = board.create("curve", [[0], [0]], {
      name: simId,
      strokeColor: getRandomColor()
    });

    trajectoryGraph.updateDataArray = function() {
      this.dataX = component.state.xValues[this.name];
      this.dataY = component.state.yValues[this.name];
    };

    this.setState(() => ({
      projectile,
      trajectoryGraph,
      animation: window.requestAnimationFrame(this.update)
    }));
  };

  stop = () => {
    const { animation, simId } = this.state;

    if (animation) {
      window.cancelAnimationFrame(animation);
    }

    this.setState(({ params }) => ({
      simId: simId + 1,
      animation: null,
      ...this.getUpdatedParams(params)
    }));
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
      boundingbox: [-10, 100, 300, -10],
      axis: true,
      showNavigation: false,
      showCopyright: false
    });

    this.setState(({ params }) => ({
      board,
      xValues: {},
      yValues: {},
      animation: null,
      ...this.getUpdatedParams(params)
    }));
  };

  render() {
    const { animation, params } = this.state;

    return (
      <div className="sim">
        <div>
          <h1>Rzut ukośny</h1>
          <form id="sim-form">
            <div className="sim-row">
              <label>kąt (alfa)</label>
              <input
                className="text-input"
                type="number"
                value={params.alpha}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "alpha")
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>prędkość (v)</label>
              <input
                className="text-input"
                type="number"
                value={params.v}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "v")
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>masa (m)</label>
              <input
                className="text-input"
                type="number"
                value={params.m}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "m")
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>dt</label>
              <input
                className="text-input"
                type="number"
                value={params.dt}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "dt")
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>przysp. graw. (g)</label>
              <input
                className="text-input"
                type="number"
                value={params.g}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "g")
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>uwzględnij opór</label>
              <input
                className="checkbox-input"
                type="checkbox"
                checked={params.frictionEnabled}
                onChange={event =>
                  this.changeInput(
                    Boolean(event.target.checked),
                    "frictionEnabled"
                  )
                }
                disabled={animation}
              />
            </div>
            <div className="sim-row">
              <label>współczynnik oporu</label>
              <input
                className="text-input"
                type="number"
                value={params.c}
                onChange={event =>
                  this.changeInput(Number(event.target.value), "c")
                }
                disabled={animation || !params.frictionEnabled}
              />
            </div>
          </form>
          <div className="sim-buttons">
            <button
              className="button"
              onClick={this.start}
              disabled={animation}
            >
              Start
            </button>
            <button
              className="button"
              onClick={this.reset}
              disabled={animation}
            >
              Reset
            </button>
          </div>
        </div>

        <div id="simulation" style={{ width: "500px", height: "500px" }}></div>
      </div>
    );
  }
}
