import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import { produce } from 'immer';

const COLUMN = 60,
  ROW = 50;

const neighborsOperations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];
const generateEmptyGrid = () => Array(ROW).fill(Array(COLUMN).fill(0));
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < ROW; i++) {
    rows.push(Array.from(Array(COLUMN), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => generateEmptyGrid());

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const simulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(gridValues =>
      produce(gridValues, cloneGrid => {
        for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
          for (let colIndex = 0; colIndex < COLUMN; colIndex++) {
            let neighbors = 0;
            neighborsOperations.forEach(([x, y]) => {
              const newRowIndex = rowIndex + x;
              const newColIndex = colIndex + y;
              if (
                newRowIndex >= 0 &&
                newRowIndex < ROW &&
                newColIndex >= 0 &&
                newColIndex < COLUMN
              ) {
                neighbors += gridValues[newRowIndex][newColIndex];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              cloneGrid[rowIndex][colIndex] = 0;
            } else if (
              gridValues[rowIndex][colIndex] === 0 &&
              neighbors === 3
            ) {
              cloneGrid[rowIndex][colIndex] = 1;
            }
          }
        }
      })
    );

    setTimeout(simulation, 100);
  }, []);

  return (
    <div className='container'>
      <h1 className='header'>Conway's Game of Life</h1>
      <div className='button-container'>
        <button
          className='button'
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              simulation();
            }
          }}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          className='button'
          onClick={() => {
            setGrid(() => generateEmptyGrid());
            if (running) {
              setRunning(prev => !prev);
            }
          }}>
          Clear
        </button>
        <button
          className='button'
          onClick={() => setGrid(() => generateRandomGrid())}>
          Random
        </button>
      </div>

      {grid.map((rows: number[], rowIndex) => (
        <div
          className='row-grid'
          id={rowIndex.toString()}
          key={rowIndex.toString()}>
          {rows.map((column: number, colIndex: number) => (
            <div
              className='rect'
              key={`${rowIndex}-${colIndex}`}
              id={colIndex.toString()}
              onClick={() => {
                const newGrid = produce(grid, cloneGrid => {
                  cloneGrid[rowIndex][colIndex] = grid[rowIndex][colIndex]
                    ? 0
                    : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                backgroundColor: grid[rowIndex][colIndex] ? '#000' : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
