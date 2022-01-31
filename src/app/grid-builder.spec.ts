import { GridBuilder } from './grid-builder';
import {Node} from './models/Node.class';

describe('GridBuilder', () => {
  it('should create an instance', () => {
    expect(new GridBuilder()).toBeTruthy();
  });

  describe('calculateAmountOfColumns', () => {
    it('should return column amount', () => {
      expect(GridBuilder.calculateAmountOfColumns(800)).toEqual(26);
    });
  });

  describe('calculateAmountOfRows', () => {
    it('should return amount of rows', () => {
      expect(GridBuilder.calculateAmountOfRows(800)).toEqual(21);
    });
  });

  describe('generateGridNode', () => {
    it('should generate Node class', () => {
      const result = GridBuilder.generateGridNode({rowIdx: 0, colIdx: 0});
      expect(result).toBeInstanceOf(Node);
      expect(result.getRowIdx()).toEqual(0);
      expect(result.getColumnIdx()).toEqual(0);
    });
  });
});
