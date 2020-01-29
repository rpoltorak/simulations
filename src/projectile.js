import { JSXGraph } from "jsxgraph";

export default function main() {
  const board = JSXGraph.initBoard("simulation", {
    boundingbox: [-5, 5, 5, -5],
    axis: true
  });
}
