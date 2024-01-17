using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Armazens
{

    public class Coordenadas : IValueObject
    {
        public float latitude { get; private set; }

        public float longitude { get; private set; }

        public float altitude { get; private set; }

        private Coordenadas()
        {

        }

        public Coordenadas(float latitude, float longitude, float altitude)
        {
            this.latitude = VerificarLatitude(latitude);
            this.longitude = VerificarLongitude(longitude);
            this.altitude = altitude;
        }

        public void MudarCoordenadas(float latitude, float longitude, float altitude){
            this.latitude = VerificarLatitude(latitude);
            this.longitude = VerificarLongitude(longitude);
            this.altitude = altitude;
        }

        public void MudarCoordenadas(Coordenadas coordenadas){
            this.latitude = coordenadas.latitude;
            this.longitude = coordenadas.longitude;
            this.altitude = coordenadas.altitude;
        }

        private float VerificarLatitude(float latitude)
        {
            if (latitude <= -90.0 || latitude >= 90.0)
            {
                throw new BusinessRuleValidationException("Latitude inválida. Valor entre ]-90,90[ (exclusive)");
            }
            return latitude;
        }

        private float VerificarLongitude(float longitude)
        {
            if (longitude <= -180.0 || longitude >= 180.0)
            {
                throw new BusinessRuleValidationException("Longitude inválida. Valor entre ]-180,180[ (exclusive)");
            }
            return longitude;
        }


    }


}