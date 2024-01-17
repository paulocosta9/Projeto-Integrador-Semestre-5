import { Request } from "express";
import { Result } from "../../core/logic/Result";
import ICamiaoDTO from "../../dto/ICamiaoDTO";

export default interface ICamiaoService  {
  createCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>>;
  deleteCamiao (camiaoId: string): Promise<Result<ICamiaoDTO>>;

  getCamioes (): Promise<Result<ICamiaoDTO[]>>;
  getCamiao (camiaoId: string): Promise<Result<ICamiaoDTO>>;
  getMatricula (matriculaString : string): Promise<Result<ICamiaoDTO>>;
  getByNome (nomeString : string): Promise<Result<ICamiaoDTO>>;

  updateCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>>;
  patchCamiao(camiaoMatricula: string, req: Request): Promise<Result<ICamiaoDTO>>;
}
