export class User {

    constructor(
        public primeiroNome: string,
        public ultimoNome: string,
        public email: string,
        public cargo: string,
        public numeroTelemovel?: number,
        

    ) { }

    toString() {
        return this.primeiroNome + "-" + this.ultimoNome + "-" + this.email + "-" + this.numeroTelemovel + "-" + this.cargo
    }
}