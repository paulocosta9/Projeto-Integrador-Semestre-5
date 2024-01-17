using System;
using DDDSample1.Domain.Armazens;

namespace DDDSample1.Domain.Entregas
{
    public class EntregaDTO
    {
        public String Id { get; set; }
        public string dataEntrega { get; set; }

        public float massaEntrega { get; set; }

        public String armazemEntrega { get; set; }

        public float tempoCarregarEntrega { get; set; }

        public float tempoDescarregarEntrega { get; set; }

    }
}