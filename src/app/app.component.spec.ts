import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('_generateGridNode', () => {
    it('should generate Node class', () => {
      const result = component._generateGridNode({rowIdx: 0, colIdx: 0});
      expect(result).toBeInstanceOf(Node);
      expect(result.getRowIdx()).toEqual(0);
      expect(result.getColumnIdx()).toEqual(0);
    });
  });
});
