import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Socket } from 'socket.io-client';
import { Player } from '../player/player';
import { CardPrizeType, CardType, GameParameterType } from '../types/types';
import { Card } from '../card/card';
import { PlayerTurn } from '../player/player-turn';
import { Utils } from '../utils/utils';
import { AudioController } from '../audio/audio';
import { RequestService } from 'src/app/shared/request.service';

export class Game {
  private static game: Game;
  scene: THREE.Scene;
  scene2: THREE.Scene;
  scene3: THREE.Scene;
  loader: THREE.ObjectLoader;
  requestService!: RequestService;
  gltfLoader: GLTFLoader;
  camera: any;
  renderer: any;
  fontLoader: FontLoader;
  textureLoader: THREE.TextureLoader;
  light: THREE.AmbientLight;
  basicMaterials: THREE.MeshBasicMaterial[];
  planeGeometries: THREE.PlaneGeometry[];
  dices: THREE.Group[];
  charactersQueue: Player[];
  characters: Player[];
  font: any;
  public parameters!: GameParameterType;
  private socket!: Socket;

  /**
   * Constructeur de la classe
   */
  private constructor() {
    Game.game = this;
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
    this.setDefaultCameraPosition();
  }

  public getGameId(): number | undefined {
    return this.parameters.gameId;
  }

  /**
   * Setter socket
   * @param  {Socket} socket Socket de Socket IO
   * @returns void
   */
  public setSocket(socket: Socket): void {
    this.socket = socket;
  }

  /**
   * Configure les paramètres par défaut du jeu
   * @param  {string} playerId ID du joueur
   * @param  {string} gameId ID de la partie
   * @returns Promise<void>
   */
  private async setDefaultsParameters(playerId: string, gameId: string): Promise<void> {
    //this.parameters = { };
    this.parameters.players = [];
    this.parameters.cards = [];
    const game: Game = this;
    this.parameters.playerId = parseInt(playerId);
    this.parameters.gameId = parseInt(gameId);
    const cards = await this.requestService.getData("game/cards");
    if (cards) {
      cards.forEach((card: any) => {
        const Card_Type: CardType = {
          id: card.Card_Type.id,
          nom: card.Card_Type.nom
        }
        const purchasePrize: number[] = [];
        const taxAmount: number[] = [];
        card.Card_Purchase_Prizes.forEach((prize: any) => {
          purchasePrize.push(prize.cost)
        });
        card.Card_Tax_Amounts.forEach((tax: any) => {
          taxAmount.push(tax.cost)
        });
        const Card_Prize: CardPrizeType = {
          purchasePrize,
          taxAmount
        };
        if (game.parameters.cards)
          game.parameters.cards[card.id] = new Card(card.id, card.nom, Card_Type, Card_Prize, card.color);
      });
    }

    const gameData = await this.requestService.getData("game/" + gameId);
    if (gameData) {
      game.parameters.nbPlayers = gameData.Game_Setting.nbPlayers;
        game.parameters.timer = gameData.Game_Setting.timer;
        game.parameters.state = gameData.Game_Setting.GameStateId;
        game.parameters.playerTurn = new PlayerTurn(game, gameData.Game_Setting.playerTurn);
        let count = 1;
        gameData.Boards.forEach((board: any) => {
          const player: Player = new Player(game.requestService, game, count, board.id, board.money, board.Player.username, board.Position.numero);
          if (game.parameters.players) {
            game.parameters.players.push(player);
          }
          count++;
        });
        gameData.Cards.forEach((card: any) => {
          if (game.parameters.cards) {
            const Card: Card = game.parameters.cards[card.Card_Setting.id];
            Card.ownerId = card.PlayerId;
            Card.owner = game.getCharacterById(card.PlayerId);
            Card.level = card.level;
          }
        });
    }
  }

  public setRequestService(service: RequestService) {
    this.requestService = service;
  }

  /**
   * Getter singleton
   * @returns Game
   */
  public static getGame(): Game {
    if (!Game.game) {
      const game: Game = new Game();
      Game.game = game;
      return game;
    } else {
      return Game.game;
    }
  }

  /**
   * Paramètre la caméra de manière statique
   * @returns void
   */
  private setDefaultCameraPosition(): void {
    this.camera.position.x = 5.558;
    this.camera.position.y = 4.358;
    this.camera.position.z = 5.218;
    this.camera.rotation.x = -0.63425265017;
    this.camera.rotation.y = 0.66444684623;
    this.camera.rotation.z = 0.43109632524;
    this.camera.scale.x = 1.9000000000000004;
    this.camera.scale.y = 1.5675648795148092;
    this.camera.scale.z = 1.9000000000000001;
  }

  /**
   * Créer et ajoute à la partie les dés
   * @param  {THREE.Scene} scene Partie
   * @returns void
   */
  public createDice(scene: THREE.Scene): void {
    const that: Game = this;
    const dices = this.dices;
    this.gltfLoader.load('dice/scene.gltf', function (gltf) {
      const dice1 = gltf.scene;
      dice1.visible = false;
      dice1.scale.divideScalar(7);
      const dice2 = dice1.clone();
      dice2.position.x -= 0.3;
      dice1.userData['defaultPosition'] = dice1.position;
      dice2.userData['defaultPosition'] = dice2.position;
      dices.push(dice1);
      dices.push(dice2);
      scene.add(dice1);
      scene.add(dice2);
      that.checkPlayerTurn();
    }, undefined, function (error) {
      console.error(error);
    });
  }

  /**
   * Active le bouton lancer les dés si c'est au tour du joueur
   * TODO: Modifier nom de la méthode
   * @returns void
   */
  public checkPlayerTurn(): void {
    if (this.parameters.playerTurn && this.parameters.playerTurn.isMyTurn() && this.parameters.state === 1) {
      this.enableRollsButton();
    }
  }

  public async checkModalState(): Promise<void> {
    if (this.parameters.playerTurn && this.parameters.playerTurn.isMyTurn() && this.parameters.state === 2) {
      const numCard = await this.getCurrentParamPlayer()?.getNumCase();
      if (numCard) {
        this.manageModalCard(numCard)
      }
    }
  }

  public setGameState(state: number): void {
    this.parameters.state = state;
  }

  public getGameState(): number {
    return this.parameters.state ? this.parameters.state : -1;
  }

  /**
   * Récupère les informations du joueur
   * @returns PlayerType Informations
   */
  public getCurrentParamPlayer(): Player|null {
    if (!this.parameters.players) {
      return null;
    }
    const playerId = this.parameters.playerId;
    let currentParam: Player|null = null;
    let count: number = 0;
    while (!currentParam && count < this.parameters.players.length) {
      if (this.parameters.players[count].id === playerId) {
        currentParam = this.parameters.players[count];
      }
      count++;
    }
    return currentParam;
  }

  /**
   * Récupère le vecteur d'une face de dé passé en paramètre
   * TODO: Modifier nom de la méthode
   * @param  {number} face Face du dé (de 1 à 6)
   * @returns THREE.Vector3
   */
  private getCoordsByFace(face: number): THREE.Vector3 {
    let x: number;
    let y: number;
    let z: number;
    switch (face) {
      case 1:
        x = Utils.degrees_to_radians(-90);
        y = Utils.degrees_to_radians(90);
        z = Utils.degrees_to_radians(90);
        break;
      case 2:
        x = Utils.degrees_to_radians(90);
        y = Utils.degrees_to_radians(90);
        z = Utils.degrees_to_radians(0);
        break;
      case 3:
        x = Utils.degrees_to_radians(90);
        y = Utils.degrees_to_radians(0);
        z = Utils.degrees_to_radians(90);
        break;
      case 4:
        x = Utils.degrees_to_radians(-90);
        y = Utils.degrees_to_radians(0);
        z = Utils.degrees_to_radians(-90);
        break;
      case 5:
        x = Utils.degrees_to_radians(0);
        y = Utils.degrees_to_radians(90);
        z = Utils.degrees_to_radians(-90);
        break;
      default:
        x = Utils.degrees_to_radians(-90);
        y = Utils.degrees_to_radians(90);
        z = Utils.degrees_to_radians(-90);
    }
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Récupère l'objet correspondant du dé passé en paramètre
   * @param  {THREE.Group} dice Scène du dé
   * @returns THREE.Object3D Objet3D du dé
   */
  private getDiceObject(dice: THREE.Group): THREE.Object3D {
    return dice.children[0].children[0].children[0].children[0].children[0];
  }

  public async attachIcon(playerId: number) {
    const player: Player|null = this.getCharacterById(playerId);
    if (!player || !player.character) {
      return;
    }
    const planeGeometry: THREE.PlaneGeometry = this.getPlaneGeometry(0.1, 0.1);
    const material = new THREE.MeshBasicMaterial();
    const texture = await this.textureLoader.loadAsync("/images/game/money.png");
    material.map = texture;
    material.transparent = true;
    material.opacity = .8;
    const plane: any = new THREE.Mesh(planeGeometry, material);
    plane.rotateY(Utils.degrees_to_radians(45));
    const characterMesh: THREE.Mesh = player.character;
    plane.position.set(characterMesh.position.x, characterMesh.position.y - 0.1, characterMesh.position.z);
    plane.name = "attach-icon";
    this.scene3.add(plane);
    console.log(this.scene3)
  }

  /**
   * Affiche les dés
   * TODO: Modifier nom de la méthode
   * @returns void
   */
  public enableDices(): void {
    this.dices.forEach(dice => {
      dice.visible = true;
    });
  }

  /**
   * Cache les dés
   * TODO: Modifier nom de la méthode
   * @returns void
   */
  public disableDices(): void {
    this.dices.forEach(dice => {
      dice.visible = false;
    });
  }

  /**
   * Lance les dés
   * @param  {number} dice1 Face du dé numéro 1
   * @param  {number} dice2 Face du dé numéro 2
   * @param  {number} playerId ID du joueur à l'origine du lancé de dé
   * @param  {number} duration1 Duration de la transition du 1er jet
   * @param  {number} duration2 Face du dé numéro 2
   * @returns void
   */
  public rollDice(dice1: number, dice2: number, playerId: number, duration1: number, duration2: number): void {
    this.disableRollsButton();
    let numero: number = 0;
    let tweenPosition: any;
    let totalFace: number = 0;
    const that: Game = this;
    this.enableDices();
    this.dices.forEach(dice => {
      numero++;
      const diceObject = this.getDiceObject(dice);
      const defaultPosition: THREE.Vector3 = dice.userData['defaultPosition'];
      diceObject.position.set(defaultPosition.x + 3, defaultPosition.y - 5, defaultPosition.z + 3);
      diceObject.rotation.set(10, 10, 10);

      const face: number = (numero === 2) ? dice2 : dice1;
      totalFace += face;
      const coords: THREE.Vector3 = this.getCoordsByFace(face);
      // Rotation
      const rotationX: number = coords.x;
      const rotationY: number = coords.y;
      const rotationZ: number = coords.z;
      // Position
      const positionX: number = (numero === 2) ? defaultPosition.x - Math.floor(Math.random() * 11 + 3) : defaultPosition.x;
      const positionZ: number = (numero === 2) ? defaultPosition.z : defaultPosition.z - Math.floor(Math.random() * 11 + 3);
      const positionY: number = Math.floor(Math.random() * 3 + 3);
      const tweenRotation: TWEEN.Tween<THREE.Euler> = new TWEEN.Tween(diceObject.rotation)
        .to({ x: rotationX, y: rotationY, z: rotationZ }, 1050);
      const duration = (numero === 2) ? duration2 : duration1;
      tweenPosition = new TWEEN.Tween(diceObject.position)
        .to({ x: positionX, y: positionY, z: positionZ }, duration);
      tweenRotation.easing(TWEEN.Easing.Quadratic.Out);
      tweenPosition.easing(TWEEN.Easing.Quadratic.Out);
      tweenRotation.start();
      tweenPosition.start();
    });
    tweenPosition.onComplete(function () {
      const character: Player|null = that.getCharacterById(playerId);
      if (character) {
        character.moveTo(totalFace);
      }
    });
  }

  /**
   * Récupère un joueur en fonction de son ID
   * @param  {number} id ID du joueur à trouver
   * @returns Player|null Joueur trouvé, null si aucun joueur trouvé
   */
  public getCharacterById(id: number): Player | null {
    let character: Player|null = null;
    let index = 0;
    while (!character && index < this.characters.length) {
      if (this.characters[index] && this.characters[index].id === id) {
        character = this.characters[index];
      }
      index++;
    }
    return character;
  }

  /**
   * Instancie un objet de la classe PlaneGeometry en mode singleton
   * @param  {number} width Largeur de l'objet
   * @param  {number} height Hauteur de l'objet
   * @returns THREE.PlaneGeometry L'objet correspondant
   */
  private getPlaneGeometry(width: number, height: number): THREE.PlaneGeometry {
    let returnPlane: THREE.PlaneGeometry|null = null;
    let count = 0;
    while (count < this.planeGeometries.length && !returnPlane) {
      const geometry = this.planeGeometries[count];
      if (geometry.parameters.width === width && geometry.parameters.height === height) {
        returnPlane = geometry;
      }
      count++;
    }
    if (returnPlane) {
      return returnPlane;
    } else {
      returnPlane = new THREE.PlaneGeometry(width, height);
      this.planeGeometries.push(returnPlane);
      return returnPlane;
    }
  }

  /**
   * Instancie un objet de la classe MeshBasicMaterial avec la couleur correspondante
   * @param  {number} color? Couleur du matériel (Optionnel)
   * @returns THREE.MeshBasicMaterial Le matériel correspondant
   */
  private createMeshBasicMaterial(color?: number): THREE.MeshBasicMaterial {
    let material: THREE.MeshBasicMaterial;
    if (Utils.isset(color)) {
      material = new THREE.MeshBasicMaterial({ color: color });
    } else {
      material = new THREE.MeshBasicMaterial();
    }
    this.basicMaterials.push(material);
    return material;
  }

  /**
   * Instancie un objet de la classe MeshBasicMateriel avec la couleur correspondante en mode singleton
   * TODO: Modifier nom de la méthode
   * @param  {number} color? Couleur du matériel (Optionnel)
   * @returns THREE.MeshBasicMaterial Le matériel correspondant
   */
  private getBasicMaterial(color?: number): THREE.MeshBasicMaterial {
    let returnMesh: THREE.MeshBasicMaterial|null = null;
    if (!Utils.isset(color)) {
      color = 0x000000;
    }
    const ColorObject: THREE.Color = new THREE.Color(color);
    let count = 0;
    while (count < this.basicMaterials.length && !returnMesh) {
      const meshBasicMaterial = this.basicMaterials[count];
      if (meshBasicMaterial.color.r === ColorObject.r
        && meshBasicMaterial.color.g === ColorObject.g
        && meshBasicMaterial.color.b === ColorObject.b) {
        returnMesh = meshBasicMaterial;
      }
      count++;
    }
    if (returnMesh) {
      return returnMesh;
    } else {
      return this.createMeshBasicMaterial(color);
    }
  }

  /**
   * Créer et configure le texte d'une police de caractère
   * @param  {string} name Contenu du texte
   * @param  {string} cardName Nom de la carte
   * @param  {number} cardGroupName Nom du groupe correspondant à la carte
   * @param  {number} color Couleur du texte
   * @param  {number} size Taille du texte
   * @param  {boolean} bypass Désactive l'automatisation de la taille du texte par rapport à la longueur du texte (Défault à false)
   * @returns Promise<THREE.Mesh> La police correspondante
   */
  public async getTextFont(name: string, cardName: string, cardGroupName: string, color: number, size: number, bypass: boolean = false): Promise<THREE.Mesh> {
    if (!bypass) {
      if (name.length >= 8 && cardName != "MONUMENT") {
        size = 0.045 * name.length / 8;
      }
    }
    let height: number;
    if (cardName === "MONUMENT" || cardGroupName === "MONOPOLE_MONUMENT") {
      height = 0.002;
    } else {
      height = name.match(/^[0-9.]+[A-Z]{1}$/g) ? 0.037 : 0.03;
    }
    const geometry = new TextGeometry(name, {
      font: this.font,
      size: size,
      height: height,
    });
    const material = this.getBasicMaterial(color);
    const textMesh: any = new THREE.Mesh(geometry, material);
    textMesh.rotation.x = Utils.degrees_to_radians(-90);
    return textMesh;
  }

  /**
   * Retourne horizontalement une image
   * TODO: Modifier nom de la méthode
   * @param  {THREE.Mesh} Character Image
   * @returns void
   */
  public retourneCharacter(Character: THREE.Mesh<THREE.BufferGeometry, THREE.Material[]> | any): void {
    if (Character.material.map.center.x === 0) {
      Character.material.map.center.set(0.5, 0.5);
      Character.material.map.repeat.set(- 1, 1);
    } else {
      Character.material.map.center.set(0, 0);
      Character.material.map.repeat.set(1, 1);
    }
  }

  /**
   * Récupère le lien vers l'image d'un niveau de maison d'une équipe spécifique
   * @param  {number} level Niveau de la maison de 1 à 4
   * @param  {number} team Numéro correspondant à l'équipe
   * @returns string Lien absolu vers l'image
   */
  private getHouseImgSrc(level: number, team: number): string {
    return '/images/game/house' + level + '_' + team + '.png';
  }

  /**
   * Récupère le type d'un monopole en fonction de son niveau
   * @param  {number} level Niveau de la maison de 1 à 4
   * @returns string Nom du type
   */
  private getHouseTypeName(level: number): string {
    switch (level) {
      case 1:
        return 'Bourg';
      case 2:
        return 'Petite ville';
      case 3:
        return 'Grande ville';
      default:
        return 'Métropole';
    }
  }

  /**
   * TODO: Docblock à faire
   * TODO: À opti
   * @param  {number} level
   */
  public async setLevelModalPurchase(level: number) {
    // let numCase: number = parseInt($("#card-detail").attr('data-case'));
    // if (!numCase) {
    //   numCase = await this.getCurrentParamPlayer().getNumCase();
    // }
    // const card: Card = this.parameters.cards[numCase];
    // const remainingBalance = this.getCurrentParamPlayer().getMoney() - card.prize.purchasePrize[level - 1];
    // $("#card-detail .rent-content-wrapper").text(Utils.nFormatter(card.prize.taxAmount[level - 1]));
    // $("#card-detail .remaining-balance-wrapper").text(Utils.nFormatter(remainingBalance));
    // $("#card-detail .total-amount-wrapper").text(Utils.nFormatter(card.prize.purchasePrize[level - 1]));
  }

  /**
   * Gère la carte
   * @param  {number} numero Numéro de la carte
   * @param  {any} params Paramètres aditionnels
   * @returns Promise<void>
   */
  public manageModalCard(numero: number, params: any = null): void {
    if (!this.parameters.cards) {
      return;
    }
    const card: Card|undefined = this.parameters.cards[numero];
    this.disableRollsButton();
    if (card.isVille() || card.isMonument()) {
      this.openModalPurchase(numero);
    } else if (card.isChance()) {
      const numChanceCard: number = params.chance;
      this.openChanceCard(numChanceCard);
    } else {
      this.enableRollsButton();
    }
  }

  public async openChanceCard(numChanceCard: number): Promise<void> {
    // await $.get("/api/chances/" + numChanceCard, function (data) {
    //   if (data && data.id) {
    //     // const wrapper = $("#card-chance");
    //     // $("#bg-wrapper-dark").show();
    //     // const message = data.message;
    //     // $(wrapper).find(".name-content-wrapper").text('Carte chance');
    //     // $(wrapper).find(".content").append("<div class='w-100 text-center'><img src='" + data.logo_url + "'>"
    //     //   + "</div>" + message);
    //     // $(wrapper).show();
    //   }
    // });
  }

  /**
   * Ouvre le menu d'achat d'un emplacement
   * TODO: Contenu méthode à optimiser
   * TODO: Docblock à refaire
   * @param  {string} nom Nom de l'emplacement à acheter
   * @param  {number} defaultPrize Prix par défaut
   * @param  {number} type Type du bâtiment
   * @returns void
   */
  public openModalPurchase(numero: number): void {
    // if (!this.parameters.cards) {
    //   return;
    // }
    // const param = this.getCurrentParamPlayer();
    // const card: Card = this.parameters.cards[numero];
    // if (card.isVille()) {
    //   $("#card-detail .row.houses").html("");
    //   $("#card-detail .row.types").html("");
    //   for (let index = 1; index <= 4; index++) {
    //     const isDisabled: string = (this.getCurrentParamPlayer().getMoney() - card.prize.purchasePrize[index - 1] < 0) ? 'disabled' : '';
    //     const elementHTML: string = "<div class='col-3'><img src='"
    //       + this.getHouseImgSrc(index, this.getCurrentParamPlayer().team)
    //       + "' class='" + isDisabled + "'></div>";
    //     $("#card-detail .row.houses").append(elementHTML);
    //   }
    //   for (let index = 1; index <= 4; index++) {
    //     const isDisabled: string = (this.getCurrentParamPlayer().getMoney() - card.prize.purchasePrize[index - 1] < 0) ? 'disabled' : '';
    //     const isCheckedByDefault: string = (index === 1) ? ' checked ' : '';
    //     const elementHTML: string = "<div class='col-3 " + isDisabled + "'><label>"
    //       + "<input type='checkbox' " + isDisabled
    //       + isCheckedByDefault + "><span class='checkmark fa-solid'></span><span>"
    //       + this.getHouseTypeName(index)
    //       + "</span></label></div>";
    //     $("#card-detail .row.types").append(elementHTML);
    //   }
    //   $("#card-detail .name-content-wrapper").text(card.getNom());
    //   $("#card-detail .rent-content-wrapper").text(Utils.nFormatter(card.prize.taxAmount[0]));
    //   $("#card-detail .remaining-balance-wrapper").text(Utils.nFormatter(this.getCurrentParamPlayer().getMoney() - card.prize.purchasePrize[0]));
    //   $("#card-detail .total-amount-wrapper").text(Utils.nFormatter(card.prize.purchasePrize[0]));

    //   $("#card-detail #bg-wrapper-dark").show();
    //   $("#card-detail").attr('data-case', numero);
    //   $("#card-detail").show();
    //   $("#bg-wrapper-dark").show();
    // } else {
    //   // Achat d'un monument
    //   $("#card-detail .row.houses").html("");
    //   $("#card-detail .row.types").html("");
    //   $("#card-detail .row.houses").append("<div class='monument-illustration monument-" + card.getPosition() + "'></div>");
    //   $("#card-detail .row.types").append("<p class='text-left' style='text-transform: none'><em>"
    //     + "La taxe de la case augmente proportionnellement en fonction du nombre de monument possédé"
    //     + "</em></p>");

    //   $("#card-detail .name-content-wrapper").text(card.getNom());
    //   $("#card-detail .rent-content-wrapper").text(Utils.nFormatter(card.prize.taxAmount[0]));
    //   $("#card-detail .remaining-balance-wrapper").text(Utils.nFormatter(this.getCurrentParamPlayer().getMoney() - card.prize.purchasePrize[0]));
    //   $("#card-detail .total-amount-wrapper").text(Utils.nFormatter(card.prize.purchasePrize[0]));

    //   $("#card-detail #bg-wrapper-dark").show();
    //   $("#card-detail").attr('data-case', numero);
    //   $("#card-detail").show();
    //   $("#bg-wrapper-dark").show();
    // }
  }

  /**
   * Créer et charge l'avatar des différents joueurs
   * @returns void
   */
  private loadCharacters(): void {
    const game: Game = this;
    this.parameters.players?.forEach((player: Player) => {
      // Consider player is by default at position 1, so we need to remove
      // 1 from position to move player to position
      this.teleportCharacter(player, player.position - 1);
    });
  }

  /**
   * Génère et configure les différentes images
   * TODO: Modifier nom de la méthode
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @returns Promise<void>
   */
  private async configCardAssets(plateau: THREE.Object3D<THREE.Event>): Promise<void> {
    const listeImages: any[] = plateau.children[7].children;
    await Promise.all(listeImages.map(async (Mesh) => {
      const Card = await this.generateCardAsset(Mesh, Mesh.userData.isRotateNeeds);
      plateau.children[7].add(Card);
    }));
  }

  /**
   * Attribue un prix à une case
   * @param  {THREE.Object3D<THREE.Event>} Mesh Carte rattaché à la case
   * @param  {number} prize Prix à attribuer
   * @param  {number} color Couleur du texte
   * @returns Promise<void>
   */
  private async setPrizeCard(Mesh: THREE.Object3D<THREE.Event>, prize: number, color: number): Promise<void> {
    const isRotateNeeds: boolean = (Utils.isset(Mesh.userData)) ? Mesh.userData['isRotateNeeds'] : false;
    const MeshObject = await this.generateText(Utils.nFormatter(prize).toUpperCase(), Mesh, isRotateNeeds, color, 0.075);
    MeshObject.name = "PRIZE_" + Mesh.name;
    if (isRotateNeeds) {
      MeshObject.position.z += 0.05;
    } else {
      MeshObject.position.z -= 0.05;
    }
    if (Mesh.parent && Mesh.parent.name === "MONOPOLE_MONUMENT") {
      const prizeMonument = this.scene2.getObjectByName("PRIZE_MONUMENT");
      if (prizeMonument) {
        prizeMonument.add(MeshObject);
      } else {
        const group: THREE.Group = new THREE.Group();
        group.name = "PRIZE_MONUMENT";
        group.add(MeshObject);
        this.scene2.add(group);
      }
    } else {
      Mesh.parent?.add(MeshObject);
    }
  }

  /**
   * Configure les images des monopoles (maisons)
   * TODO: Doc à refaire
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @returns Promise<void>
   */
  private async configCardMonopoleAssets(plateau: THREE.Object3D<THREE.Event>): Promise<void> {
    let listCards: THREE.Mesh<THREE.BufferGeometry>[] = [];
    for (const Mesh of plateau.children[0].children[8].children) {
      const card = await this.generateCardAsset(Mesh, Mesh.userData['isRotateNeeds']);
      listCards.push(card);
    }
    listCards.forEach(Mesh => {
      plateau.children[0].children[8].add(Mesh);
    });
  }

  /**
   * Récupère la carte d'un monument en fonction de son nom
   * @param  {string} cardName Nom de la carte
   * @returns THREE.Object3D<THREE.Event>|null La carte ou null
   */
  private getMonumentByCardName(cardName: string): THREE.Object3D<THREE.Event> | null {
    let Mesh: THREE.Object3D<THREE.Event>|null = null;
    let countCustomScene = 0;
    const prizeMonument = this.scene2.getObjectByName("PRIZE_MONUMENT");
    if (!prizeMonument) {
      return null;
    }
    while (!Mesh && countCustomScene < prizeMonument.children.length) {
      const currentMesh = prizeMonument.children[countCustomScene];
      if (currentMesh.name && currentMesh.name === cardName) {
        Mesh = currentMesh;
      }
      countCustomScene++;
    }
    return Mesh;
  }

  /**
   * Récupère la carte d'un monopole en fonction de son nom
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {string} cardName Nom de la carte
   * @returns THREE.Object3D<THREE.Event> La carte ou null
   */
  private getMonopoleByCardName(plateau: THREE.Object3D<THREE.Event>, cardName: string): THREE.Object3D<THREE.Event> | null {
    let Mesh: THREE.Object3D<THREE.Event>|null = null;
    let countMonopoles = 0;
    while (!Mesh && countMonopoles < plateau.children[0].children.length) {
      let countMesh = 0;
      while (!Mesh && countMesh < plateau.children[0].children[countMonopoles].children.length) {
        const currentMesh = plateau.children[0].children[countMonopoles].children[countMesh];
        if (currentMesh.name && currentMesh.name === cardName) {
          Mesh = currentMesh;
        }
        countMesh++;
      }
      countMonopoles++;
    }
    return Mesh;
  }

  /**
   * Vérifie si le numéro de carte correspond à un monument
   * TODO: Nom de méthode à revoir
   * @param  {number} numCard Numéro de la carte
   * @returns boolean Vrai ou faux
   */
  private isMonument(numCard: number): boolean {
    return (numCard === 5 || numCard === 13 || numCard === 19 || numCard === 28);
  }

  /**
   * Vérifie si un prix est déjà attribué à une carte
   * TODO: Méthode à revoir (nom, contenu, opti, boolean au retour)
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de la carte
   * @returns THREE.Object3D<THREE.Event> La carte
   */
  private verifAlreadyPrizeSet(plateau: THREE.Object3D<THREE.Event>, numCard: number): THREE.Object3D<THREE.Event>|null {
    if (this.isMonument(numCard)) {
      const VerifyCardIfExist = this.getMonumentByCardName("PRIZE_" + numCard.toString());
      return VerifyCardIfExist;
    } else {
      const VerifyCardIfExist = this.getMonopoleByCardName(plateau, "PRIZE_" + numCard.toString());
      return VerifyCardIfExist;
    }
  }
  /**
   * Supprime le prix d'une carte
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de la carte
   * @returns Promise<void>
   */
  private async removePrizeCard(plateau: THREE.Object3D<THREE.Event>, numCard: number): Promise<void> {
    const VerifyCardIfExist = this.verifAlreadyPrizeSet(plateau, numCard);
    if (VerifyCardIfExist) {
      VerifyCardIfExist.removeFromParent();
    }
  }

  /**
   * Affiche le prix d'une carte
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de carte
   * @param  {number} prize Prix à afficher
   * @returns Promise<void>
   */
  private async writePrizeCard(plateau: THREE.Object3D<THREE.Event>, numCard: number, prize: number): Promise<void> {
    await this.removePrizeCard(plateau, numCard);
    const Mesh = this.getMonopoleByCardName(plateau, numCard.toString());
    if (Mesh && this.parameters.cards) {
      await this.setPrizeCard(Mesh, prize, this.parameters.cards[numCard].color);
    }
  }

  /**
   * Vérifie si une maison est déjà positionné sur une carte
   * TODO: Méthode à revoir (nom, contenu, opti, boolean au retour)
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de la carte à vérifier
   * @returns THREE.Object3D<THREE.Event>
   */
  private verifAlreadyHouseSet(plateau: THREE.Object3D<THREE.Event>, numCard: number): THREE.Object3D<THREE.Event>|null {
    const VerifyCardIfExist = this.getMonopoleByCardName(plateau, "HOUSE_" + numCard.toString());
    return VerifyCardIfExist;
  }

  /**
   * Supprime la maison d'une carte
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de la carte
   * @returns Promise<void>
   */
  private async removeHouse(plateau: THREE.Object3D<THREE.Event>, numCard: number): Promise<void> {
    const VerifyCardIfExist = this.verifAlreadyHouseSet(plateau, numCard);
    if (VerifyCardIfExist) {
      VerifyCardIfExist.removeFromParent();
    }
  }

  /**
   * Positionne une maison sur une carte
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @param  {number} numCard Numéro de la carte
   * @param  {number} color Couleur de l'équipe de la maison
   * @param  {number} level Niveau de la carte à attribuer
   * @returns Promise<void>
   */
  private async setHouseLevel(plateau: THREE.Object3D<THREE.Event>, numCard: number, color: number, level: number): Promise<void> {
    this.removeHouse(plateau, numCard);
    const Mesh: THREE.Object3D<THREE.Event>|null = this.getMonopoleByCardName(plateau, numCard.toString());
    if (Mesh) {
      const card = await this.generateHouse(Mesh, Mesh.userData['isRotateNeeds'], color, level);
      card.name = "HOUSE_" + numCard;
      Mesh.parent?.add(card);
    }
  }

  /**
   * TODO: À faire
   * @param  {number} level
   * @return void
   */
  public async tryBuyCurrentHouse(level: number) {
    // TO DO : Condition- If player turn
    if (this.parameters.playerTurn && this.parameters.playerTurn.isMyTurn()) {
      // TO DO : Condition- If place is not owned
      const pId = this.parameters.playerId ? this.parameters.playerId : -1;
      const currentPlayer: Player|null = this.getCharacterById(pId);
      if (!currentPlayer || !this.parameters.cards ) {
        return;
      }
      const numCase: number = await currentPlayer.getNumCase();
      const currentCard: Card = this.parameters.cards[numCase];
      if (Utils.isset(numCase) && !currentCard.isOwned()) {
        level = (currentCard.isMonument()) ? 1 : level;
        if (level) {
          console.log("ok")
          // TO DO : Condition- If player has enough money
          if (currentCard.prize && currentPlayer.getMoney() - currentCard.prize.purchasePrize[level - 1] >= 0) {
            this.socket.emit('try_purchase_card', { level: level });
          }
        }
      }
    }
  }

  /**
   * Configure le nom de chaque carte
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @return Promise<void>
   */
  private async setUpCardNames(plateau: THREE.Object3D<THREE.Event>): Promise<void> {
    let indice: number = 0;
    for (let index = 1; index <= 4; index++) {
      const isRotateNeeds = (index % 2) ? false : true;
      const liste: any[] = (index > 2) ? plateau.children[index].children.reverse() : plateau.children[index].children;
      liste.forEach(Mesh => {
        if (Mesh.name !== "CHANCE_LOGO") {
          let title = this.getCardTitleByIndex(indice);
          const color = (Mesh.name === "MONUMENT" ? 0x000000 : 0xb8b8b8);
          this.generateText(title, Mesh, isRotateNeeds, color, 0.055, true).then((Object) => {
            let MeshObject = Object[0];
            let OutlineMeshObject = Object[1];
            if (Mesh.name === "MONUMENT") {
              this.scene2.children[0].children[index].add(MeshObject);
              this.scene2.children[0].children[index].add(OutlineMeshObject);
            } else {
              plateau.children[index].add(MeshObject);
            }
          });
          indice++;
        }
      });
    }
  }

  /**
   * Place les cartes possédés en jeu
   * @param  {THREE.Object3D<THREE.Event>} plateau Plateau de jeu
   * @returns Promise<void>
   */
  public async managePurchasedCards(plateau: THREE.Object3D<THREE.Event>): Promise<void> {
    if (!this.parameters.cards) {
      return;
    }
    for (const card of this.parameters.cards) {
      if (card && card.isOwned()) {
        await this.purchaseCard(plateau, card);
      }
    }
  }

  private async purchaseCard(plateau: THREE.Object3D<THREE.Event>, card: Card) {
    if (!card.owner || !card.level || !card.prize) {
      return;
    }
    await this.setHouseLevel(plateau, card.getPosition(), card.owner.team, card.level);
    await this.writePrizeCard(plateau, card.getPosition(), card.prize.taxAmount[card.level - 1]);
  }

  private async verifOpenModals() {
    if (this.parameters.playerTurn && this.parameters.playerTurn.isMyTurn() && this.parameters.state === 2) {
      const param = this.getCurrentParamPlayer();
      if (!param) {
        return;
      }
      const numCase = await param.getNumCase();
      this.manageModalCard(numCase, null)
    }
  }

  /**
   * Configure le plateau en plaçant les données du plateau au bon endroit (images, textes, etc)
   * @param  {string} playerId ID du joueur
   * @param  {string} gameId ID de la partie
   * @returns Promise<void>
   */
  public async configGame(playerId: string, gameId: string): Promise<void> {
    this.font = await this.loadAsyncFont('assets/Roboto_Black_Regular.json');
    const plateau: THREE.Object3D<THREE.Event> = await this.loadAsyncModel('assets/plateau.json');
    await this.setDefaultsParameters(playerId, gameId);
    this.setUpCardNames(plateau);
    await this.configCardAssets(plateau);
    await this.configCardMonopoleAssets(plateau);
    await this.managePurchasedCards(plateau);
    const liste: any[] = plateau.children[5].children;
    liste.forEach(Mesh => {
      this.generateAngleText(Mesh.name, Mesh, true).then((Object) => {
        this.scene2.add(Object[0])
        this.scene2.add(Object[1]);
        this.scene2.add(Object[2]);
      });
    });
    this.loadCharacters();
    this.processCharacters();
    this.createDice(this.scene2);
    await this.verifOpenModals();
  }

  /**
   * Retourne le numéro de la case où se trouve un joueur
   * @param  {THREE.Mesh} Character Joueur
   * @returns number Numéro de la case
   */
  public getCharacterNumCase(Character: THREE.Mesh): number {
    return parseInt(Character.userData['numCase']);
  }

  /**
   * Vérifie si le joueur se trouve sur une case à l'ouest
   * @param  {THREE.Mesh} Character Joueur
   * @returns boolean True si le joueur s'y trouve, sinon False
   */
  public isCharacterPositionInWest(Character: THREE.Mesh): boolean {
    const numCase: number = this.getCharacterNumCase(Character);
    return numCase >= 9 && numCase <= 16;
  }

  /**
   * Vérifie si le joueur se trouve sur une case au nord
   * @param  {THREE.Mesh} Character Joueur
   * @returns boolean True si le joueur s'y trouve, sinon False
   */
  public isCharacterPositionInNorth(Character: THREE.Mesh): boolean {
    const numCase: number = this.getCharacterNumCase(Character);
    return numCase >= 17 && numCase <= 24;
  }

  /**
   * Vérifie si le joueur se trouve sur une case à l'est
   * @param  {THREE.Mesh} Character Joueur
   * @returns boolean True si le joueur s'y trouve, sinon False
   */
  public isCharacterPositionInEst(Character: THREE.Mesh): boolean {
    const numCase: number = this.getCharacterNumCase(Character);
    return numCase >= 25;
  }

  /**
   * Récupère les nouvelles coordonées d'un joueur se déplacant d'une case à l'ouest
   * @param  {THREE.Mesh} Character Joueur
   * @return THREE.Vector3 Coordonées
   */
  private moveCharacterInWest(Character: THREE.Mesh): THREE.Vector3 {
    let positionZ: number = Character.position.z;
    if (Character.userData['numCase'] === 9) {
      positionZ -= 0.50;
    } else if (Character.userData['numCase'] === 16) {
      positionZ -= 0.45;
    } else {
      positionZ -= 0.385;
    }
    Character.userData['numCase']++;
    return new THREE.Vector3(Character.position.x, Character.position.y, positionZ);
  }

  /**
   * Récupère les nouvelles coordonées d'un joueur se déplacant d'une case au nord
   * @param  {THREE.Mesh} Character Joueur
   * @return THREE.Vector3 Coordonées
   */
  private moveCharacterInNorth(Character: THREE.Mesh): THREE.Vector3 {
    let positionX: number = Character.position.x;
    if (Character.userData['numCase'] === 17) {
      positionX += 0.43;
    } else if (Character.userData['numCase'] === 24) {
      positionX += 0.50;
      this.retourneCharacter(Character);
    } else {
      positionX += 0.385;
    }
    Character.userData['numCase']++;
    return new THREE.Vector3(positionX, Character.position.y, Character.position.z);
  }

  /**
   * Récupère les nouvelles coordonées d'un joueur se déplacant d'une case à l'est
   * @param  {THREE.Mesh} Character Joueur
   * @return THREE.Vector3 Coordonées
   */
  private moveCharacterInEst(Character: THREE.Mesh | any): THREE.Vector3 {
    let positionZ: number = Character.position.z;
    let positionX: number = Character.position.x;
    if (Character.userData.numCase === 25) {
      positionZ += 0.43;
    } else if (Character.userData.numCase === 32) {
      positionX = 1.55;
      positionZ = 1.65;
      Character.userData.numCase = 0;
    } else {
      positionZ += 0.385;
    }
    Character.userData.numCase++;
    return new THREE.Vector3(positionX, Character.position.y, positionZ);
  }

  /**
   * Récupère les nouvelles coordonées d'un joueur se déplacant d'une case au sud
   * @param  {THREE.Mesh} Character Joueur
   * @return THREE.Vector3 Coordonées
   */
  private moveCharacterInSouth(Character: THREE.Mesh | any): THREE.Vector3 {
    let positionX: number = Character.position.x;
    if (Character.userData.numCase === 1) {
      positionX -= 0.55;
    } else if (Character.userData.numCase === 8) {
      positionX -= 0.43;
      this.retourneCharacter(Character);
    } else {
      positionX -= 0.385;
    }
    Character.userData.numCase++;
    return new THREE.Vector3(positionX, Character.position.y, Character.position.z);
  }

  /**
   * Récupère les coordonées après le déplacement d'une case d'un joueur
   * @param  {THREE.Mesh} Character Joueur
   * @returns THREE.Vector3 Coordonées
   */
  private getCharacterVectorNextPosition(Character: THREE.Mesh): THREE.Vector3 {
    let vector3: THREE.Vector3;
    if (this.isCharacterPositionInWest(Character)) {
      vector3 = this.moveCharacterInWest(Character);
    } else if (this.isCharacterPositionInNorth(Character)) {
      vector3 = this.moveCharacterInNorth(Character);
    } else if (this.isCharacterPositionInEst(Character)) {
      vector3 = this.moveCharacterInEst(Character);
    } else {
      vector3 = this.moveCharacterInSouth(Character);
    }
    return vector3;
  }

  /**
   * Téléporte un joueur en lui ajoutant un nombre de case
   * TODO: Doc à refaire
   * @param  {THREE.Mesh} Character Joueur
   * @param  {number} numCase Nombre de case à ajouter à la position du joueur
   * @returns void
   */
  public teleportCharacter(player: Player, numCase: number): void {
    const character: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | undefined = player.character;
    if (!character) {
      return;
    }
    for (let index = 1; index <= numCase; index++) {
      const vector3: THREE.Vector3 = this.getCharacterVectorNextPosition(character);
      character.position.set(vector3.x, vector3.y, vector3.z);
    }
    this.disableDices();
  }

  public setPlayerBuyState(player: Player) {
    //$("#player > div[data-id=" + player.id + "]").find('.player-state-wrapper').text("Considère l'achat ...");
  }

  public removeBuyState() {
    //$("#player > div").find('.player-state-wrapper').text("");
  }

  /**
   * Déplace un joueur d'un nombre de case avec une animation
   * TODO: Doc à refaire
   * @param  {THREE.Mesh} Character Joueur
   * @param  {number} nbCases Nombre de case à déplacer
   * @returns Promise<void>
   */
  public async moveCharacterBy(player: Player, nbCases: number): Promise<void> {
    const character: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | undefined = player.character;
    if (!character) {
      return;
    }
    const that = this;
    const vector3: THREE.Vector3 = this.getCharacterVectorNextPosition(character);
    const Tween = new TWEEN.Tween(character.position)
      .to({ x: vector3.x, y: vector3.y + .1, z: vector3.z }, 225)
    Tween.start();
    Tween.easing(TWEEN.Easing.Quintic.InOut);
    Tween.onComplete(function () {
      const Tween = new TWEEN.Tween(character.position)
        .to({ x: vector3.x, y: vector3.y, z: vector3.z }, 225);
      Tween.start();
      Tween.easing(TWEEN.Easing.Quintic.InOut);
      Tween.onComplete(function () {
        if (nbCases > 1) {
          nbCases--;
          that.moveCharacterBy(player, nbCases);
        } else {
          that.disableDices();
          if (that.parameters.playerTurn.isMyTurn()) {
            that.socket.emit('game_end_move');
          }
          that.parameters.playerTurn.getPlayerTurn().getNumCase().then((numCase) => {
            if ([1, 2].includes(that.parameters.cards[numCase].getType().id)) {
              that.setPlayerBuyState(player);
              that.playCashRegister();
            }
          });
        }
      });
    });
  }

  public playCashRegister(): void {
    AudioController.play('CashRegister.mp3');
  }

  public async setCardOwner(numCard: number, level: number, playerId: number): Promise<void> {
    console.log("set card olwner")
    if (numCard && level && playerId) {
      const card = this.parameters.cards[numCard];
      card.level = level;
      card.ownerId = playerId;
      card.owner = this.getCharacterById(playerId);
      await this.purchaseCard(this.scene.children[0], this.parameters.cards[numCard])
    }
  }

  /**
   * Affiche le bouton de jet de dés
   * @returns void
   */
  public enableRollsButton(): void {
    //$("#roll-btn").show();
  }

  /**
   * Cache le bouton de jet de dés
   * @returns void
   */
  public disableRollsButton(): void {
    //$("#roll-btn").hide();
  }

  /**
   * Retourne un joueur positionné sur la case de départ du jeu
   * @param  {number} team Numéro de l'équipe
   * @returns THREE.Mesh Objet correspondant au joueur
   */
  public createMeshCharacter(team: number): THREE.Mesh {
    const texture = this.textureLoader.load("/images/characters/1_" + team + ".png");
    const geometry = this.getPlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial();
    material.map = texture;
    material.transparent = true;
    material.opacity = .6;
    const plane: any = new THREE.Mesh(geometry, material);
    plane.position.y = 0.5;
    plane.rotation.y = Utils.degrees_to_radians(45);
    plane.position.x = 1.55;
    plane.position.z = 1.65;
    plane.userData.numCase = 1;
    return plane;
  }

  /**
   * Ajoute un joueur dans la partie ou dans la file d'attente si la partie n'est pas encore chargée
   * @param  {Player} character
   * @returns void
   */
  public addCharacter(character: Player): void {
    if (this.scene3.children[0] && character.character) {
      this.scene3.children[0].add(character.character);
      this.characters.push(character);
    } else {
      this.charactersQueue.push(character);
    }
  }

  /**
   * Traite la file d'attente des joueurs en attente d'être chargé dans la partie
   * @returns void
   */
  private processCharacters(): void {
    this.charactersQueue.forEach(character => {
      if (!character.character) {
        return;
      }
      this.scene3.children[0].add(character.character);
      this.characters.push(character);
    });
    this.charactersQueue = [];
  }

  /**
   * Retourne la texture correspondante à son nom
   * @param  {string} name Nom de la texture
   * @returns Promise<THREE.Texture> Texture correspondante
   */
  public async getTextureByMeshName(name: string): Promise<THREE.Texture> {
    switch (name) {
      case "28":
        return this.textureLoader.loadAsync("/images/game/tower.png");
      case "19":
        return this.textureLoader.loadAsync("/images/game/louvre.png");
      case "13":
        return this.textureLoader.loadAsync("/images/game/park.png");
      case "CHANCE":
        return this.textureLoader.loadAsync("/images/game/chance3D.png");
      case "TAX":
        return this.textureLoader.loadAsync("/images/game/tax3D.png");
      case "CORNER_BG START":
        return this.textureLoader.loadAsync("/images/game/corner.png");
      case "CORNER_BG CDM":
        return this.textureLoader.loadAsync("/images/game/cdm.png");
      case "CORNER_BG ISLAND":
        return this.textureLoader.loadAsync("/images/game/playa.png");
      case "CORNER_BG AVION":
        return this.textureLoader.loadAsync("/images/game/airport.png");
      default:
        return this.textureLoader.loadAsync("/images/game/orsay.png");
    }
  }

  /**
   * Génère l'image correspondante à une carte
   * @param  {THREE.Mesh | THREE.Object3D<THREE.Event>} Mesh Mesh correspondante
   * @param  {boolean} isRotateNeeds Si la carte est à l'ouest ou à l'est
   * @returns Promise<THREE.Mesh> La mesh configuré à la bonne position avec l'image
   */
  public async generateCardAsset(Mesh: THREE.Mesh | THREE.Object3D<THREE.Event>, isRotateNeeds: boolean): Promise<THREE.Mesh> {
    const texture = await this.getTextureByMeshName(Mesh.name);
    const isCorner = Mesh.name.includes("CORNER_BG");
    const dimension = (isCorner) ? 0.8 : 0.62;
    const geometry = this.getPlaneGeometry(dimension, dimension);
    const material = new THREE.MeshBasicMaterial();
    if (isRotateNeeds) {
      texture.center.set(0.5, 0.5);
      texture.repeat.set(- 1, 1);
    }
    material.map = texture;
    material.transparent = true;
    const plane: THREE.Mesh | any = new THREE.Mesh(geometry, material);
    if (isRotateNeeds) {
      const position_y = Mesh.position.y + 0.25;
      const position_x = Mesh.position.x + 0.095;
      const position_z = Mesh.position.z + 0.26;
      const rotation_y = Utils.degrees_to_radians(45);
      plane.position.set(position_x, position_y, position_z);
      plane.rotation.y = rotation_y;
    } else {
      if (isCorner) {
        const position_y = Mesh.position.y + 0.4;
        const position_x = Mesh.position.x + 0.29;
        const position_z = Mesh.position.z + 0.3;
        const rotation_y = Utils.degrees_to_radians(45);
        plane.position.set(position_x, position_y, position_z);
        plane.rotation.y = rotation_y;
      } else {
        const position_y = Mesh.position.y + 0.21;
        const position_x = Mesh.position.x + 0.21;
        const position_z = Mesh.position.z + 0.063;
        const rotation_y = Utils.degrees_to_radians(45) - 0.05;
        plane.position.set(position_x, position_y, position_z);
        plane.rotation.y = rotation_y;
      }
    }
    return plane;
  }

  /**
   * Génère une maison sur une case
   * @param  {THREE.Mesh | THREE.Object3D<THREE.Event>} Mesh Case cible
   * @param  {boolean} isRotateNeeds Si la carte est à l'ouest ou à l'est
   * @returns Promise<THREE.Mesh> La maison générée
   */
  public async generateHouse(Mesh: THREE.Mesh | THREE.Object3D<THREE.Event>, isRotateNeeds: boolean, color: number, level: number): Promise<THREE.Mesh> {
    const count = Utils.getRandomInt(1, 5);
    const texture = await this.textureLoader.loadAsync("/images/game/house" + level + "_" + color + ".png");
    const geometry = this.getPlaneGeometry(0.4, 0.4);
    const material = new THREE.MeshBasicMaterial();
    if (isRotateNeeds) {
      texture.center.set(0.5, 0.5);
      texture.repeat.set(- 1, 1);
    }
    material.map = texture;
    material.transparent = true;
    material.alphaTest = 0.1;
    const plane: THREE.Mesh | any = new THREE.Mesh(geometry, material);
    plane.position.y = Mesh.position.y + 0.2
    plane.position.x = Mesh.position.x + 0.150;
    if (isRotateNeeds) {
      plane.position.z = Mesh.position.z + 0.185;
      plane.rotation.y = Utils.degrees_to_radians(135);
    } else {
      plane.position.z = Mesh.position.z - 0.185;
      plane.rotation.y = Utils.degrees_to_radians(45);
    }
    return plane;
  }

  /**
   * Génère le texte d'une case dans un angle
   * @param  {string} title Texte à afficher
   * @param  {THREE.Mesh} Mesh Case cible
   * @param  {boolean} outline Si un contour est requis (false par défaut)
   * @returns Si outline = false : Promise<[texte: Mesh]> , sinon Promise<[texte: Mesh, texteOutline1: Mesh, texteOutline2: Mesh]>
   */
  public async generateAngleText(title: string, Mesh: THREE.Mesh | any, outline: boolean = false): Promise<any> {
    const color = 0xf05176;
    const size = 0.06;
    const MeshObject: THREE.Mesh | any = await this.getTextFont(title, Mesh.name, Mesh.parent.name, color, size, true);
    MeshObject.rotation.x = 0;
    MeshObject.rotation.y = Utils.degrees_to_radians(45);
    MeshObject.renderOrder = 5;
    switch (Mesh.name) {
      case "ILE PERDU":
        MeshObject.position.x = Mesh.position.x - 0.17;
        MeshObject.position.z = Mesh.position.z + 0.11;
        MeshObject.position.y += 0.175;
        break;
      case "AEROPORT":
        MeshObject.position.x = Mesh.position.x - 0.17;
        MeshObject.position.z = Mesh.position.z + 0.11;
        MeshObject.position.y += 0.175;
        break;
      default:
        MeshObject.position.x = Mesh.position.x - 0.15;
        MeshObject.position.z = Mesh.position.z + 0.11;
        MeshObject.position.y += 0.225;
        break;
    }
    if (outline) {
      const OutlineMeshObject: THREE.Mesh | any = await this.getTextFont(title, Mesh.name, Mesh.parent.name, 0x7d1930, size, true);
      const OutlineMeshObject2: THREE.Mesh | any = await this.getTextFont(title, Mesh.name, Mesh.parent.name, 0x0000000, size, true);
      OutlineMeshObject.scale.set(MeshObject.scale.x, MeshObject.scale.y, MeshObject.scale.z);
      OutlineMeshObject.position.set(MeshObject.position.x, MeshObject.position.y + 0.0002, MeshObject.position.z);
      OutlineMeshObject.rotation.set(MeshObject.rotation.x, MeshObject.rotation.y, MeshObject.rotation.z);
      OutlineMeshObject2.scale.set(MeshObject.scale.x, MeshObject.scale.y, MeshObject.scale.z);
      OutlineMeshObject2.position.set(MeshObject.position.x, MeshObject.position.y - 0.009, MeshObject.position.z);
      OutlineMeshObject2.rotation.set(MeshObject.rotation.x, MeshObject.rotation.y, MeshObject.rotation.z);
      return [MeshObject, OutlineMeshObject, OutlineMeshObject2];
    } else {
      return MeshObject;
    }
  }

  /**
   * Génère le texte d'une case (hors case dans un angle)
   * @param  {string} title Texte à afficher
   * @param  {THREE.Mesh|any} Mesh Case cible
   * @param  {boolean} isRotateNeeds Si la carte est à l'ouest ou à l'est
   * @param  {number} color Couleur du texte
   * @param  {number} size Taille du texte
   * @param  {boolean} outline Si un contour est requis (false par défaut)
   * @returns Si outline = false : Promise<[texte: Mesh]>, sinon Promise<[texte: Mesh, texteOutline: Mesh]>
   */
  public async generateText(title: string, Mesh: THREE.Mesh | any, isRotateNeeds: boolean, color: number, size: number, outline: boolean = false): Promise<any> {
    const MeshObject: THREE.Mesh | any = await this.getTextFont(title, Mesh.name, Mesh.parent.name, color, size, false);
    MeshObject.position.y = Mesh.position.y;
    if (isRotateNeeds) {
      MeshObject.rotation.z = Utils.degrees_to_radians(-180);
      MeshObject.position.x = Mesh.position.x + title.length * (size * 0.118 / 0.055) / 5;
      MeshObject.position.z = Mesh.position.z - 0.09;
      if (Mesh.name === "MONUMENT") {
        MeshObject.position.x = Mesh.position.x + 0.08;
        MeshObject.position.z += 0.15;
      } else if (title.length >= 8) {
        MeshObject.position.x = Mesh.position.x + title.length * 0.166 / 8;
      } else if (Mesh.parent.name === "MONOPOLE_MONUMENT") {
        MeshObject.rotation.z = Utils.degrees_to_radians(90);
        MeshObject.position.x = Mesh.position.x;
        MeshObject.position.z = Mesh.position.z + (title.length * 0.042 / 4);
      } else if (title === "TAXE") {
        MeshObject.position.z -= 0.12;
      }
    } else {
      MeshObject.position.x = Mesh.position.x - title.length * (size * 0.118 / 0.055) / 5;
      MeshObject.position.z = Mesh.position.z + 0.09;
      if (Mesh.name === "MONUMENT") {
        MeshObject.position.x = Mesh.position.x - 0.2;
        MeshObject.position.z -= 0.15;
      } else if (title.length >= 8) {
        MeshObject.position.x = Mesh.position.x - title.length * 0.120 / 5;
      } else if (Mesh.parent.name === "MONOPOLE_MONUMENT") {
        MeshObject.position.x = Mesh.position.x - (title.length * 0.165 / 4);
        MeshObject.position.z = Mesh.position.z + 0.05;
      }
    }
    if (outline) {
      const OutlineMeshObject: THREE.Mesh | any = await this.getTextFont(title, Mesh.name, Mesh.parent.name, 0xffffff, size);
      OutlineMeshObject.scale.set(MeshObject.scale.x, MeshObject.scale.y, MeshObject.scale.z);
      OutlineMeshObject.position.set(MeshObject.position.x, MeshObject.position.y - 0.005, MeshObject.position.z);
      OutlineMeshObject.rotation.set(MeshObject.rotation.x, MeshObject.rotation.y, MeshObject.rotation.z);
      return [MeshObject, OutlineMeshObject];
    } else {
      return MeshObject;
    }
  }

  /**
   * Effectue le rendu du jeu
   * @returns void
   */
  public animate(): void {
    TWEEN.update();
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene2, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene3, this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Charge de manière asynchrone un modèle et le retourne
   * @param  {string} model Chemin vers le model
   * @returns Promise<THREE.Object3D | THREE.Mesh | THREE.LOD | THREE.Line | THREE.Points | THREE.Sprite> Modèle
   */
  public async loadAsyncModel(model: string): Promise<THREE.Object3D | THREE.Mesh | THREE.LOD | THREE.Line | THREE.Points | THREE.Sprite> {
    let obj = await this.loader.loadAsync(model);
    obj.children[1].children[3].rotation.y = Utils.degrees_to_radians(180);
    obj.children[3].children[6].rotation.y = Utils.degrees_to_radians(180);
    this.scene2.add(obj.clone(false));
    this.scene2.children[0].add(obj.children[0].clone(false));
    this.scene2.children[0].add(obj.children[1].clone(false));
    this.scene2.children[0].add(obj.children[2].clone(false));
    this.scene2.children[0].add(obj.children[3].clone(false));
    this.scene2.children[0].add(obj.children[4].clone(false));
    this.scene3.add(obj.clone(false));
    this.scene.add(obj);
    return obj;
  }

  /**
   * Charge de manière asynchrone une police d'écriture
   * @param  {string} url Chemin vers la police
   * @returns Promise<Font> Police d'écriture
   */
  public async loadAsyncFont(url: string): Promise<any> {
    let fontObj = await this.fontLoader.loadAsync(url);
    return fontObj;
  }

  /**
   * Retourne le nom d'une carte par rapport à un numéro
   * TODO: À refaire
   * @param  {number} index Numéro de la carte
   * @returns string Nom de la carte
   */
  public getCardTitleByIndex(index: number): string {
    const liste = [
      "Paris",
      "Taxe",
      "Marseille",
      "",
      " Tour\nEiffel",
      "Lyon",
      "Nice",
      "Nantes",
      "Lille",
      "Rennes",
      "",
      "Reims",
      "     Le\nLouvre",
      "Toulon",
      "Dijon",
      "Angers",
      "",
      "Disney\n land",
      "Nîmes",
      "Brest",
      "Tours",
      "Nancy",
      "Roubaix",
      "Cannes",
      " Musée\nd'orsay",
      "Lorient",
      "Arles",
      "Bastia",
    ];
    return liste[liste.length - 1 - index].toUpperCase();
  }
}
