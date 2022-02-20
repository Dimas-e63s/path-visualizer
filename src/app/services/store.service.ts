import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  startNode = {colIdx: 2, rowIdx: 25};
  finishNode = {colIdx: 25, rowIdx: 0};

  constructor() { }
}
