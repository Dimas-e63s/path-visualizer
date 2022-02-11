import {GridMap} from '../../../models/grid.types';
import {Stack} from '@datastructures-js/stack';
import {Node} from '../../../models/Node.class';
import {DirectionsEnum, DX, DY} from '../../../models/maze-generation.enum';
import {Backtracking} from './backtracking';

export class BacktrackingIterative extends Backtracking {
  override generateMaze({cx, cy, grid}: {cx: number, cy: number, grid: GridMap}) {
    // 1. Choose the initial cell, mark it as visited and push it to the stack
    // 2. While the stack is not empty
    //    1. Pop a cell from the stack and make it a current cell
    //    2. If the current cell has any neighbours which have not been visited
    //        1. Push the current cell to the stack
    //        2. Choose one of the unvisited neighbours
    //        3. Remove the wall between the current cell and the chosen cell
    //        4. Mark the chosen cell as visited and push it to the stack
    const stack = new Stack<Node>();
    const initialNodeKey = this.getNodeKey(cy, cx);
    stack.push(grid.get(initialNodeKey)!);
    this.visitedNodes.add(initialNodeKey);

    grid.set(initialNodeKey, this.removeWall(initialNodeKey));

    while (!stack.isEmpty()) {
      const currNode = stack.pop();

      const unvisitedNodes = this.getUnvisitedNodeDirection(currNode);

      if (unvisitedNodes) {
        stack.push(currNode);

        let wallX = currNode.getColumnIdx() + DX.get(unvisitedNodes)!;

        let wallY = currNode.getRowIdx() + DY.get(unvisitedNodes)!;

        let newX = wallX + DX.get(unvisitedNodes)!;
        let newY = wallY + DY.get(unvisitedNodes)!;

        this.visitedNodes.add(this.getNodeKey(wallY, wallX));
        grid.set(this.getNodeKey(wallY, wallX), this.removeWall(this.getNodeKey(wallY, wallX)));

        this.visitedNodes.add(this.getNodeKey(newY, newX));
        grid.set(this.getNodeKey(newY, newX), this.removeWall(this.getNodeKey(newY, newX)));

        stack.push(grid.get(this.getNodeKey(newY, newX))!);
      }
    }
  }

  private getUnvisitedNodeDirection(currNode: Node): DirectionsEnum | undefined {
    return this.getRandomDirections().find(direction => {
      const wallX = this.getNeighborColIdx(currNode.getColumnIdx(), direction);
      const wallY = this.getNeighborRowIdx(currNode.getRowIdx(), direction);

      const newX = this.getNeighborColIdx(wallX, direction);
      const newY = this.getNeighborRowIdx(wallY, direction);

      return this.isNodeInsideOfGridBounds(newY, newX)
        && !this.visitedNodes.has(this.getNodeKey(newY, newX))
        && !this.visitedNodes.has(this.getNodeKey(wallY, wallX));
    });
  }

  private getNeighborColIdx(colIdx: number, direction: DirectionsEnum): number {
    return colIdx + DX.get(direction)!;
  }

  private getNeighborRowIdx(rowIdx: number, direction: DirectionsEnum): number {
    return rowIdx + DY.get(direction)!;
  }

  private isNodeInsideOfGridBounds(newY: number, newX: number): boolean {
    return this.isRowInGridBounds(newY) && this.isColInGridBounds(newX);
  }

  private isRowInGridBounds(rowIdx: number): boolean {
    return rowIdx >= 0 && rowIdx < this.totalRow;
  }

  private isColInGridBounds(colIdx: number): boolean {
    return colIdx >= 0 && colIdx < this.totalCol;
  }
}
