import { JSXGraph } from "jsxgraph";

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

  const model = {
    x: 0,
    y: 0
  };

  const projectile = board.create(
    "point",
    [
      () => model.x++, //getpos
      () => model.y++ //getpos
    ],
    {
      name: "projectile",
      withLabel: false,
      fixed: true,
      size: 4,
      color: "red"
    }
  );

  let animation;

  function draw() {
    projectile
      .prepareUpdate()
      .update()
      .updateRenderer();

    animation = window.requestAnimationFrame(draw);
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

  startButton.addEventListener("click", () => {
    const values = getInputValues();

    if (validateValues(values)) {
      animation = window.requestAnimationFrame(draw);
      console.log("valid");
    } else {
      console.log("invalid");
    }
  });

  stopButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
  });

  resetButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
    JSXGraph.freeBoard(board);

    main();
  });
}
