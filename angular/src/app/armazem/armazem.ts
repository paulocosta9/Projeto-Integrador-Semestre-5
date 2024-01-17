export class Armazem {

  constructor(
    public id: string,
    public end: Endereco,
    public designacao: string,
    public coord: Coordenadas,
    public active: boolean
  ) { }


}

export class Endereco {
  constructor(
    public rua: string,
    public cidade: string,
    public codigo_postal: string,
    public pais: string,
    public porta?: number
  ) { }
}

export class Coordenadas {
  constructor(
    public latitude?: number,
    public longitude?: number,
    public altitude?: number,
  ) { }
}

export class Inibir {
  constructor(
    public value: string,
    public path: string,
    public op: string,
  ) { }
}