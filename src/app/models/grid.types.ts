import {Node} from './Node.class';

type GridRow = Node[];
type Grid = GridRow[];

interface GridSize {
  totalRow: number,
  totalCol: number
}

interface GridNodeCoordinates {
  colIdx: number;
  rowIdx: number;
}

type GridMap = Map<string, Node>;

export { GridMap, GridNodeCoordinates, GridSize, GridRow, Grid}
