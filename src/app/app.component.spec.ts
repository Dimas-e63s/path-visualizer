import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {GridBuilder} from './grid-builder';
import {Component} from '@angular/core';

@Component({selector: 'tui-root', template: ''})
class StubRootComponent {}

@Component({selector: 'app-header', template: ''})
class StubHeaderComponent {}

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StubRootComponent,
        StubHeaderComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
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
      const stubNode = GridBuilder.generateGridNode({rowIdx: 0, colIdx: 0});
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
    });
  });

  describe('generateStartNode', () => {
    it('should return startNode based on size of the frid', () => {
      expect(
        component.generateStartNode({row: 20, col: 20}),
      ).toEqual({colIdx: 0, rowIdx: 10});
    });
  });

  describe('generateEndNode', () => {
    it('should return endNode based on size of the frid', () => {
      expect(
        component.generateEndNode({row: 20, col: 34}),
      ).toEqual({colIdx: 33, rowIdx: 10});
    });
  });
});
