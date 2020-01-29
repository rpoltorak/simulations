import { JSXGraph } from "jsxgraph";

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

export default function main() {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");

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

  startButton.addEventListener("click", () => {
    animation = window.requestAnimationFrame(draw);
  });

  stopButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
  });
}
