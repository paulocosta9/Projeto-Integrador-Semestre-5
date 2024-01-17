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
import { PercursoService } from '../services/percurso.service';
import { EntregaService } from '../services/entrega.service';
import { Rota } from '../rota/rota';
import { AutomaticMovement } from './AutomaticMovement';
import { Percurso } from '../percurso/percurso';
import { AnimacaoCamiao } from './animacaoCamiao';
import { MovimentoInterativo } from './MovimentoInterativo';
import { Mesh } from 'three';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css'],
})
export class VisualizerComponent implements OnInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  @ViewChild('datasSelect') datasSelect!: ElementRef<HTMLSelectElement>;
  flagRodovia = false;
  flagInter = false;
  flagAutomatico = false;
  flagAutomatico2 = false;
  flagLoadingRod = false;
  flagLoadingInt = false;
  flagLoadingAut = false;
  flagStartRod = false;
  flagStartInt = false;
  flagStartAut = false;

  //* Cube Properties

  //? Helper Properties (Private Properties);
  camioes: string[] = [];
  percursos: number[][] = [];
  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private objectArr: any[] = [];
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 1);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private orbitControls!: OrbitControls;

  armazensOBJ = 0;
  armazensGLTF = 0;
  camiaoGLTF = 0;
  numeroCamioes = 0;
  load = false; //Camioes
  loaded = 1; //Para o primeiro Load
  datas: string[] = [];
  dataPercurso: string = '';
  cordX = [0, 2];
  cordZ = [0, 2];
  cordY = [0, 2];
  ids: string[] = [];
  nomes: string[] = [];

  coordXArmazens: number[] = [];
  coordYArmazens: number[] = [];
  coordZArmazens: number[] = [];

  coordLongArmazens: number[] = [];
  coordLatArmazens: number[] = [];
  coordAltArmazens: number[] = [];

  parOri: number[] = [];
  parDest: number[] = [];
  raioNoAnimacao: number[] = [];

  nodesCirculos: Mesh[] = [];
  elementosDeLigacao: Mesh[] = [];
  rampas: Mesh[] = [];
  inclinacoes: number[] = [];

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */

  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x4c566a);

    const hemiLight = new THREE.AmbientLight(0x404040);
    this.scene.add(hemiLight);
    const dirLight = new THREE.SpotLight(0xffffff, 2);
    dirLight.position.set(100, 300, 200);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    dirLight.shadow.mapSize.width = 512; // default
    dirLight.shadow.mapSize.height = 512; // default
    dirLight.shadow.camera.near = 0.5; // default
    dirLight.shadow.camera.far = 500; // default

    //Mostrar spotlight camera
    //const helper = new THREE.CameraHelper( dirLight.shadow.camera );
    //this.scene.add( helper );

    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.position.set(400, 200, 0);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof VisualizerComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setPixelRatio(devicePixelRatio);

    var width = document.getElementById('container')?.offsetWidth;
    if (width === undefined) {
      width = 1920;
    }
    var height = document.getElementById('container')?.offsetWidth;
    if (height === undefined) {
      height = 1080;
    }
    this.renderer.setSize(width, 881);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.listenToKeyEvents(window);
    this.orbitControls.enablePan = true;

    this.orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.orbitControls.dampingFactor = 0.05;

    this.orbitControls.screenSpacePanning = false;

    //zoom min and max distance
    this.orbitControls.minDistance = 100;
    this.orbitControls.maxDistance = 500;

    this.orbitControls.maxPolarAngle = Math.PI / 2;
    let component: VisualizerComponent = this;

    const K_CIRCULO = 4.5;
    const K_LIGACAO = 2.0;
    const Wi = 4;

    /*coordLongArmazens = [8.2451, 8.641, 8.7613, 8.621, 8.6963];
    coordLatArmazens = [40.9321, 41.0072, 42.1115, 41.2279, 41.1844];
    coordAltArmazens = [250, 550, 200, 700, 350];*/

    /*const parOri = [1, 2, 1, 3, 3, 2, 1, 4];
    const parDest = [2, 1, 3, 1, 2, 3, 4, 1];*/

    //creates the "trees"

    const raioNo = [];

    const nodes = [];

    const posPontosLigacaoX = [];
    const posPontosLigacaoY = [];
    const posPontosLigacaoZ = [];

    for (let i = 0; i < this.coordLatArmazens.length; i++) {
      var raio = (K_CIRCULO * Wi) / 2.0;

      raioNo.push(raio);
      this.raioNoAnimacao.push(raio);

      //Texturas Rotundas
      let caminhoRotundaRoughness = 'assets/Rotunda/Gravel024_1K_Roughness.jpg';
      let caminhoRotunda = 'assets/Rotunda/Gravel024_1K_Color.jpg';
      let texturaRoughnessRotunda = new THREE.TextureLoader().load(
        caminhoRotundaRoughness
      );
      let texturaRotunda = new THREE.TextureLoader().load(caminhoRotunda);
      const geometry = new THREE.CircleGeometry(raio, 20);
      const material = new THREE.MeshStandardMaterial({
        map: texturaRotunda,
        flatShading: true,
      });
      material.roughnessMap = texturaRoughnessRotunda;
      //----------

      // pos em coordenadas
      let posX =
        ((50 - -50) / (8.7613 - 8.2451)) *
          (this.coordLongArmazens[i] - 8.2451) +
        -50;
      let posY =
        ((50 - -50) / (42.1115 - 40.8387)) *
          (this.coordLatArmazens[i] - 40.8387) +
        -50;
      let posZ = (50 / 800) * this.coordAltArmazens[i];

      //console.log(posX, posY, posZ);
      material.side = THREE.DoubleSide;
      this.coordXArmazens.push(posX);
      this.coordYArmazens.push(posY);
      this.coordZArmazens.push(posZ);

      // circulos
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = posX;
      mesh.position.y = posZ + raio;
      mesh.position.z = posY;
      mesh.rotateX(-Math.PI / 2);

      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      mesh.name = 'Node ' + (i + 1);
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      this.scene.add(mesh);
      //console.log(mesh.name);
      nodes.push(mesh);
      this.nodesCirculos.push(mesh);
      //------------
    }

    //Entrada/Saida
    for (let i = 0; i < this.parOri.length; i++) {
      let armOrigem = this.parOri[i] - 1;
      let armDestino = this.parDest[i] - 1;

      //console.log("armOri " + armOrigem);
      //console.log("armDest " + armDestino);

      let cordOrigemX = this.coordXArmazens[armOrigem];
      let cordOrigemY = this.coordYArmazens[armOrigem];
      let cordOrigemZ = this.coordZArmazens[armOrigem];

      let cordDestinoX = this.coordXArmazens[armDestino];
      let cordDestinoY = this.coordYArmazens[armDestino];
      let cordDestinoZ = this.coordZArmazens[armDestino];

      //console.log('Origem ' + cordOrigemX, cordOrigemY, cordOrigemZ);
      //console.log('Destino ' + cordDestinoX, cordDestinoY, cordDestinoZ);

      //let calculo = ((cordDestinoZ-cordOrigemZ)/(cordDestinoX-cordOrigemX));
      let orientacao = Math.atan2(
        cordDestinoY - cordOrigemY,
        cordDestinoX - cordOrigemX
      );

      //console.log(orientacao);

      let comprimento = K_LIGACAO * raioNo[armOrigem];

      //Texturas Elemento de Ligação
      let caminhoElementoLigacaoRoughness =
        'assets/Rua/Road007_1K_Roughness.jpg';
      let caminhoElementoLigacao = 'assets/Rua/Road007_1K_Color.jpg';
      let texturaRoughnessElementoLigacao = new THREE.TextureLoader().load(
        caminhoElementoLigacaoRoughness
      );
      let texturaElementoLigacao = new THREE.TextureLoader().load(
        caminhoElementoLigacao
      );
      texturaElementoLigacao.wrapS = THREE.RepeatWrapping;
      texturaElementoLigacao.wrapT = THREE.RepeatWrapping;
      texturaElementoLigacao.repeat.set(1, 2);

      const geometry = new THREE.BoxGeometry(Wi, comprimento, 1);
      const material = new THREE.MeshStandardMaterial({
        map: texturaElementoLigacao,
      });
      material.roughnessMap = texturaRoughnessElementoLigacao;
      const retangulo = new THREE.Mesh(geometry, material);
      this.elementosDeLigacao.push(retangulo);
      //------------
      console.log(armOrigem)
      
      nodes[armOrigem]?.add(retangulo);
      

      retangulo.position.x = cordOrigemX;
      retangulo.position.y = cordOrigemZ + raioNo[armOrigem] - 0.6;
      retangulo.position.z = cordOrigemY;

      retangulo.rotateX(Math.PI / 2);

      if (cordDestinoX > cordOrigemX && cordDestinoY > cordOrigemY) {
        retangulo.rotateZ(-Math.PI / 2 + orientacao);
        let x = (comprimento / 2) * Math.cos(orientacao) + cordOrigemX;
        let y = (comprimento / 2) * Math.sin(orientacao) + cordOrigemY;

        retangulo.position.x = x;
        retangulo.position.z = y;
      } else if (cordDestinoX < cordOrigemX && cordDestinoY < cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);

        let x = (comprimento / 2) * Math.cos(orientacao) + cordOrigemX;
        let y = (comprimento / 2) * Math.sin(orientacao) + cordOrigemY;

        retangulo.position.x = x;
        retangulo.position.z = y;
      } else if (cordDestinoX > cordOrigemX && cordDestinoY < cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);

        let x = (comprimento / 2) * Math.cos(orientacao) + cordOrigemX;
        let y = (comprimento / 2) * Math.sin(orientacao) + cordOrigemY;

        retangulo.position.x = x;
        retangulo.position.z = y;
      } else if (cordDestinoX < cordOrigemX && cordDestinoY > cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);

        let x = (comprimento / 2) * Math.cos(orientacao) + cordOrigemX;
        let y = (comprimento / 2) * Math.sin(orientacao) + cordOrigemY;

        retangulo.position.x = x;
        retangulo.position.z = y;
      }
      retangulo.name = armOrigem + '-' + armDestino;
      retangulo.receiveShadow = true;
      retangulo.castShadow = false;
      this.scene.add(retangulo);
      console.log(retangulo.name);
    }
    //Rampas
    for (let i = 0; i < this.parOri.length; i += 2) {
      let armOrigem = this.parOri[i] - 1;
      let armDestino = this.parDest[i] - 1;

      //console.log("armOri2 " + armOrigem);
      //console.log("armDest2 " + armDestino);

      let cordOrigemX = this.coordXArmazens[armOrigem];
      let cordOrigemY = this.coordYArmazens[armOrigem];
      let cordOrigemZ = this.coordZArmazens[armOrigem];

      let cordDestinoX = this.coordXArmazens[armDestino];
      let cordDestinoY = this.coordYArmazens[armDestino];
      let cordDestinoZ = this.coordZArmazens[armDestino];

      let orientacao = Math.atan2(
        cordDestinoY - cordOrigemY,
        cordDestinoX - cordOrigemX
      );

      let cordMediaX = (cordDestinoX + cordOrigemX) / 2;
      let cordMediaY = (cordDestinoY + cordOrigemY) / 2;
      let cordMediaZ = (cordDestinoZ + cordOrigemZ) / 2;

      let plano =
        Math.sqrt(
          Math.pow(cordDestinoX - cordOrigemX, 2) +
            Math.pow(cordDestinoY - cordOrigemY, 2)
        ) -
        K_LIGACAO * raioNo[armOrigem] -
        K_LIGACAO * raioNo[armDestino];
      let desnivel = cordDestinoZ - cordOrigemZ;

      let comprimento = Math.sqrt(Math.pow(plano, 2) + Math.pow(desnivel, 2));
      let inclinacao = Math.atan(desnivel / plano);
      this.inclinacoes.push(inclinacao);

      //Texturas da Rua
      let caminhoRuaRoughness = 'assets/Rua/Road007_1K_Roughness.jpg';
      let caminhoRua = 'assets/Rua/Road007_1K_Color.jpg';
      let texturaRoughnessRua = new THREE.TextureLoader().load(
        caminhoRuaRoughness
      );
      let texturaRua = new THREE.TextureLoader().load(caminhoRua);
      texturaRua.wrapS = THREE.RepeatWrapping;
      texturaRua.wrapT = THREE.RepeatWrapping;
      texturaRua.repeat.set(1, comprimento / 10);

      const geometry = new THREE.BoxGeometry(Wi, comprimento, 1);
      const material = new THREE.MeshStandardMaterial({ map: texturaRua });
      material.roughnessMap = texturaRoughnessRua;

      const retangulo = new THREE.Mesh(geometry, material);
      //----------------

      retangulo.position.x = cordMediaX;
      retangulo.position.y = cordMediaZ + raioNo[armOrigem] - 0.6;
      retangulo.position.z = cordMediaY;

      retangulo.rotateX(Math.PI / 2);

      if (cordDestinoX > cordOrigemX && cordDestinoY > cordOrigemY) {
        retangulo.rotateZ(-Math.PI / 2 + orientacao);
      } else if (cordDestinoX < cordOrigemX && cordDestinoY < cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);
      } else if (cordDestinoX > cordOrigemX && cordDestinoY < cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);
      } else if (cordDestinoX < cordOrigemX && cordDestinoY > cordOrigemY) {
        retangulo.rotateZ(Math.PI / 2 + orientacao);
      }

      //console.log("Ori - Desti " + cordOrigemZ + " " + cordDestinoZ)

      if (
        cordDestinoZ > cordOrigemZ &&
        cordDestinoX > cordOrigemX &&
        cordDestinoY > cordOrigemY
      ) {
        retangulo.rotateX(-inclinacao);
      } else if (
        cordDestinoZ > cordOrigemZ &&
        cordDestinoX < cordOrigemX &&
        cordDestinoY < cordOrigemY
      ) {
        retangulo.rotateX(inclinacao);
      } else if (
        cordDestinoZ < cordOrigemZ &&
        cordDestinoX > cordOrigemX &&
        cordDestinoY > cordOrigemY
      ) {
        retangulo.rotateX(-inclinacao);
      } else {
        retangulo.rotateX(inclinacao);
      }

      retangulo.name = armOrigem + '/' + armDestino;
      retangulo.receiveShadow = true;
      retangulo.castShadow = false;
      this.scene.add(retangulo);
      this.rampas.push(retangulo);
      //console.log('Armazem Origem: ' + armOrigem);
      //console.log('Nome da Rua: ' + retangulo.name);
    }

    window.addEventListener('resize', this.onWindowResize);

    this.cordX = this.coordXArmazens;
    this.cordZ = this.coordYArmazens;
    this.cordY = this.coordZArmazens;

    this.putArmazens(
      this.nomes,
      this.ids,
      this.cordX,
      this.cordY,
      this.cordZ,
      1
    );

    function animate() {
      requestAnimationFrame(animate);

      var value = 1000;

      var minPan = new THREE.Vector3(-value, -value, -value);
      var maxPan = new THREE.Vector3(value, value, value);

      component.camera.position.clamp(minPan, maxPan);

      component.renderer.render(component.scene, component.camera);
    }

    animate();
  }

  putArmazens(
    nomes: string[],
    ids: string[],
    cordX: number[],
    cordY: number[],
    cordZ: number[],
    type: number
  ) {
    if (type == 1) {
      this.putArmazensOBJ(nomes, ids, cordX, cordY, cordZ);
    } else {
      this.putArmazensGLTF(nomes, ids, cordX, cordY, cordZ);
    }
  }

  putArmazensOBJ(
    nomes: string[],
    ids: string[],
    cordX: number[],
    cordY: number[],
    cordZ: number[]
  ) {
    for (let i = 0; i < ids.length; i++) {
      this.createArmazemOBJ(
        ids[i].toString() + ' ' + nomes[i],
        cordX[i],
        cordY[i],
        cordZ[i],
        i.toString(),
        256,
        32
      );
    }
  }

  putArmazensGLTF(
    nomes: string[],
    ids: string[],
    cordX: number[],
    cordY: number[],
    cordZ: number[]
  ) {
    for (let i = 0; i < ids.length; i++) {
      this.createArmazemGLTF(
        ids[i].toString() + ' ' + nomes[i],
        cordX[i],
        cordY[i],
        cordZ[i],
        i.toString(),
        256,
        32
      );
    }
  }

  async createArmazemOBJ(
    nome: string,
    x: number,
    y: number,
    z: number,
    id: string,
    labelWidth: number,
    size: number
  ) {
    var color = this.colorChooser(parseInt(id));
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    //console.log(color);
    mtlLoader.load('assets/Armazem/object/' + color + '.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('assets/Armazem/object/mart.obj', (root) => {
        root.position.x = x;
        root.position.y = y + 1;
        root.position.z = z;
        var e = root;
        e.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        root.castShadow = true;
        root.receiveShadow = false;
        const canvas = this.makeLabelCanvas(labelWidth, size, nome);
        const texture = new THREE.CanvasTexture(canvas);
        // because our canvas is likely not a power of 2
        // in both dimensions set the filtering appropriately.
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        // if units are meters then 0.01 here makes size
        // of the label into centimeters.
        const labelBaseScale = 0.2;
        const label = new THREE.Sprite(labelMaterial);
        root.add(label);
        label.position.y = labelWidth * 0.05 + size * 0.1;

        label.scale.x = canvas.width * labelBaseScale;
        label.scale.y = canvas.height * labelBaseScale;

        root.name = id;
        this.scene.add(root);

        this.loadedObjectsOBJ();
      });
    });
  }

  async createCamiaoOBJ(
    nome: string,
    x: number,
    y: number,
    z: number,
    id: string,
    labelWidth: number,
    size: number
  ) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('assets/Camiao/OBJ/camiao.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('assets/Camiao/OBJ/camiao.obj', (root) => {
        root.position.setY(y);
        root.position.setX(x);
        root.position.setZ(z);
        var e = root;
        e.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        root.castShadow = true;
        root.receiveShadow = false;
        var name = id + ' ' + nome;
        const canvas = this.makeLabelCanvas(labelWidth, size, name);
        const texture = new THREE.CanvasTexture(canvas);
        // because our canvas is likely not a power of 2
        // in both dimensions set the filtering appropriately.
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        // if units are meters then 0.01 here makes size
        // of the label into centimeters.
        root.scale.x = 0.03;
        root.scale.y = 0.03;
        root.scale.z = 0.03;

        const labelBaseScale = 3;
        const label = new THREE.Sprite(labelMaterial);
        label.position.y = labelWidth * 0.15 + size * 0.1;

        label.scale.x = canvas.width * labelBaseScale;
        label.scale.y = canvas.height * labelBaseScale;
        root.add(label);
        root.name = name;
        this.scene.add(root);
      });
    });
  }

  colorChooser(id: number) {
    var resto = id % 17;
    switch (resto) {
      case 0:
        return 'vermelho';
        break;
      case 1:
        return 'verde';
        break;
      case 2:
        return 'roxo';
        break;
      case 3:
        return 'rosa';
        break;
      case 4:
        return 'preto';
        break;
      case 5:
        return 'lilas';
        break;
      case 6:
        return 'laranja';
        break;
      case 7:
        return 'jade';
        break;
      case 8:
        return 'fuchsia';
        break;
      case 9:
        return 'ciano';
        break;
      case 10:
        return 'castanho';
        break;
      case 11:
        return 'branco';
        break;
      case 12:
        return 'azul_escuro';
        break;
      case 13:
        return 'azul_claro';
        break;
      case 14:
        return 'amarelo';
        break;
      case 15:
        return 'azul';
        break;
      case 16:
        return 'cinza';
        break;
      default:
        return 'vermelho';
    }
  }

  makeLabelCanvas(baseWidth: number, size: number, name: string) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font = `${size}px bold sans-serif`;
    ctx!.font = font;
    // measure how long the name will be
    const textWidth = ctx!.measureText(name).width;

    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx!.canvas.width = width;
    ctx!.canvas.height = height;

    // need to set font again after resizing canvas
    ctx!.font = font;
    ctx!.textBaseline = 'middle';
    ctx!.textAlign = 'center';

    ctx!.fillStyle = 'transparent';
    ctx!.fillRect(0, 0, width, height);

    // scale to fit but don't stretch
    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx!.translate(width / 2, height / 2);
    ctx!.scale(scaleFactor, 1);
    ctx!.fillStyle = 'white';
    ctx!.fillText(name, 0, 0);

    return ctx!.canvas;
  }

  loadedObjectsOBJ() {
    this.armazensOBJ++;

    if (this.armazensOBJ == this.ids.length) {
      this.armazensOBJ = 0;
      //console.log('Loaded');
      if (this.loaded == 1) {
        const button = document.getElementById('importObj');
        button!.addEventListener('click', () => {
          this.removerArmazens(this.ids);
          this.putArmazens(
            this.nomes,
            this.ids,
            this.cordX,
            this.cordY,
            this.cordZ,
            1
          );
        });
        const button2 = document.getElementById('importGLTF');
        button2!.addEventListener('click', () => {
          this.removerArmazens(this.ids);
          this.putArmazens(
            this.nomes,
            this.ids,
            this.cordX,
            this.cordY,
            this.cordZ,
            0
          );
        });
        this.loaded = 0;
      }
    }
  }

  removerArmazens(nomes: string[]) {
    for (var i = 0; i < nomes.length; i++) {
      this.removeEntity(i.toString());
    }
  }

  removeEntity(nome: string) {
    var selectedObject = this.scene.getObjectByName(nome);

    this.scene.remove(selectedObject!);
  }

  createArmazemGLTF(
    nome: string,
    x: number,
    y: number,
    z: number,
    id: string,
    labelWidth: number,
    size: number
  ) {
    var color = this.colorChooser(parseInt(id));
    const gltfLoader = new GLTFLoader();
    const url = 'assets/Armazem/gltf/mart_' + color + '.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.position.x = x;
      root.position.y = y + 1;
      root.position.z = z;

      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });
      root.castShadow = true;
      root.receiveShadow = false;
      const canvas = this.makeLabelCanvas(labelWidth, size, nome);
      const texture = new THREE.CanvasTexture(canvas);
      // because our canvas is likely not a power of 2
      // in both dimensions set the filtering appropriately.
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      // if units are meters then 0.01 here makes size
      // of the label into centimeters.
      const labelBaseScale = 0.2;
      const label = new THREE.Sprite(labelMaterial);
      root.add(label);
      label.position.y = labelWidth * 0.05 + size * 0.1;

      label.scale.x = canvas.width * labelBaseScale;
      label.scale.y = canvas.height * labelBaseScale;

      root.name = id.toString();
      this.scene.add(root);
      this.loadedObjectsGLTF();
    });
  }

  createCamiaoGLTF(
    nome: string,
    x: number,
    y: number,
    z: number,
    id: string,
    labelWidth: number,
    size: number,
    callback: () => void
  ) {
    const gltfLoader = new GLTFLoader();
    const url = 'assets/Camiao/GLTF/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.position.setY(y);
      root.position.setX(x);
      root.position.setZ(z);
      var name = id + ' ' + nome;
      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });
      root.castShadow = true;
      root.receiveShadow = false;
      const canvas = this.makeLabelCanvas(labelWidth, size, name);
      const texture = new THREE.CanvasTexture(canvas);
      // because our canvas is likely not a power of 2
      // in both dimensions set the filtering appropriately.
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      // if units are meters then 0.01 here makes size
      // of the label into centimeters.

      root.name = name;

      root.scale.x = 0.03;
      root.scale.y = 0.03;
      root.scale.z = 0.03;

      const labelBaseScale = 3;
      const label = new THREE.Sprite(labelMaterial);
      label.position.y = labelWidth * 0.15 + size * 0.1;

      label.scale.x = canvas.width * labelBaseScale;
      label.scale.y = canvas.height * labelBaseScale;
      root.add(label);
      root.name = nome;
      this.scene.add(root);
      callback();
    });
  }

  loadedObjectsGLTF() {
    this.armazensGLTF++;

    if (this.armazensGLTF == this.ids.length) {
      this.armazensGLTF = 0;
      //console.log('Loaded');
    }
  }

  onWindowResize() {
    this.camera!.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  carregarArmazens(arm: Armazem[]) {
    for (let i = 0; i < arm.length; i++) {
      this.coordLatArmazens[i] = arm[i].coord.latitude!;
      this.coordLongArmazens[i] = arm[i].coord.longitude!;
      this.coordAltArmazens[i] = arm[i].coord.altitude!;

      if (arm[i].active == false) {
        this.ids[i] = '!';
        this.nomes[i] = '!!';
      } else {
        this.ids[i] = arm[i].id!.toString();
        this.nomes[i] = arm[i].designacao.replace('Armazém de ', '');
      }
    }
  }

  carregarAsNRotas(arm: Armazem[], rotas: Rota[], n: number) {
    rotas.sort(function (a, b) {
      if (a.armazemInicial! > b.armazemInicial!) {
        return 1;
      }
      if (a.armazemInicial! < b.armazemInicial!) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    for (let i = 0; i < rotas.length - 1; i += arm.length - 1) {
      var rotasArm = rotas.slice(i, i + arm.length - 1);

      rotasArm.sort(function (a, b) {
        if (a.distancia! > b.distancia!) {
          return 1;
        }
        if (a.distancia! < b.distancia!) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      var rotasThree = rotasArm.splice(0, n);
      //console.log(rotasThree)
      for (let j = 0; j < rotasThree.length; j++) {
        let bool = true;

        for (let k = 0; k < this.parOri.length; k++) {
          if (
            this.parOri[k] == parseInt(rotasThree[j].armazemInicial) &&
            this.parDest[k] == parseInt(rotasThree[j].armazemFinal)
          ) {
            bool = false;
          }
        }

        if (bool) {
          //console.log("Par I - J: " + parseInt(rotasThree[j].armazemInicial) + " - " + parseInt(rotasThree[j].armazemFinal));

          this.parOri.push(parseInt(rotasThree[j].armazemInicial));
          this.parDest.push(parseInt(rotasThree[j].armazemFinal));
          this.parOri.push(parseInt(rotasThree[j].armazemFinal));
          this.parDest.push(parseInt(rotasThree[j].armazemInicial));
        }
      }
    }

   
  }

  adicionarCeu() {
    let caminho_bk = 'assets/Ceu/mystic_bk.jpg';
    let caminho_dn = 'assets/Ceu/mystic_dn.jpg';
    let caminho_ft = 'assets/Ceu/mystic_ft.jpg';
    let caminho_lf = 'assets/Ceu/mystic_lf.jpg';
    let caminho_rt = 'assets/Ceu/mystic_rt.jpg';
    let caminho_up = 'assets/Ceu/mystic_up.jpg';

    let materialArray = [];
    let textura_bk = new THREE.TextureLoader().load(caminho_bk);
    let textura_dn = new THREE.TextureLoader().load(caminho_dn);
    let textura_ft = new THREE.TextureLoader().load(caminho_ft);
    let textura_lf = new THREE.TextureLoader().load(caminho_lf);
    let textura_rt = new THREE.TextureLoader().load(caminho_rt);
    let textura_up = new THREE.TextureLoader().load(caminho_up);

    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_ft }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_bk }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_up }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_dn }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_rt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: textura_lf }));

    for (let i = 0; i < 6; i++) {
      materialArray[i].side = THREE.BackSide;
    }

    let skyBoxGeo = new THREE.BoxGeometry(3000, 3000, 3000);
    let skyBox = new THREE.Mesh(skyBoxGeo, materialArray);
    this.scene.add(skyBox);
  }

  constructor(
    private armazemService: ArmazemService,
    private rotaService: RotaService,
    private percursoService: PercursoService,
    private entregaService: EntregaService
  ) {}

  ngOnInit(): void {
    this.buscarDatasPercursos();
  }

  ngAfterViewInit() {}

  loadRod() {
    
    var arm: Armazem[] = [];
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      arm = data;
      this.carregarArmazens(arm);

      var rotas: Rota[] = [];
      this.startRod();
      this.rotaService.getRotas().subscribe((data: Rota[]) => {
        rotas = data;
        console.log(rotas);
        console.log(arm);

        console.log('Z1');

        this.carregarAsNRotas(arm, rotas, 2);
        this.createScene();
        console.log('ZE');
        this.adicionarCeu();
        
        //console.log(this.camioes);
        this.startRenderingLoop();
        
      });
      
    });
  }

  loadAutomatico() {
    var arm: Armazem[] = [];
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      arm = data;
      this.carregarArmazens(arm);

      var rotas: Rota[] = [];
      this.rotaService.getRotas().subscribe((data: Rota[]) => {
        rotas = data;
        var date = this.dataPercurso;
        this.carregarRotasParaPercurso(date);
      });
    });
  }

  loadInterativo() {
    var arm: Armazem[] = [];
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      arm = data;
      this.carregarArmazens(arm);

      var rotas: Rota[] = [];
      this.startInt();
      this.rotaService.getRotas().subscribe((data: Rota[]) => {
        rotas = data;
        console.log(rotas);
        console.log(arm);

        console.log('Z1');
        
        this.carregarAsNRotas(arm, rotas, 1);
        this.createScene();
        console.log('ZE');
        this.adicionarCeu();
        
        //console.log(this.camioes);
        this.startRenderingLoop();
        this.movimentoInterativo();
        
      });
      
    });


  }

  carregarRotasParaPercurso(date: string) {
    this.percursoService
      .listarPercursosPorData(date)
      .subscribe(async (data: Percurso[]) => {
        //Fazer loop dos percursos para dia -->

        for (var i = 0; i < data.length; i++) {
          var percurso = data[i].percurso;
          var camiao = data[i].camiao;
          //console.log('Camiao para o Percurso: ' + camiao);
          percurso = '5,' + percurso + ',5';

          let arr: number[] = percurso.split(',').map((x) => parseInt(x));
          let nomes: string[] = [];

          for (let i = 0; i < arr.length - 1; i++) {
            this.parOri.push(arr[i]);
            this.parDest.push(arr[i + 1]);
            this.parOri.push(arr[i + 1]);
            this.parDest.push(arr[i]);
            var k = arr[i] - 1;
            var f = arr[i + 1] - 1;
            nomes.push(k + '/' + f);
            nomes.push(f + '/' + k);
            nomes.push(k + '-' + f);
            nomes.push(f + '-' + k);
          }
          this.percursos.push(arr);
          this.camioes.push(camiao);
        }

        this.createScene();
        this.adicionarCeu();
        //console.log(this.camioes);
        this.startRenderingLoop();
        // --> Carregar camioes e animacoes e cores de percursos
        var animacao: AnimacaoCamiao;

        var animacoes: AnimacaoCamiao[] = [];
        var camleng = this.camioes.length;
        // while(j<this.camioes.length) {
        //console.log('loop');
        for (var k = 0; k < camleng; k++) {
          ((k) => {
            this.createCamiaoGLTF(
              this.camioes[k],
              this.coordXArmazens[4],
              this.coordZArmazens[4],
              this.coordYArmazens[4],
              '',
              256,
              32,
              () => {
                //console.log(this.camioes);
                //console.log(k);
                var cam = this.camioes[k];
                //console.log(cam);
                var mesh = this.scene.getObjectByName(cam) as THREE.Mesh;
                //console.log('Camiao Mesh: ' + mesh);

                var automatic = new AutomaticMovement(
                  this.scene,
                  mesh,
                  this.percursos[k],
                  this.raioNoAnimacao
                );
                automatic.criarAnimacoes();
                //console.log('Camiao para o Percurso: ' + this.camioes[k]);
                animacao = new AnimacaoCamiao(
                  this.camioes[k],
                  automatic.posicoesArr,
                  automatic.rotacoesArr
                );
                animacoes.push(animacao);
              }
            );
          })(k);
        }

        this.startAut();

        let isAnimating = false;
        var button = document.getElementById('Animate');
        var interval: NodeJS.Timer;

        let intervals: NodeJS.Timer[] = [];

        button!.addEventListener('click', () => {
          // Toggle the animation state
          isAnimating = !isAnimating;

          /*const axis = new THREE.AxesHelper(25); // The size of the axis is set to 5
          this.scene.add(axis);*/

          // Update the button text
          button!.textContent = isAnimating
            ? 'Stop Animation'
            : 'Start Animation';

          // Stop all the intervals and reset the positions of the meshes
          animacoes.forEach((animacao, index) => {
            let mesh = this.scene.getObjectByName(
              animacao.camiao
            ) as THREE.Mesh;
            clearInterval(intervals[index]);
            mesh.rotation.x = animacao.rotacoes[0];
            mesh.rotation.y = animacao.rotacoes[1];
            mesh.rotation.z = animacao.rotacoes[2];
            mesh.position.x = animacao.posicoes[0];
            mesh.position.y = animacao.posicoes[1];
            mesh.position.z = animacao.posicoes[2];
          });

          // Start the animation loop
          if (isAnimating) {
            animacoes.forEach((animacao, index) => {
              let mesh = this.scene.getObjectByName(
                animacao.camiao
              ) as THREE.Mesh;
              let i = 0;
              intervals[index] = setInterval(() => {
                mesh.rotation.x = animacao.rotacoes[i];
                mesh.rotation.y = animacao.rotacoes[i + 1];
                mesh.rotation.z = animacao.rotacoes[i + 2];
                mesh.position.x = animacao.posicoes[i];
                mesh.position.y = animacao.posicoes[i + 1];
                mesh.position.z = animacao.posicoes[i + 2];
                i = (i + 3) % animacao.rotacoes.length; // Loop back to the beginning when we reach the end of the array
                // Stop the interval and reset the position when we reach the end of the array
                if (i === 0) {
                  clearInterval(intervals[index]);
                  mesh.rotation.x =
                    animacao.rotacoes[animacao.posicoes.length - 3];
                  mesh.rotation.y =
                    animacao.rotacoes[animacao.posicoes.length - 2];
                  mesh.rotation.z =
                    animacao.rotacoes[animacao.posicoes.length - 1];
                  mesh.position.x =
                    animacao.posicoes[animacao.posicoes.length - 3];
                  mesh.position.y =
                    animacao.posicoes[animacao.posicoes.length - 2];
                  mesh.position.z =
                    animacao.posicoes[animacao.posicoes.length - 1];
                }
              }, 100);
            });
          }
        });
      });
  }

  movimentoInterativo() {
    this.createCamiaoGLTF(
     "Camião",
      this.coordXArmazens[4],
      this.coordZArmazens[4],
      this.coordYArmazens[4],
      '',
      256,
      32,
      () => {
        var cam = "Camião";
        var mesh = this.scene.getObjectByName(cam) as THREE.Mesh;

        var automatic = new MovimentoInterativo(
          this.scene,
          mesh,
          this.nodesCirculos,
          this.elementosDeLigacao,
          this.rampas,
          this.inclinacoes
        );
      }
    );
  }

  //this.flagRodovia;
  //this.loadRod;
  //this.startRod
  changeFlagRod() {
    this.flagRodovia = !this.flagRodovia;
    this.loadRod();
  }

  changeFlagInt() {
    this.flagInter = !this.flagInter;
    this.loadInterativo();
  }
  changeFlagAut() {
    this.flagAutomatico = !this.flagAutomatico;
  }

  changeFlagAut2() {
    this.flagAutomatico2 = !this.flagAutomatico2;
  }

  startRod() {
    this.flagLoadingRod = !this.flagLoadingRod;
    this.flagStartRod = !this.flagStartRod;
  }

  startInt() {
    this.flagStartInt = !this.flagStartInt;
    this.flagLoadingInt = !this.flagLoadingInt;
  }

  startAut() {
    this.flagStartAut = !this.flagStartAut;
    this.flagLoadingAut = !this.flagLoadingAut;
  }

  buscarDatasPercursos() {
    this.percursoService.listarPercursos().subscribe((data) => {
      data.forEach((percurso) => {
        if (!this.datas.includes(percurso.dataPercurso)) {
          this.datas.push(percurso.dataPercurso);
        }
      });
    });
  }

  selecionarData() {
    const selectedValue = this.datasSelect.nativeElement.value;
    this.dataPercurso = selectedValue;
    this.changeFlagAut2();
    this.loadAutomatico();
  }
}
