import React, { useState, useEffect } from "react";

import "./GameOfLife.css";
import useInterval from "./useInterval";
import defaultState from "./defaultState.json";

const CELL_SIZE = 20;
const BOARD_SIZE = 25;
const FREQUENCY = 1;
const DEFAULT_RULES = {
  overpopulation: 3,
  underpopulation: 1,
  rebirth: 2
};

function GameOfLife() {
  const [boardSize, setBoardSize] = useState(BOARD_SIZE);
  const [model, setModel] = useState([]);
  const [cells, setCells] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(FREQUENCY);
  const [rules, setRules] = useState(DEFAULT_RULES);

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

  const clear = () => {
    setIsRunning(false);
    setModel(createModel());
    setCells(createCells());
  };

  const reset = () => {
    setIsRunning(false);
    setBoardSize(BOARD_SIZE);
    setFrequency(FREQUENCY);
    setRules(DEFAULT_RULES);
    setModel(defaultState);
    setCells(createCells());
  };

  const changeRules = rule => {
    setRules(Object.assign({}, rules, rule));
  };

  useEffect(() => {
    setIsRunning(false);
    setModel(createModel());
    setCells(createCells());
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
        <ul>
          <li>
            Komórka przy zbyt wysokiej populacji sąsiadów <br />
            większej od X umiera z przeludnienia
          </li>
          <li>
            Komórka przy zbyt niskiej populacji sąsiadów <br />
            mniejszej od Y umiera z osamotnienia
          </li>
          <li>
            Komórka posiadająca dokładnie Z żywych sąsiadów <br /> ożywa
          </li>
        </ul>
        <p>
          Możesz rysować dowolne kombinacje osobników
          <br /> klikając na poszczególne kwadraty siatki oraz
          <br /> zmieniać reguły po zatrzymaniu iteracji
        </p>
        <form id="sim-form" onSubmit={event => event.preventDefault()}>
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
            <span className="value">{rules.overpopulation}</span>
            <button
              className="button small"
              onClick={() =>
                changeRules({ overpopulation: rules.overpopulation + 1 })
              }
              disabled={isRunning}
            >
              +
            </button>
            <button
              className="button small"
              onClick={() =>
                changeRules({ overpopulation: rules.overpopulation - 1 })
              }
              disabled={isRunning}
            >
              -
            </button>
          </div>
          <div className="sim-row">
            <label className="small">
              Śmierć przy zbyt niskiej populacji sąsiadów mniejszej od
            </label>
            <span className="value">{rules.underpopulation}</span>
            <button
              className="button small"
              onClick={() =>
                changeRules({ underpopulation: rules.underpopulation + 1 })
              }
              disabled={isRunning}
            >
              +
            </button>
            <button
              className="button small"
              onClick={() =>
                changeRules({ underpopulation: rules.underpopulation - 1 })
              }
              disabled={isRunning}
            >
              -
            </button>
          </div>
          <div className="sim-row">
            <label className="small">
              Odrodzenie przy populacji sąsiadów równej
            </label>
            <span className="value">{rules.rebirth}</span>
            <button
              className="button small"
              onClick={() => changeRules({ rebirth: rules.rebirth + 1 })}
              disabled={isRunning}
            >
              +
            </button>
            <button
              className="button small"
              onClick={() => changeRules({ rebirth: rules.rebirth - 1 })}
              disabled={isRunning}
            >
              -
            </button>
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
            Default
          </button>
          <button className="button" onClick={clear} disabled={isRunning}>
            Clear
          </button>
        </div>
        <p style={{ textAlign: "left" }}>
          * Przycisk "Default" przywraca domyślne parametry <br />
          ** Przycisk "Clear" czyści siatkę
        </p>
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
