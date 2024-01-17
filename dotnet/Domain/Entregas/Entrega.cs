using System;
using DDDSample1.Domain.Shared;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Armazens;
using System.Globalization;

namespace DDDSample1.Domain.Entregas

{
    public class Entrega : Entity<EntregaId>, IAggregateRoot
    {

        public string dataEntrega { get; private set; }

        public float massaEntrega { get; private set; }

        public ArmazemId armazemEntrega { get; private set; }

        public float tempoCarregarEntrega { get; private set; }

        public float tempoDescarregarEntrega { get; private set; }

        public Entrega()
        { }


        public Entrega(string id, string dataEntrega, float massaEntrega, ArmazemId armazemEntrega, float tempoCarregarEntrega, float tempoDescarregarEntrega)
        {

            this.Id = new EntregaId(VerificarId(id));
            this.dataEntrega = VerificarData(dataEntrega);
            this.massaEntrega = verifcarAcimaDeZero(massaEntrega);
            this.armazemEntrega = armazemEntrega;
            this.tempoCarregarEntrega = verifcarAcimaDeZero(tempoCarregarEntrega);
            this.tempoDescarregarEntrega = verifcarAcimaDeZero(tempoDescarregarEntrega);
        }


        public void MudarInformacao(string dataEntrega, float massaEntrega, ArmazemId armazemEntrega, float tempoCarregarEntrega, float tempoDescarregarEntrega)
        {

            this.dataEntrega = VerificarData(dataEntrega);
            this.massaEntrega = verifcarAcimaDeZero(massaEntrega);
            this.armazemEntrega = armazemEntrega;
            this.tempoCarregarEntrega = verifcarAcimaDeZero(tempoCarregarEntrega);
            this.tempoDescarregarEntrega = verifcarAcimaDeZero(tempoDescarregarEntrega);
        }


        private string VerificarId(string id)
        {
            int sizeId = 6;
            string regex = @"^[0-9]{" + sizeId + "}$";
            Match mat = Regex.Match(id, regex);
            if (!mat.Success || mat.ToString().Length > sizeId)
            {
                throw new BusinessRuleValidationException("\n\n[!] ID inserido Inválido [!] \nPor favor insira um ID até SEIS algarismos\n");
            }
            return mat.Value;
        }


        private string VerificarData(string dataEntrega)
        {
            DateTime auxDate = DateTime.ParseExact(DateTime.Now.ToString("dd-MM-yyyy", CultureInfo.InvariantCulture), "dd-MM-yyyy", CultureInfo.InvariantCulture);
            DateTime dataEntregaF = DateTime.ParseExact(dataEntrega, "dd-MM-yyyy", CultureInfo.InvariantCulture);

            try
            {



                if (dataEntregaF < auxDate)
                {
                    throw new BusinessRuleValidationException("\n\n[!] Data inserida Inválida [!] \nPor favor insira uma data não anterior ao dia de hoje\n");
                }
                return dataEntrega;

            }
            catch
            {

                throw new BusinessRuleValidationException("\n\n[!] Data inserida Inválida [!] \nPor favor use este formato: 'dia-mês-ano','dd-mm-yyyy'\n OU \nPor favor insira uma data não anterior ao dia de hoje\n ");
            }

        }

        private float verifcarAcimaDeZero(float valor)
        {


            if (valor <= 0)
            {
                throw new BusinessRuleValidationException("\n\n[!] Valor inserido Inválido [!] \nPor favor verifique que todos os valores são acima de ZERO\n");
            }
            return valor;

        }
    }
}