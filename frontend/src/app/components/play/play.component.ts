import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { io, Socket } from "socket.io-client";
import * as THREE from 'three';
import { BoardType, GameType, PlayerType } from 'src/app/classes/types/types';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  /** Inputs */
  @Input() boards!: BoardType[];
  @Input() board!: BoardType;
  @Input() game!: GameType;

  /** Scenes Layer */
  private scene: THREE.Scene;
  private scene2: THREE.Scene;
  private scene3: THREE.Scene;

  /** Loaders */
  private loader: THREE.ObjectLoader;
  private gltfLoader: GLTFLoader;
  private fontLoader: FontLoader;
  private textureLoader: THREE.TextureLoader;

  /** Objects */
  private dices: THREE.Group[];

  /** Properties */
  private camera: any;
  private renderer: any;
  private light: THREE.AmbientLight;
  private basicMaterials: THREE.MeshBasicMaterial[];
  private planeGeometries: THREE.PlaneGeometry[];

  charactersQueue: PlayerType[];
  characters: PlayerType[];
  font: any;

  /** Transport Layer (Socket) */
  private socket: Socket;

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.socket;

    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();
    this.scene3 = new THREE.Scene();

    this.loader = new THREE.ObjectLoader();
    this.gltfLoader = new GLTFLoader();
    this.camera = new THREE.OrthographicCamera(-2, 1.5, 0.84, -1, 1, 2000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.autoClear = false;
    this.fontLoader = new FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.light = new THREE.AmbientLight(0xffffff, 1);
    this.scene2.add(this.light);
    this.basicMaterials = [];
    this.planeGeometries = [];
    this.dices = [];
    this.charactersQueue = [];
    this.characters = [];
    //this.setDefaultCameraPosition();
  }

  ngOnInit(): void {
    console.log(this.boards);
    console.log(this.board);
    console.log(this.game);
  }

}
