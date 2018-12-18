import * as React from "react";
import { Cell } from "../Cell";

interface IProps {
  readonly value: Cell;
  readonly handleClick: (cell: Cell) => void;
}

export const FibCell: React.FunctionComponent<IProps> = props => {
  const cellColor = (): string => {
    switch (props.value.status) {
      case "clean":
        return "white";
      case "clicked":
        return "yellow";
      case "found":
        return "green";
    }
  };

  const style = {
    backgroundColor: cellColor(),
    border: "1px solid black",
    height: "50px",
    width: "50px"
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    props.handleClick(props.value);
  };

  return (
    <div style={style} onClick={onClick}>
      {props.value.value || ""}
    </div>
  );
};
