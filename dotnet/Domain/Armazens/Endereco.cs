using System;
using DDDSample1.Domain.Shared;
using System.Text.RegularExpressions;
namespace DDDSample1.Domain.Armazens
{

    public class Endereco : IValueObject

    {
        public string rua { get; private set; }

        public string cidade { get; private set; }

        public string codigo_postal { get; private set; }

        public string pais { get; private set; }

        public int porta { get; private set; }

        private Endereco()
        {

        }

        public Endereco(string rua, string cidade, string codigo_postal, string pais, string porta)
        {
            this.rua = rua;
            this.cidade = cidade;
            this.codigo_postal = VerificarCodigoPostal(codigo_postal);
            this.pais = pais;
            this.porta = VerificarPorta(porta);
        }

        public void MudarEndereco(string rua, string cidade, string codigo_postal, string pais, string porta)
        {
            this.rua = rua;
            this.cidade = cidade;
            this.codigo_postal = VerificarCodigoPostal(codigo_postal);
            this.porta = VerificarPorta(porta);
            this.pais = pais;
        }

        public void MudarEndereco(Endereco endereco){
            this.rua = endereco.rua;
            this.cidade = endereco.cidade;
            this.codigo_postal = endereco.codigo_postal;
            this.porta = endereco.porta;
            this.pais = endereco.pais;
        }

        private int VerificarPorta(string porta)
        {
            int portaInt;
            bool verificar = Int32.TryParse(porta, out portaInt);
            if (!verificar && porta.ToString().Length < 5)
            {
                throw new BusinessRuleValidationException("O número da porta tem de ser válido. Só pode conter números e tem de ter menos que 5 algarismos");
            }
            return portaInt;
        }

        private string VerificarCodigoPostal(string codigo_postal)
        {
            string regex = "[0-9]{4}-[0-9]{3}$";
            Match mat = Regex.Match(codigo_postal, regex);
            if (!mat.Success)
            {
                throw new BusinessRuleValidationException("O código postal tem de ser válido. Tem de ser no formato : XXXX-XXX (X é um número inteiro)");
            }
            return mat.Value;
        }


    }




}