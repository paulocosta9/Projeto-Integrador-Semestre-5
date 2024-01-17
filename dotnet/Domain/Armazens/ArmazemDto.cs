using System;

namespace DDDSample1.Domain.Armazens
{
    public class ArmazemDto
    {
        public String Id { get; set; }

        public string designacao { get; set; }

        public Endereco end { get; set; }

        public Coordenadas coord { get; set; }

        public bool active { get; set;}

    }
}