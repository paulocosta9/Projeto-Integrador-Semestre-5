export class Percurso {
  [key: string]: any;
    constructor(
      public percurso: string,
      public tempo: number,
      public camiao: string,
      public entregas: Entregas[],
      public dataPercurso : string
    ) {  }
  
    
  }

  export class Entregas{
    constructor(
        public armazemEntrega: number ,
        public entrega: number,
      ) {  }
}