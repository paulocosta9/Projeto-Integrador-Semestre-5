import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ArmazemService } from '../services/armazem.service';
import { Armazem } from '../armazem/armazem';
import { RotaService } from '../services/rota.service';
import { Rota } from '../rota/rota';
import { BoxGeometry, CircleGeometry, MathUtils, Mesh, Object3D, Scene } from 'three';
import { animate } from '@angular/animations';

export class AutomaticMovement {
  private velocidadeH: number = 0;
  private velocidadeV: number = 0;
  private velocidadeA: number = 0;
  private posicaoTruck: Mesh;

  private raioNodes: number[] = [];
  private listaEntregas: number[] = [];

  private RaioF: number = 2;
  private RaioB: number = 2;
  private VelA: number = 0.7;
  private VelB: number = 0.7;
  private VelC: number = 0.7;
  private VelD: number = 1.5;
  private VelE: number = 0.7;
  private VelF: number = 0.7;

  private borda = 0;

  public posicoesArr: number[] = []; //NAO APAGAR
  public rotacoesArr: number[] = []; //NAO APAGAR
  public numeroFrames: number[] = []; //NAO APAGAR

  public K_CIRCULO: number = 4.5;
  public K_LIGACAO: number = 2.0;
  public Wi: number = 4.0; //lARGURA DOS ARCOS, ELEMENTOS DE LIGACAO
  ALTURA_PERSONAGEM: number = 7;
  public K_BERMA: number = 0.25

  public rotacaoComQueSais: number = 0;


  public posX: number = 0
  public posY: number = 0
  public posZ: number = 0
  public rotX: number = 0
  public rotY: number = 0
  public rotZ: number = 0




  constructor(
    private cena: Scene,
    private camiao: Mesh,
    private lista: number[],
    private raiosNodes: number[]

  ) {
    this.posicaoTruck = camiao;
    this.listaEntregas = lista;
    this.raioNodes = raiosNodes
  }

  criarAnimacoes() {

    console.log('Camiao: ' + this.camiao);
    console.log('pox: ' + this.camiao.position.x);
    console.log('poy: ' + this.camiao.position.y);
    console.log('poz: ' + this.camiao.position.z);
    var nodeInicial = this.cena.getObjectByName(
      'Node ' + this.listaEntregas[1]
    ) as THREE.Mesh;


    var nodeFinal = this.cena.getObjectByName(
      'Node ' + this.listaEntregas[0]
    ) as THREE.Mesh;
    var rotacaoDosNodes = Math.atan2(nodeFinal.position.z - nodeInicial.position.z, nodeFinal.position.x - nodeInicial.position.x); //Orientacao dos nodes
    this.rotacaoComQueSais = -rotacaoDosNodes
    this.inicializarPosicaoERotacao(nodeFinal, rotacaoDosNodes, this.listaEntregas[0])

    /*var nodeInicial = this.cena.getObjectByName(
      'Node ' + this.listaEntregas[0]
    ) as THREE.Mesh;

    var nodeFinal = this.cena.getObjectByName(
      'Node ' + this.listaEntregas[1]
    ) as THREE.Mesh;
    var rotacaoDosNodes = Math.atan2(nodeFinal.position.z - nodeInicial.position.z, nodeFinal.position.x - nodeInicial.position.x); //Orientacao dos nodes*/

    /*this.posicaoTruck.position.set(this.posX, this.posY, this.posZ)
    this.posicaoTruck.rotation.set(this.rotX, -rotacaoDosNodes, this.rotZ)*/
    do {
      var nodeInicial = this.cena.getObjectByName(
        'Node ' + this.listaEntregas[0]
      ) as THREE.Mesh;

      var nodeFinal = this.cena.getObjectByName(
        'Node ' + this.listaEntregas[1]
      ) as THREE.Mesh;


      /*var saidaInicial = this.cena.getObjectByName(
        this.listaEntregas[0] - 1 + '-' + (this.listaEntregas[1] - 1)
      ) as THREE.Mesh;
      var entradaFinal = this.cena.getObjectByName(
        this.listaEntregas[1] - 1 + '-' + (this.listaEntregas[0] - 1)
      ) as THREE.Mesh;
      var rua = this.cena.getObjectByName(
        this.listaEntregas[0] - 1 + '/' + (this.listaEntregas[1] - 1)
      ) as THREE.Mesh;
      if (rua == undefined) {
        rua = this.cena.getObjectByName(
          this.listaEntregas[0] - 1 + '/' + (this.listaEntregas[1] - 1)
        ) as THREE.Mesh;
      }*/

      /*ROTACOES CAMIAO NEGATIVAS
        CONTAS COM ROTACOES POSITIVAS C:
      */
      var si = this.K_LIGACAO * this.raioNodes[this.listaEntregas[0]];
      var sj = this.K_LIGACAO * this.raioNodes[this.listaEntregas[1]];
      //console.log('Node Inicial: ' + nodeInicial.name);
      //console.log('Node Final: ' + nodeFinal.name);
      var rotacaoDosNodes = Math.atan2(nodeFinal.position.z - nodeInicial.position.z, nodeFinal.position.x - nodeInicial.position.x); //Orientacao dos nodes
      var pij = Math.sqrt(Math.pow((nodeFinal.position.x - nodeInicial.position.x), 2) + Math.pow((nodeFinal.position.z - nodeInicial.position.z), 2)) - si - sj //Projecao da rampa no OXZ
      var altura = nodeFinal.position.y - nodeInicial.position.y;
      var comprimentoRampa = Math.sqrt(Math.pow(pij, 2) + Math.pow(altura, 2))
      var inclinacaoRampa = Math.atan(altura / pij)

      this.animacaoA(nodeInicial, rotacaoDosNodes);
      this.animacaoB(nodeInicial);
      this.animacaoC(nodeInicial, si, rotacaoDosNodes);
      this.animacaoD(pij, comprimentoRampa, altura, rotacaoDosNodes, inclinacaoRampa, nodeInicial, nodeFinal);
      this.animacaoE(nodeFinal, sj, rotacaoDosNodes);
      this.animacaoF(nodeFinal);

      //Remove nodeInicial
      this.listaEntregas.shift();
      this.rotacaoComQueSais = -rotacaoDosNodes
    } while (this.listaEntregas.length !== 1);
    this.posicaoTruck.position.set(this.posX, this.posY, this.posZ)
    this.posicaoTruck.rotation.set(this.rotX, this.rotY, this.rotZ)

  }

  inicializarPosicaoERotacao(nodeInicial: Mesh, rotacaoDosNodes: number, numeroNode: number) {
    //console.log("Inicializa Posicao e Orientacao")


    var wij = this.Wi;
    this.borda = this.K_BERMA * wij
    var hip =
      (nodeInicial.geometry as CircleGeometry).parameters.radius -
      this.borda +
      this.RaioF;


    var cattrans = (wij / 2) - this.borda + this.RaioF;

    var tetaij = Math.acos(cattrans / hip);

    var dir = -rotacaoDosNodes - tetaij



    this.posicaoTruck.rotation.y = dir


    this.posicaoTruck.position.x = nodeInicial.position.x + (this.raioNodes[numeroNode] - this.borda) * Math.sin(dir);
    this.posicaoTruck.position.y = nodeInicial.position.y + this.ALTURA_PERSONAGEM / 2.0
    this.posicaoTruck.position.z = nodeInicial.position.z + (this.raioNodes[numeroNode] - this.borda) * Math.cos(dir);

    //console.log(this.posicaoTruck.position)
    //console.log(nodeInicial.position)


    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      this.posicaoTruck.rotation.y,
      (this.posicaoTruck!.rotation.z)
    );


    this.posicoesArr.push(
      (this.posicaoTruck.position.x),
      (this.posicaoTruck.position.y),
      (this.posicaoTruck.position.z)
    );

    this.rotX = this.posicaoTruck!.rotation.x,
      this.rotY = this.posicaoTruck.rotation.y,
      this.rotZ = (this.posicaoTruck!.rotation.z)

    this.posX = this.posicaoTruck.position.x
    this.posY = this.posicaoTruck.position.y
    this.posZ = this.posicaoTruck.position.z

  }

  animacaoA(node: Mesh, rotacaoDosNodes: number) {
    //console.log('A');
    var wjk = this.Wi;
    this.borda = this.K_BERMA * wjk;//KBERMA
    var hip =
      (node.geometry as CircleGeometry).parameters.radius -
      this.borda +
      this.RaioB;


    var cattrans = (wjk / 2.0) - this.borda + this.RaioB;

    var tetajk = Math.acos(cattrans / hip);

    var wji = this.Wi;
    this.borda = this.K_BERMA * wji;//KBERMA
    var cattrans = (wji / 2.0) - this.borda + this.RaioF;

    var tetaji = Math.acos(cattrans / hip);
    rotacaoDosNodes = -rotacaoDosNodes

    //console.log("Angulo Entrada B: " + MathUtils.radToDeg(tetaji))
    //console.log("Angulo Entrada B: " + MathUtils.radToDeg(tetajk))
    //console.log("Rotacao Com que Entras: " + MathUtils.radToDeg(rotacaoDosNodes))
    //console.log("Rotacao Com que Sais: " + MathUtils.radToDeg(this.rotacaoComQueSais))


    var anguloCompr = this.rotacaoComQueSais - rotacaoDosNodes - tetajk - tetaji;


    anguloCompr = Math.PI * 2 - anguloCompr
    if (anguloCompr < 0) anguloCompr += Math.PI * 2.0;
    else if (anguloCompr > Math.PI * 2.0) anguloCompr -= Math.PI * 2.0;
    //console.log(MathUtils.radToDeg(anguloCompr))

    var rjbj = (node.geometry as CircleGeometry).parameters.radius - this.borda;
    var dijk = rjbj * anguloCompr;

    var n = Math.ceil(dijk / this.VelA);
    this.velocidadeA = (anguloCompr / n);
    this.velocidadeH = 2.0 * rjbj * Math.sin(anguloCompr / n / 2.0);

    this.velocidadeV = 0.0;


    var positionX = this.posicaoTruck!.position.x
    var positionY = this.posicaoTruck!.position.y
    var positionZ = this.posicaoTruck!.position.z
    var rotacaoCircular = this.posicaoTruck.rotation.y

    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular += this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );
    var f = 0
    for (var i = 0; i < n; i++) {
      //console.log("Angulo de rodagem " + MathUtils.radToDeg(f) + " " + i)
      //f += this.velocidadeA

      var velocidadeHX =
        this.velocidadeH * Math.cos(rotacaoCircular);
      //console.log("HX: " + velocidadeHX)
      var velocidadeHZ =
        this.velocidadeH * Math.sin(-rotacaoCircular);
      //console.log("HZ: " + velocidadeHZ)
      //console.log("Angulo do Camiao " + MathUtils.radToDeg(rotacaoCircular))
      this.posicoesArr.push(
        positionX += velocidadeHX,
        positionY += this.velocidadeV,
        positionZ += velocidadeHZ
      );
      this.rotacoesArr.push(
        this.posicaoTruck!.rotation.x,
        rotacaoCircular += this.velocidadeA,
        (this.posicaoTruck!.rotation.z)
      );
    }

    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular -= this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );

    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    this.posicaoTruck.rotation.y = rotacaoCircular
    this.posicaoTruck.rotation.z = 0
    this.rotacaoComQueSais = rotacaoDosNodes
  }

  animacaoB(nodeInicial: Mesh) {
    //console.log('B');
    var wjk = this.Wi;
    this.borda = this.K_BERMA * wjk;//KBERMA
    var hip =
      (nodeInicial.geometry as CircleGeometry).parameters.radius -
      this.borda +
      this.RaioB;


    var cattrans = (wjk / 2.0) - this.borda + this.RaioB;

    var tetajk = Math.acos(cattrans / hip);

    //console.log(MathUtils.radToDeg(tetajk))

    var cjk = this.RaioB * tetajk;
    var n = Math.ceil(cjk / this.VelB);
    this.velocidadeA = tetajk / n;
    this.velocidadeH = 2.0 * this.RaioB * Math.sin(tetajk / n / 2.0);
    this.velocidadeV = 0.0;

    var velocidadeHX;
    var velocidadeHZ;

    var fotogramaB = n;

    var x = this.numeroFrames.length + fotogramaB;

    for (var i = this.numeroFrames.length; i < x; i++) {
      //console.log(i);
      this.numeroFrames[i] = i;
    }
    var rotacaoCircular = this.posicaoTruck.rotation.y;
    var positionX = this.posicaoTruck.position.x
    var positionY = this.posicaoTruck.position.y
    var positionZ = this.posicaoTruck.position.z

    //Ajuste
    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular += this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );

    for (var i = 0; i < fotogramaB; i++) {

      velocidadeHX = this.velocidadeH * Math.cos(-rotacaoCircular);
      velocidadeHZ = this.velocidadeH * Math.sin(-rotacaoCircular);

      this.posicoesArr.push(
        (positionX += velocidadeHX),
        (positionY += this.velocidadeV),
        (positionZ += velocidadeHZ)
      );

      this.rotacoesArr.push(
        (this.posicaoTruck!.rotation.x),
        (rotacaoCircular -= this.velocidadeA),
        0
      );

    }
    //Ajustar Orientacao
    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular -= this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );
    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    //NO X
    this.posicaoTruck.rotation.y = rotacaoCircular
    this.posicaoTruck.rotation.z = 0
  }

  animacaoC(nodeInicial: Mesh, comprimentoEntrada: number, orientacaoDaEntrada: number) {
    //console.log('C');
    var larguraEstrada = this.Wi;
    this.borda = this.K_BERMA * larguraEstrada;
    var raioNode = (nodeInicial.geometry as CircleGeometry).parameters.radius;
    //console.log(raioNode)
    var rjMenosbj = raioNode - this.borda;

    var hipot = rjMenosbj + this.RaioB;

    var wjk = larguraEstrada

    var catTRANS = wjk / 2 - this.borda + this.RaioB;
    var catlong = Math.sqrt(Math.pow(hipot, 2) - Math.pow(catTRANS, 2));
    var lij = comprimentoEntrada - catlong;
    var n = Math.ceil(lij / this.VelC);
    this.velocidadeA = 0.0;
    this.velocidadeH = lij / n;
    this.velocidadeV = 0.0;

    var rotacao = orientacaoDaEntrada;
    var velocidadeHX = Math.cos(rotacao!) * this.velocidadeH;
    var velocidadeHZ = Math.sin(rotacao!) * this.velocidadeH;

    var fotogramaC = n;
    var x = this.numeroFrames.length + fotogramaC;

    for (var i = this.numeroFrames.length; i < x; i++) {
      //console.log(i);
      this.numeroFrames[i] = i;
    }


    var positionX = this.posicaoTruck.position.x
    var positionY = this.posicaoTruck.position.y
    var positionZ = this.posicaoTruck.position.z
    for (var i = 0; i < fotogramaC; i++) {
      this.posicoesArr.push(
        (positionX += velocidadeHX),
        (positionY += this.velocidadeV),
        (positionZ += velocidadeHZ)
      );

      this.rotacoesArr.push(
        this.posicaoTruck!.rotation.x,
        this.posicaoTruck!.rotation.y,//-rotacao
        0
      ); //Nao existe inclinacao. Mas tem de estar orientado para
    }

    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    this.posicaoTruck.rotation.x = this.posicaoTruck!.rotation.x,
      this.posicaoTruck.rotation.y = this.posicaoTruck.rotation.y,
      this.posicaoTruck.rotation.z = 0
  }

  //Movimento na rampa com rotacao em Y negativa porque sentido retrogrado
  animacaoD(comprimentoProjecao: number, comprimentoRampa: number, altura: number, rotacaoDosNodes: number, inclinacaoRampa: number, nodeInicial: Mesh, nodeFinal: Mesh) {
    //console.log('D');


    var fotogramaD = Math.ceil(
      comprimentoRampa / this.VelD
    );

    this.velocidadeH =
      comprimentoProjecao / fotogramaD;

    //PROJECAO, CATETO


    this.velocidadeV = altura / fotogramaD;

    var rotacao = rotacaoDosNodes; //Orientacao dos nodes

    var velocidadeHX = Math.cos(rotacao!) * this.velocidadeH;

    var velocidadeHZ = Math.sin(rotacao!) * this.velocidadeH;

    this.velocidadeA = 0.0;

    // Create an animation to move the object from the first node to the second
    var x = this.numeroFrames.length + fotogramaD;
    for (var i = this.numeroFrames.length; i < x; i++) {
      //console.log(i)
      this.numeroFrames[i] = i;
    }

    var positionX = this.posicaoTruck.position.x
    var positionY = this.posicaoTruck.position.y
    var positionZ = this.posicaoTruck.position.z
    for (var i = 0; i < fotogramaD; i++) {
      this.posicoesArr.push(
        (positionX += velocidadeHX),
        (positionY += this.velocidadeV),
        (positionZ += velocidadeHZ)
      );



      this.rotacoesArr.push(
        this.posicaoTruck!.rotation.x,
        this.posicaoTruck.rotation.y, //Faz sentido ser a orientação da rua
        inclinacaoRampa
      );
    }
    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    this.posicaoTruck.rotation.x = this.posicaoTruck!.rotation.x,
      this.posicaoTruck.rotation.y = this.posicaoTruck.rotation.y,
      this.posicaoTruck.rotation.z = inclinacaoRampa

  }

  //Movimento entrada no node final
  animacaoE(nodeFinal: Mesh, comprimentoEntrada: number, orientacaoDaEntrada: number) {
    //console.log('E');
    var larguraEstrada = this.Wi;
    this.borda = this.K_BERMA * larguraEstrada;
    var raioNode = (nodeFinal.geometry as CircleGeometry).parameters.radius;
    var rjMenosbj = raioNode - this.borda;

    var hipot = rjMenosbj + this.RaioF;

    var wjk = larguraEstrada

    var catTRANS = wjk / 2.0 - this.borda + this.RaioF;
    var catlong = Math.sqrt(Math.pow(hipot, 2) - Math.pow(catTRANS, 2));
    var lij = comprimentoEntrada - catlong;
    var n = Math.ceil(lij / this.VelE);
    this.velocidadeA = 0.0;
    this.velocidadeH = lij / n;
    this.velocidadeV = 0.0;

    var rotacao = orientacaoDaEntrada;
    var velocidadeHX = Math.cos(rotacao!) * this.velocidadeH;
    var velocidadeHZ = Math.sin(rotacao!) * this.velocidadeH;

    var fotogramaE = n;
    var x = this.numeroFrames.length + fotogramaE;
    for (var i = this.numeroFrames.length; i < x; i++) {
      //console.log(i);
      this.numeroFrames[i] = i;
    }
    var positionX = this.posicaoTruck.position.x
    var positionY = this.posicaoTruck.position.y
    var positionZ = this.posicaoTruck.position.z
    for (var i = 0; i < fotogramaE; i++) {
      this.posicoesArr.push(
        (positionX += velocidadeHX),
        (positionY += this.velocidadeV),
        (positionZ += velocidadeHZ)
      );

      this.rotacoesArr.push(
        this.posicaoTruck!.rotation.x,
        this.posicaoTruck.rotation.y,
        0
      );
    }

    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    this.posicaoTruck.rotation.x = this.posicaoTruck!.rotation.x,
      this.posicaoTruck.rotation.y = this.posicaoTruck.rotation.y,
      this.posicaoTruck.rotation.z = 0
  }

  //Movimento entrada curva node final
  animacaoF(nodeFinal: Mesh) {
    //console.log('F');
    var wji = this.Wi;
    this.borda = this.K_BERMA * wji;//KBERMA
    var hip =
      (nodeFinal.geometry as CircleGeometry).parameters.radius -
      this.borda +
      this.RaioF;


    var cattrans = (wji / 2.0) - this.borda + this.RaioF;

    var tetaij = Math.acos(cattrans / hip);



    var cij = this.RaioF * tetaij;
    var n = Math.ceil(cij / this.VelF);
    this.velocidadeA = tetaij / n;
    this.velocidadeH = 2.0 * this.RaioF * Math.sin(tetaij / n / 2.0);
    this.velocidadeV = 0.0;

    var velocidadeHX;
    var velocidadeHZ;

    var fotogramaF = n;
    var x = this.numeroFrames.length + fotogramaF;
    for (var i = this.numeroFrames.length; i < x; i++) {
      //console.log(i);
      this.numeroFrames[i] = i;
    }

    var positionX = this.posicaoTruck.position.x
    var positionY = this.posicaoTruck.position.y
    var positionZ = this.posicaoTruck.position.z
    var rotacaoCircular = this.posicaoTruck.rotation.y;

    //Ajustar Orientacao
    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular += this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );
    for (var i = 0; i < fotogramaF; i++) {


      velocidadeHX = this.velocidadeH * Math.cos(-rotacaoCircular);
      velocidadeHZ = this.velocidadeH * Math.sin(-rotacaoCircular);

      this.posicoesArr.push(
        (positionX += velocidadeHX),
        (positionY += this.velocidadeV),
        (positionZ += velocidadeHZ)
      );

      this.rotacoesArr.push(
        (this.posicaoTruck!.rotation.x),
        (rotacaoCircular -= this.velocidadeA),
        0
      );


    }

    //Ajustar Orientacao
    this.posicoesArr.push(
      positionX,
      positionY,
      positionZ
    );
    this.rotacoesArr.push(
      this.posicaoTruck!.rotation.x,
      rotacaoCircular -= this.velocidadeA / 2,
      (this.posicaoTruck!.rotation.z)
    );

    this.posicaoTruck!.position.x = positionX
    this.posicaoTruck!.position.y = positionY
    this.posicaoTruck!.position.z = positionZ

    //NO X
    this.posicaoTruck.rotation.y = rotacaoCircular
    this.posicaoTruck.rotation.z = 0
  }
}
