import {GridMap} from '../../../models/grid.types';
import {Stack} from '@datastructures-js/stack';
import {Backtracking} from './backtracking';

export class BacktrackingIterative extends Backtracking {
  override generateMaze({nodeKey, grid}: {nodeKey: string, grid: GridMap}) {
    // 1. Choose the initial cell, mark it as visited and push it to the stack
    // 2. While the stack is not empty
    //    1. Pop a cell from the stack and make it a current cell
    //    2. If the current cell has any neighbours which have not been visited
    //        1. Push the current cell to the stack
    //        2. Choose one of the unvisited neighbours
    //        3. Remove the wall between the current cell and the chosen cell
    //        4. Mark the chosen cell as visited and push it to the stack
    const stack = new Stack<string>();
    stack.push(nodeKey);
    this.makePassage(nodeKey);

    while (!stack.isEmpty()) {
      const currNode = stack.pop();

      const unvisitedNodes = this.getUnvisitedNodes(currNode);

      if (unvisitedNodes) {
        stack.push(currNode);

        this.makePassage(unvisitedNodes.wallKey);
        this.makePassage(unvisitedNodes.neighborKey);

        stack.push(unvisitedNodes.neighborKey);
      }
    }
  }

  private getUnvisitedNodes(currNodeKey: string): {wallKey: string, neighborKey: string} | null {
    for (const direction of this.getRandomDirections()) {
      const wallKey = this.getNeighborKey(currNodeKey, direction);
      const neighborKey = this.getNeighborKey(wallKey, direction);

      if (this.isUnvisitedNode({neighborKey, wallKey})) {
        return {wallKey, neighborKey};
      }
    }

    return null;
  }
}
