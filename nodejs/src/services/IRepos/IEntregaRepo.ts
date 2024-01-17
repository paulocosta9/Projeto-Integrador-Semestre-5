

export default interface IEntregaRepo {
  findByDate(data: string): Promise<any>;
  exists(entregaId: String): Promise<Boolean>;
    
}