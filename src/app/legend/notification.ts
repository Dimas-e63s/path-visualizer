import {PathAlgorithmEnum} from '../header/header.component';

// TODO: - extract interface/enums
interface AlgorithmNotification {
  algoName: PathAlgorithmEnum;
  algoType: AlgorithmTypeEnum;
  algoEfficiency: AlgorithmEfficiency;
}

enum AlgorithmTypeEnum {
  WEIGHTED = 'weighted',
  UNWEIGHTED = 'unweighted'
}

enum AlgorithmEfficiency {
  OPTIMAL = 'guarantees',
  NON_OPTIMAL = 'does not guarantee'
}

export class Notification {
  getHtmlDescription(): string {
    throw new Error('Method is not implemented');
  }
}

class AlgorithmDescription extends Notification {
  private readonly algoName: PathAlgorithmEnum;
  private readonly algoType: AlgorithmTypeEnum;
  private readonly algoEfficiency: AlgorithmEfficiency;

  constructor({algoName, algoType, algoEfficiency}: AlgorithmNotification) {
    super();
    this.algoName = algoName;
    this.algoType = algoType;
    this.algoEfficiency = algoEfficiency;
  }

  override getHtmlDescription(): string {
    // TODO: - add html serialization
    return `${this.algoName} is <strong>${this.algoType}</strong> and <strong>${this.algoEfficiency}</strong> the shortest path!`;
  }
}

class DefaultDescription extends Notification {
  override getHtmlDescription(): string {
    return '<b>Pick an algorithm</b> and run algo!';
  }
}

class DijkstraDescription extends AlgorithmDescription {
  constructor() {
    super({
      algoName: PathAlgorithmEnum.DIJKSTRA,
      algoType: AlgorithmTypeEnum.WEIGHTED,
      algoEfficiency: AlgorithmEfficiency.OPTIMAL,
    });
  }
}

class AStarDescription extends AlgorithmDescription {
  constructor() {
    super({
      algoName: PathAlgorithmEnum.A_STAR,
      algoType: AlgorithmTypeEnum.WEIGHTED,
      algoEfficiency: AlgorithmEfficiency.OPTIMAL,
    });
  }
}

class DfsDescription extends AlgorithmDescription {
  constructor() {
    super({
      algoName: PathAlgorithmEnum.DFS,
      algoType: AlgorithmTypeEnum.UNWEIGHTED,
      algoEfficiency: AlgorithmEfficiency.NON_OPTIMAL,
    });
  }
}

class BfsDescription extends AlgorithmDescription {
  constructor() {
    super({
      algoName: PathAlgorithmEnum.BFS,
      algoType: AlgorithmTypeEnum.UNWEIGHTED,
      algoEfficiency: AlgorithmEfficiency.OPTIMAL,
    });
  }
}

export class DescriptionFactory {
  static main(algoName: PathAlgorithmEnum | null) {
    switch (algoName) {
      case PathAlgorithmEnum.BFS:
        return new BfsDescription().getHtmlDescription();
      case PathAlgorithmEnum.DFS:
        return new DfsDescription().getHtmlDescription();
      case PathAlgorithmEnum.A_STAR:
        return new AStarDescription().getHtmlDescription();
      case PathAlgorithmEnum.DIJKSTRA:
        return new DijkstraDescription().getHtmlDescription();
      default:
        return new DefaultDescription().getHtmlDescription();
    }
  }
}
