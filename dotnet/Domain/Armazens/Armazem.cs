using System;
using DDDSample1.Domain.Shared;
using System.Text.RegularExpressions;
namespace DDDSample1.Domain.Armazens
{
    public class Armazem : Entity<ArmazemId>, IAggregateRoot
    {

        public string designacao { get; private set; }

        public Endereco end { get; private set; }

        public Coordenadas coord { get; private set; }

        public bool Active { get; set; }

        private Armazem()
        {
            this.Active = true;
        }

        public Armazem(string id, string designacao, string rua, string cidade, string codigo_postal, string pais, string porta, float latitude, float longitude, float altitude)
        {

            this.Id = new ArmazemId(VerificarId(id));
            this.designacao = VerificarDesignacao(designacao);
            this.end = new Endereco(rua, cidade, codigo_postal, pais, porta);
            this.coord = new Coordenadas(latitude, longitude, altitude);
            this.Active = true;
        }

        public Armazem(string id, string designacao, Endereco endereco, Coordenadas coordenadas)
        {
            this.Id = new ArmazemId(VerificarId(id));
            this.designacao = VerificarDesignacao(designacao);
            this.end = endereco;
            this.coord = coordenadas;
            this.Active = true;
        }

        public void MudarInformacao(string designacao, Endereco endereco, Coordenadas coordenadas)
        {

            this.designacao = VerificarDesignacao(designacao);
            this.end.MudarEndereco(endereco);
            this.coord.MudarCoordenadas(coordenadas);
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }

        public void MarkAsActive()
        {
            this.Active = true;
        }

        private string VerificarId(string id)
        {
            int sizeId = 3;
            string regex = @"^[0-9A-Z]{" + sizeId + "}$";
            Match mat = Regex.Match(id, regex);
            if (!mat.Success || mat.ToString().Length > sizeId)
            {
                throw new BusinessRuleValidationException("[!] ID inserido Inválido [!] \nPor favor insira um ID com 3 caracteres alfanuméricos");
            }
            return mat.Value;

        }

        private string VerificarDesignacao(string designacao)
        {
            int length = designacao.Length;
            if (length > 50)
            {
                throw new BusinessRuleValidationException("A designação tem de ser válida. Tem de ter no máximo 50 caracteres");
            }
            return designacao;
        }
    }
}