export class Camiao {

    constructor(
        public id: string,
        public nome: string,
        public matricula: string,
        public tara?: number,
        public capacidadeCarga?: number,
        public cargaTotalBat?: number,
        public autonomiaCargaMax?: number,
        public tempoCarregamento?: number,
        public ativo?: boolean,
    ) {  }
  
    
}