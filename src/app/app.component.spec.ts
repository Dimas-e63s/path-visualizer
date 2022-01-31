import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Node} from './models/Node.class';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('generateEmptyGrid', () => {
    it('should create an empty 2d array', () => {
      expect(component.generateEmptyGrid({row: 0, col: 0})).toEqual([]);
    });

    it('should create non-empty 2d array', () => {
      expect(component.generateEmptyGrid({row: 2, col: 2})).toEqual(
        [
          [null, null],
          [null, null],
        ],
      );
    });
  });

  describe('_generateGridNode', () => {
    it('should generate Node class', () => {
      const result = component._generateGridNode({rowIdx: 0, colIdx: 0});
      expect(result).toBeInstanceOf(Node);
      expect(result.getRowIdx()).toEqual(0);
      expect(result.getColumnIdx()).toEqual(0);
    });
  });

  describe('calculateAmountOfColumns', () => {
    it('should return column amount', () => {
      expect(component.calculateAmountOfColumns(800)).toEqual(26);
    });
  });

  describe('calculateAmountOfRows', () => {
    it('should return amount of rows', () => {
      expect(component.calculateAmountOfRows(800)).toEqual(21);
    });
  });

  describe('isGridSizeFixed', () => {
    it('should return true if size the same', () => {
      expect(component.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 10},
      )).toBeTrue();
    });

    it('should return false changed', () => {
      expect(component.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 11},
      )).toBeFalse();
    });
  });

  describe('isIdxOutOfGrid', () => {
    it('should return true if Node oldIdx grater than newIdx', () => {
      expect(component.isIdxOutOfGrid({oldIdx: 10, newIdx: 9})).toBeTrue();
    });

    it('should return false if Node oldIdx grater than newIdx', () => {
      expect(component.isIdxOutOfGrid({oldIdx: 10, newIdx: 11})).toBeFalse();
    });

    it('should return false if Node oldIdx equal to newIdx', () => {
      expect(component.isIdxOutOfGrid({oldIdx: 10, newIdx: 10})).toBeFalse();
    });
  });

  describe('getNodeIdxAfterResize', () => {
    it('should return newIdx for idx out of grid bounds', () => {
      expect(component.getNodeIdxAfterResize({oldIdx: 10, newIdx: 9})).toEqual(9);
    });

    it('should return oldIdx for idx in grid bounds', () => {
      expect(component.getNodeIdxAfterResize({oldIdx: 10, newIdx: 11})).toEqual(10);
    });
  });

  describe('trackByNode', () => {
    it('should return Node id', () => {
      const stubNode = component._generateGridNode({rowIdx: 0, colIdx: 0});
      expect(component.trackByNode(0, stubNode)).toEqual(stubNode.id);
    });
  });

  describe('trackByRow', () => {
    it('should return 0 for empty row', () => {
      expect(component.trackByRow(0, [])).toEqual(0);
    });
  });

  describe('disableButtons', () => {
    it('should set isButtonsDisabled field to true', () => {
      component.disableButtons();
      expect(component.isButtonsDisabled).toBeTrue();

      component.disableButtons();
      expect(component.isButtonsDisabled).toBeTrue();
    })
  });
});
