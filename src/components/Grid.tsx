import * as React from "react";
import { FibCell } from "./FibCell";
import { Cell } from "../Cell";

type State = {
  values: Cell[][];
  status: "ready" | "clicked" | "checked";
  readonly fibonacciSequence: string;
};

export class Grid extends React.Component<{}, State> {
  readonly size: number = 50;

  constructor(props: any) {
    super(props);
    let initialValues: Cell[][];
    initialValues = [];
    for (let i = 0; i < this.size; i++) {
      initialValues[i] = [];
      for (let j = 0; j < this.size; j++) {
        initialValues[i][j] = {
          value: 0,
          coordinates: [i, j],
          status: "clean"
        };
      }
    }

    this.state = {
      values: initialValues,
      status: "ready",
      fibonacciSequence: this.fibonacci(100).join(",")
    };
  }

  areElementsInSequence = (cells: Cell[]): boolean => {
    const cellValues = cells
      .map(c => (c.value === 0 ? "x" : c.value))
      .join(",");
    console.log(cellValues);
    return this.state.fibonacciSequence.indexOf(cellValues) >= 0;
  };

  fibonacci = (n: number): number[] => {
    if (n === 1) return [0, 1];
    else {
      const s = this.fibonacci(n - 1);
      s.push(s[s.length - 1] + s[s.length - 2]);
      return s;
    }
  };

  incrementValue = (cell: Cell) => {
    let currentStateValues = this.state.values;
    currentStateValues[cell.coordinates[0]][cell.coordinates[1]].value++;
    currentStateValues[cell.coordinates[0]][cell.coordinates[1]].status =
      "clicked";

    for (var i = 0; i < this.size; i++) {
      if (i !== cell.coordinates[1]) {
        currentStateValues[cell.coordinates[0]][i].value++;
        currentStateValues[cell.coordinates[0]][i].status = "clicked";
      }
      if (i !== cell.coordinates[0]) {
        currentStateValues[i][cell.coordinates[1]].value++;
        currentStateValues[i][cell.coordinates[1]].status = "clicked";
      }
    }

    this.setState({ values: currentStateValues, status: "clicked" });
  };

  isFibonacciSequencePresent = () => {
    const gridCopy = this.state.values;
    gridCopy.forEach(row => {
      let rowSegment: Cell[];
      let isFibSequence: boolean = false;
      let start = 0;
      do {
        let size = this.size;
        do {
          rowSegment = row.slice(start, size--);
          if (rowSegment.length >= 5)
            isFibSequence = this.areElementsInSequence(rowSegment);
        } while (size >= 5 && !isFibSequence);
      } while (start++ <= this.size - 5 && !isFibSequence);
      if (isFibSequence) {
        console.log(rowSegment.map(cell => cell.value).join(","));
        rowSegment.forEach(cell => (cell.status = "found"));
      }
    });
    this.setState({ values: gridCopy, status: "checked" });
  };

  createGrid = () => {
    return this.state.values.map((row, rowIndex) => (
      <tr key={`row_${rowIndex}`}>
        {row.map((cell, cellIndex) => (
          <td key={`cell_${rowIndex}-${cellIndex}`}>
            <FibCell value={cell} handleClick={this.incrementValue} />
          </td>
        ))}
      </tr>
    ));
  };

  resetCells = () => {
    this.setState({
      values: this.state.values.map(row =>
        row.map(cell => {
          if (cell.status === "found") {
            cell.value = 0;
          }
          cell.status = "clean";
          return cell;
        })
      ),
      status: "ready"
    });
  };

  public render() {
    const grid = this.createGrid();
    let func: () => void;

    switch (this.state.status) {
      case "ready":
        break;
      case "clicked":
        func = () => this.isFibonacciSequencePresent();
        break;
      case "checked":
        func = () => this.resetCells();
        break;
    }

    if (this.state.status !== "ready") {
      setTimeout(() => {
        func();
      }, 600);
    }
    return (
      <table>
        <tbody>{grid}</tbody>
      </table>
    );
  }
}
