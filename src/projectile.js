import { JSXGraph } from "jsxgraph";

function updateX(model, params, values) {
  const { c, m, dt } = params;
  const r = c / m;

  model.vx = model.vx - r * model.vx * dt;
  model.x = model.x + model.vx * dt - 0.5 * r * model.vx * dt * dt;

  values.push(model.x);

  return model.x;
}

function updateY(model, params, values) {
  const { c, m, dt, g } = params;
  const r = c / m;

  model.vy = model.vy - g * dt - r * model.vy * dt;
  model.y =
    model.y + model.vy * dt - 0.5 * g * dt * dt + 0.5 * r * model.vy * dt * dt;

  values.push(model.y);

  return model.y;
}

export default function main() {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const resetButton = document.getElementById("reset");

  const inputs = document.querySelectorAll("input");

  const board = JSXGraph.initBoard("simulation", {
    boundingbox: [-10, 100, 100, -10],
    axis: true,
    showNavigation: false,
    showCopyright: false
  });

  const params = {
    v: 50,
    alpha: 60,
    m: 2,
    c: 0.7,
    dt: 0.01,
    g: 9.81
  };

  const alphaRadian = (Math.PI * params.alpha) / 180;

  const model = {
    x: 0,
    y: 0,
    vx: params.v * Math.cos(alphaRadian),
    vy: params.v * Math.sin(alphaRadian)
  };

  const xValues = [];
  const yValues = [];

  const projectile = board.create(
    "point",
    [
      () => updateX(model, params, xValues),
      () => updateY(model, params, yValues)
    ],
    {
      name: "projectile",
      withLabel: false,
      fixed: true,
      size: 4,
      color: "red"
    }
  );

  const trajectoryGraph = board.create("curve", [[0], [0]], {
    strokeColor: "blue"
  });

  trajectoryGraph.updateDataArray = function() {
    this.dataX = xValues;
    this.dataY = yValues;
  };

  let animation;

  function update() {
    // end condition
    if (model.y > 0) {
      projectile
        .prepareUpdate()
        .update()
        .updateRenderer();
      trajectoryGraph
        .prepareUpdate()
        .update()
        .updateRenderer();

      animation = window.requestAnimationFrame(update);
    } else {
      window.cancelAnimationFrame(animation);
    }
  }

  function getInputValues() {
    const inputValues = {};

    inputs.forEach(input =>
      Object.assign(inputValues, {
        [input.name]: Number(input.value)
      })
    );

    return inputValues;
  }

  function validateValues(values) {
    return !Object.values(values).some(
      value => isNaN(value) || typeof value !== "number" || value === 0
    );
  }

  function start() {
    const values = getInputValues();

    if (validateValues(values)) {
      animation = window.requestAnimationFrame(update);
      console.log("valid");
    } else {
      console.log("invalid");
    }
  }

  startButton.addEventListener("click", () => {
    start();
  });

  stopButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
  });

  resetButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
    JSXGraph.freeBoard(board);

    start();
  });
}
