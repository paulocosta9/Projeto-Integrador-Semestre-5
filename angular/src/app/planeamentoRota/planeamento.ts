export class Planeamento {

    constructor(
      public nome: string,
      public data: string,
    ) {  }
  }

export class Heuristica {
    constructor(
        public nome: string,
        public data: string,
        public heuristica: string
    ){
    }
}

export class Percurso {
  constructor(
      public percurso: [],
      public tempo: number
  ){
  }
}
