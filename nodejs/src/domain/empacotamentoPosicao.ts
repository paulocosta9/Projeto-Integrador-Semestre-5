import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';
import { Guard } from '../core/logic/Guard';

interface EmpacotamentoPosicaoProps {
  posicaoX: number;
  posicaoY: number;
  posicaoZ: number;
}

export class EmpacotamentoPosicao extends ValueObject<EmpacotamentoPosicaoProps> {
  get x(): number {
    return this.props.posicaoX;
  }

  get y(): number {
    return this.props.posicaoY;
  }

  get z(): number {
    return this.props.posicaoZ;
  }

  public constructor(props: EmpacotamentoPosicaoProps) {
    super(props);
  }

  public static create(x: number, y: number, z: number): Result<EmpacotamentoPosicao> {
    const posx = x;
    const posy = y;
    const posz = z;

    if (posx < 0 || posx > 10 || posy < 0 || posy > 20 || posz < 0 || posz > 8) {
      return Result.fail<EmpacotamentoPosicao>('Must provide a valid position');
    } else {
      const posicao = new EmpacotamentoPosicao({ posicaoX: posx, posicaoY: posy, posicaoZ: posz });
      return Result.ok<EmpacotamentoPosicao>(posicao);
    }
  }
}
