import React, { useState, useEffect } from "react";
import "./GameOfLife.css";

const CELL_SIZE = 20;
const BOARD_SIZE = 20;

function GameOfLife() {
  const [boardSize, setBoardSize] = useState(BOARD_SIZE);
  const [model, setModel] = useState([]);
  const [cells, setCells] = useState([]);

  const createModel = () => {
    let model = [];

    for (let y = 0; y < boardSize; y++) {
      model[y] = [];
      for (let x = 0; x < boardSize; x++) {
        model[y][x] = false;
      }
    }

    return model;
  };

  const createCells = () => {
    let cells = [];

    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        cells.push({ x, y });
      }
    }

    return cells;
  };

  const toggleCell = (x, y) => {
    const updatedModel = [
      ...model.slice(0, x),
      [...model[x].slice(0, y), !model[x][y], ...model[x].slice(y + 1)],
      ...model.slice(x + 1)
    ];

    setModel(updatedModel);
  };

  useEffect(() => {
    setModel(createModel());
    setCells(createCells());
  }, [boardSize]);

  return (
    <div className="sim">
      <div>
        <h1>Gra w życie</h1>
        <form id="sim-form">
          <div className="sim-row">
            <label>rozmiar</label>
            <input
              className="text-input"
              type="number"
              value={boardSize}
              onChange={event => setBoardSize(Number(event.target.value))}
              disabled={false}
            />
          </div>
        </form>
      </div>
      <div
        className="board"
        style={{
          width: boardSize * CELL_SIZE,
          height: boardSize * CELL_SIZE,
          gridTemplateColumns: `repeat(${boardSize}, auto)`
        }}
      >
        {cells.map(({ x, y }) => (
          <div
            className="cell"
            key={`${x},${y}`}
            onClick={() => toggleCell(x, y)}
            style={{ backgroundColor: model[x][y] ? "violet" : "lightgreen" }}
          />
        ))}
      </div>
    </div>
  );
}

export default GameOfLife;
