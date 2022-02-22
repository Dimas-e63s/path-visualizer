import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {GridBuilder} from './models/grid-builder';
import {Component} from '@angular/core';

@Component({selector: 'tui-root', template: ''})
class StubRootComponent {}

@Component({selector: 'app-header', template: ''})
class StubHeaderComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StubRootComponent,
        StubHeaderComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
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
});
