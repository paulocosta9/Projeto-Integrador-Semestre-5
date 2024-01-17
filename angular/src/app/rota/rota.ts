export class Rota {

    constructor(
      public id: string,
      public armazemInicial: string,
      public armazemFinal: string,
      public duracao?: number,
      public energiaGasta? : number,
      public distancia? : number,
      public tempExtra? : number
    ) {  }

  }

