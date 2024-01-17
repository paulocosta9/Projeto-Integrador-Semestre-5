
export default interface IArmazemRepo {
    exists(armazemId: String): Promise<Boolean>;
    findAll(): Promise<any>;
  }