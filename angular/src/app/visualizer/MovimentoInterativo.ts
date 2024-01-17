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
import { BoxGeometry, CircleGeometry, Mesh, Object3D, Scene } from 'three';
import { animate } from '@angular/animations';
  
export class MovimentoInterativo {
    public K_CIRCULO: number = 4.5;
    public K_LIGACAO: number = 2.0;
    public Wi: number = 4.0; //lARGURA DOS ARCOS, ELEMENTOS DE LIGACAO
    ALTURA_PERSONAGEM: number = 7;
    public K_BERMA: number = 0.25

    
    private keyStates = {left: false, right: false, backward: false, forward: false};
    
    private walkingSpeed = 1;
    private turningSpeed = 10;
    private direction = 0;
    private defaultDirection = -89.7;
    

    private camiao: Mesh;
    private scene: Scene;
    private nodesCirculos: Mesh[] = [];
    private elementosDeLigacao: Mesh[] = [];
    private rampas: Mesh[] = [];
    private inclinacoes: number[] = [];

    constructor(private cena: Scene, private camião: Mesh, private circulo: Mesh[], private ligacao: Mesh[], private rampa: Mesh[], orientacao: number[]) {
        
        // Register the event handler to be called on key press
        document.addEventListener("keydown", event => this.keyChange(event, true));
        // Register the event handler to be called on key release
        document.addEventListener("keyup", event => this.keyChange(event, false));

        this.camiao = camião;

        this.camiao.position.x = 35.4049131987439;
        this.camiao.position.y = 34.375;
        this.camiao.position.z = 8.365822203286768;

        this.scene = cena;
        this.nodesCirculos = circulo;
        this.elementosDeLigacao = ligacao;
        this.rampas = rampa;
        this.inclinacoes = orientacao;

        console.log(this.nodesCirculos);
        console.log(this.elementosDeLigacao);
        console.log(this.rampas);

        const axis = new THREE.AxesHelper(25); // The size of the axis is set to 25
        this.scene.add(axis);

    }
  
    
    keyChange(event: any, state: any) {
        
        let directionIncrement = this.turningSpeed;
        let directionDeg = this.direction;
        const directionRad = THREE.MathUtils.degToRad(directionDeg);

        if (document.activeElement == document.body) { 
          if (event.code == "KeyA") {
            this.keyStates.left = state;
            //console.log("left");
            
            directionDeg += directionIncrement;
            this.direction = directionDeg;
            //console.log("this.direction = ",this.direction);
            this.camiao.rotation.y = directionRad - this.defaultDirection;
            
            //console.log("this.camiao.rotation.y = ",this.camiao.rotation.y);

          }
          
          else if (event.code == "KeyD") {
              this.keyStates.right = state;
              //console.log("right");

              directionDeg -= directionIncrement;
              this.direction = directionDeg;
              //console.log("this.direction = ",this.direction);

              this.camiao.rotation.y = directionRad - this.defaultDirection;
              //console.log("this.camiao.rotation.y = ",this.camiao.rotation.y);
          }
          
          else if (event.code == "KeyS") {
              this.keyStates.backward = state;
              //console.log("backward");

              let newPositionX = this.camiao.position.x + this.walkingSpeed * Math.sin(directionRad);
              let newPositionZ = this.camiao.position.z + this.walkingSpeed * Math.cos(directionRad);

              if(this.checarSePertenceAoCirculo(newPositionX,this.camiao.position.y,newPositionZ)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              } else if (this.checarSePertenceAElementoDeLigacao(this.camiao.position.x,this.camiao.position.y,this.camiao.position.z)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              } else if (this.checarSePertenceARampa(this.camiao.position.x,this.camiao.position.y,this.camiao.position.z)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              }

    
          }
          
          else if (event.code == "KeyW") {
              this.keyStates.forward = state;
              //console.log("forward");

              let newPositionX = this.camiao.position.x - this.walkingSpeed * Math.sin(directionRad);
              let newPositionZ = this.camiao.position.z - this.walkingSpeed * Math.cos(directionRad);

              if(this.checarSePertenceAoCirculo(newPositionX,this.camiao.position.y,newPositionZ)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              } else if (this.checarSePertenceAElementoDeLigacao(this.camiao.position.x,this.camiao.position.y,this.camiao.position.z)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              } else if (this.checarSePertenceARampa(this.camiao.position.x,this.camiao.position.y,this.camiao.position.z)) {
                this.camiao.position.x = newPositionX;
                this.camiao.position.z = newPositionZ;
              }

          }

          
        } 
    }

    checarSePertenceAoCirculo(x: number,y: number,z: number) {

        for(let i = 0; i < this.nodesCirculos.length; i++) {
    
            // (x'P -xi)2 +(y'P -yi)2 ≤ri2.
            if ( Math.pow((this.K_CIRCULO * this.Wi)/2,2) >= Math.pow(this.nodesCirculos[i].position.z - z, 2) + Math.pow(this.nodesCirculos[i].position.x - x,2) ) {
                // zP = zi + ALTURA_PERSONAGEM / 2.0.
                this.camiao.position.y = this.nodesCirculos[i].position.y + this.ALTURA_PERSONAGEM/2;
                console.log("CIRCLE");
                return true;
            }   
            
        }
        return false;
        
    }

    checarSePertenceAElementoDeLigacao(x: number,y: number,z: number) {

        for(let i = 0; i < this.elementosDeLigacao.length; i++) {            
            // x''P = (x'P - xi) * cos(αij) + (y'P - yi) * sin(αij);
            let x2p = 
                (this.camiao.position.z - this.elementosDeLigacao[i].position.z) * Math.cos(this.elementosDeLigacao[i].rotation.z) +
                (this.camiao.position.x - this.elementosDeLigacao[i].position.x) * Math.sin(this.elementosDeLigacao[i].rotation.z);

            // y''P = (y'P - yi) * cos(αij) - (x'P - xi) * sin(αij).
            let y2p = 
                (this.camiao.position.x - this.elementosDeLigacao[i].position.x) * Math.cos(this.elementosDeLigacao[i].rotation.z) -
                (this.camiao.position.z - this.elementosDeLigacao[i].position.z) * Math.sin(this.elementosDeLigacao[i].rotation.z);
            
            // console.log(" newX = ",newZ <= 18, " newZ = ", 0 <= newZ, " -(this.elementosDeLigacao[i].scale.x/2) <= newX = ", -(this.elementosDeLigacao[i].scale.x/2) <= newX, " newX <= (this.elementosDeLigacao[i].scale.x/2) = ", newX <= (this.elementosDeLigacao[i].scale.x/2));
            // console.log("i = ", i, " x = ",this.elementosDeLigacao[i].position.x," y = ", this.elementosDeLigacao[i].position.y, " z = ", this.elementosDeLigacao[i].position.z);
            // console.log(" x = ",x," y = ", y, " z = ", z);

            //if ((this.elementosDeLigacao[i].position.z - 1 <= z && z <= this.elementosDeLigacao[i].position.z + 1) && (this.elementosDeLigacao[i].position.x - 1 <= x && x <= this.elementosDeLigacao[i].position.x + 1)) {
            if ((this.elementosDeLigacao[i].position.z == z  && this.elementosDeLigacao[i].position.x == x)) {
                this.camiao.position.z = x2p;
                this.camiao.position.x = y2p;
                // console.log("ELEM LIG");
                return true;

            }

            // 0.0≤x''P ≤si;
            // si = K_LIGACAO * ri e ri = K_CIRCULO * wi / 2.0
            // -wij /2.0≤y''P ≤wij /2.0.
            if ((0 <= x2p) && (x2p <= this.K_LIGACAO * ((this.K_CIRCULO * this.Wi) / 2.0)) && 
                    (-this.Wi/2 <= y2p) && (y2p <= this.Wi/2)) {
                // zP = zi + ALTURA_PERSONAGEM / 2.0.
                this.camiao.position.y = this.elementosDeLigacao[i].position.y + this.ALTURA_PERSONAGEM/2;
                //console.log("ELEM LIG 2");
                return true;
            }
            
        }

        return false;
        
    }

    checarSePertenceARampa(x: number,y: number,z: number) {


        for(let i = 0; i < this.rampas.length; i++) {            
            // x''P = (x'P - xi) * cos(αij) + (y'P - yi) * sin(αij);
            let x2p = 
                (this.camiao.position.z - this.rampas[i].position.z) * Math.cos(this.rampas[i].rotation.z) +
                (this.camiao.position.x - this.rampas[i].position.x) * Math.sin(this.rampas[i].rotation.z);

            // y''P = (y'P - yi) * cos(αij) - (x'P - xi) * sin(αij).
            let y2p = 
                (this.camiao.position.x - this.rampas[i].position.x) * Math.cos(this.rampas[i].rotation.z) -
                (this.camiao.position.z - this.rampas[i].position.z) * Math.sin(this.rampas[i].rotation.z);
            

            // if ((this.rampas[i].position.z - 1 <= z && z <= this.rampas[i].position.z + 1) && (this.rampas[i].position.x - 1 <= x && x <= this.rampas[i].position.x + 1)) {
            if ((this.rampas[i].position.z == z  && this.rampas[i].position.x == x)) {
                this.camiao.rotation.z = this.inclinacoes[i];
                this.camiao.position.z = x2p;
                this.camiao.position.x = y2p;
                //console.log("RAMPA");
                return true;

            }

            // 0.0≤x''P ≤si;
            // si = K_LIGACAO * ri e ri = K_CIRCULO * wi / 2.0
            // -wij /2.0≤y''P ≤wij /2.0.
            if ((0 <= x2p) && (x2p <= this.K_LIGACAO * ((this.K_CIRCULO * this.Wi) / 2.0)) && 
                    (-this.Wi/2 <= y2p) && (y2p <= this.Wi/2)) {
                this.camiao.rotation.z = this.inclinacoes[i];
                // zP = zi + ALTURA_PERSONAGEM / 2.0.
                this.camiao.position.y = this.rampas[i].position.y + this.ALTURA_PERSONAGEM/2;
                //console.log("RAMPA 2");
                return true;
            }
            
        }

        return false;
        
    }
}