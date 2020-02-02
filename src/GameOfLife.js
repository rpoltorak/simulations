import React, { useState, useEffect } from "react";

import "./GameOfLife.css";
import useInterval from "./useInterval";
import defaultState from "./defaultState.json";

const CELL_SIZE = 20;

function GameOfLife() {
  const [boardSize, setBoardSize] = useState(20);
  const [model, setModel] = useState([]);
  const [cells, setCells] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [rules, setRules] = useState({
    overpopulation: 3,
    underpopulation: 1,
    rebirth: 2
  });

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
    if (isRunning) {
      return;
    }

    const updatedModel = [
      ...model.slice(0, x),
      [...model[x].slice(0, y), !model[x][y], ...model[x].slice(y + 1)],
      ...model.slice(x + 1)
    ];

    setModel(updatedModel);

    console.log(JSON.stringify(model));
  };

  const isFilled = (x, y) => {
    return model[x] && model[x][y];
  };

  const calculateNeighbours = (x, y) => {
    let amount = 0;

    if (isFilled(x - 1, y - 1)) amount++;
    if (isFilled(x, y - 1)) amount++;
    if (isFilled(x + 1, y - 1)) amount++;
    if (isFilled(x - 1, y)) amount++;
    if (isFilled(x + 1, y)) amount++;
    if (isFilled(x - 1, y + 1)) amount++;
    if (isFilled(x, y + 1)) amount++;
    if (isFilled(x + 1, y + 1)) amount++;

    return amount;
  };

  const runIteration = () => {
    const updatedModel = model.map((cells, x) =>
      cells.map((aliveState, y) => {
        const { overpopulation, underpopulation, rebirth } = rules;
        const neighbours = calculateNeighbours(x, y);

        if (!aliveState && neighbours === rebirth) {
          return true;
        } else if (
          neighbours > overpopulation ||
          neighbours < underpopulation
        ) {
          return false;
        }

        return aliveState;
      })
    );

    setModel(updatedModel);
  };

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);

    clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    setModel(createModel());
    setCells(createCells());
  };

  const changeRules = (rule, value) => {
    const updatedRules = Object.assign({}, rules, {
      [rule]: value
    });

    setRules(updatedRules);
  };

  useEffect(() => {
    reset();
  }, [boardSize]);

  useEffect(() => {
    setModel(defaultState);
    setCells(createCells());
  }, []);

  const intervalRef = useInterval(
    runIteration,
    isRunning ? frequency * 1000 : null
  );

  return (
    <div className="sim">
      <div>
        <h1>Gra w życie</h1>
        <p>
          Możesz rysować dowolne kombinacje osobników
          <br /> klikając na poszczególne kwadraty siatki oraz
          <br /> zmieniać reguły po zatrzymaniu iteracji
        </p>
        <form id="sim-form">
          <div className="sim-row">
            <label>rozmiar</label>
            <input
              className="text-input"
              type="number"
              value={boardSize}
              onChange={event => setBoardSize(Number(event.target.value))}
              disabled={isRunning}
            />
          </div>
          <div className="sim-row">
            <label>częstość iteracji (sek)</label>
            <input
              className="text-input"
              type="number"
              value={frequency}
              onChange={event => setFrequency(Number(event.target.value))}
              disabled={isRunning}
            />
          </div>
          <div className="sim-row">
            <label className="small">
              Śmierć przy zbyt wysokiej populacji sąsiadów większej od
            </label>
            <input
              className="text-input"
              type="number"
              value={rules.overpopulation}
              onChange={event =>
                changeRules("overpopulation", Number(event.target.value))
              }
              disabled={isRunning}
            />
          </div>
          <div className="sim-row">
            <label className="small">
              Śmierć przy zbyt niskiej populacji sąsiadów mniejszej od
            </label>
            <input
              className="text-input"
              type="number"
              value={rules.underpopulation}
              onChange={event =>
                changeRules("underpopulation", Number(event.target.value))
              }
              disabled={isRunning}
            />
          </div>
          <div className="sim-row">
            <label className="small">
              Odrodzeniu przy populacji sąsiadów równej
            </label>
            <input
              className="text-input"
              type="number"
              value={rules.rebirth}
              onChange={event =>
                changeRules("rebirth", Number(event.target.value))
              }
              disabled={isRunning}
            />
          </div>
        </form>
        <div className="sim-buttons">
          <button className="button" onClick={start} disabled={isRunning}>
            Start
          </button>
          <button className="button" onClick={stop} disabled={!isRunning}>
            Stop
          </button>
          <button className="button" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
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
            style={{ backgroundColor: model[x][y] ? "black" : "lightgreen" }}
          />
        ))}
      </div>
    </div>
  );
}

export default GameOfLife;
