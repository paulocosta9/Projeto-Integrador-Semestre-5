export class Entrega {
    [key: string]: any;
    constructor(
        public id: string,
        public armazemEntrega: string,
        public dataEntrega: string,
        public massaEntrega?: number,
        public tempoCarregarEntrega?: number,
        public tempoDescarregarEntrega?: number,
        
        
    ) {  }
  
    
} 

