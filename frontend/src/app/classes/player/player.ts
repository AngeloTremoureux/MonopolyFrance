import { GameComponent } from "src/app/components/game/game.component";
import { Utils } from "../utils/utils";

export class Player {
  public boardId: number;
  private money: number;
  public username: string;
  public position: number;
  public team: number;
  public isEliminated: boolean;
  public isMyTurn: boolean;

  private game: GameComponent;
  public character: THREE.Mesh | undefined;
  private manageQueueState: boolean;
  private moveQueue: number[];

  constructor(game: GameComponent, team: number, boardId: number, money: number, username: string, position: number, isMyTurn: boolean) {
      this.boardId = boardId;
      this.money = money;
      this.username = username;
      this.position = position;
      this.team = team;
      this.isMyTurn = isMyTurn;
      this.game = game;
      this.createCharacters(team);
      this.manageQueueState = false;
      this.moveQueue = [];
      this.isEliminated = false;
  }

  /**
   * Ajoute un joueur à la partie
   * @returns void
   */
  private createCharacters(team: number): void {
      const character = this.game.createMeshCharacter(team);
      this.character = character;
      this.game.addCharacter(this);
  }

  // public getHTMLCard(): JQuery<HTMLElement> {
  //     return $("#player").find("div[data-id='" + this.id + "']");
  // }

  public getMoney(): number {
      return this.money;
  }

  public setMoney(value: number) {
      // const moneyHTML: JQuery<HTMLElement> = $(this.getHTMLCard()).find('span[data-money]');
      // const currentMoney: number = parseInt(moneyHTML.attr('data-money'));
      // this.money = value;
      // this.game.playCashRegister();
      // this.animateValue(moneyHTML, currentMoney, value, 1000);
  }

  // private animateValue(moneyHTML: JQuery<HTMLElement>, start: number, end: number, duration: number) {
  //     // let startTimestamp: any = null;
  //     // const step = (timestamp: any) => {
  //     //     if (!startTimestamp) startTimestamp = timestamp;
  //     //     const progress = Math.min((timestamp - startTimestamp) / duration, 1);
  //     //     const tempMoney = Math.floor(progress * (end - start) + start);
  //     //     $(moneyHTML).text(tempMoney.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,'));
  //     //     if (progress < 1) {
  //     //         window.requestAnimationFrame(step);
  //     //     }
  //     // };
  //     // window.requestAnimationFrame(step);
  //     // $(moneyHTML).attr('data-money', end);
  //     // $(moneyHTML).text(end.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,'));
  // }

  private async updateNumCase(): Promise<void> {
      // const character: Player = this;
      // const data = await this.request.getData("game/" + this.game.getGameId() + "/player/" + this.id + "/position");
      // if (data && data.numero && character.character) {
      //   character.character.userData["numCase"] = data.numero;
      // }
  }

  public async getNumCase(): Promise<number> {
      await this.updateNumCase();
      return this.character?.userData["numCase"];
  }

  /**
   * Déplace le joueur d'un nombre de case avec l'animation
   * @param  {number} nbCases Nombre de cases à déplacer
   * @returns void
   */
  public async moveTo(nbCases: number): Promise<void> {
      const Game = this.game;
      if (Game.scene3.children[0]) {
          this.moveQueue.push(nbCases);
          this.manageMovementQueue();
      }
  }

  private async manageMovementQueue(): Promise<void> {
      if (!this.manageQueueState) {
          this.manageQueueState = true;
          await Utils.sleep(50);
          if (this.moveQueue.length === 1) {
              this.game.moveCharacterBy(this, this.moveQueue[0])
          } else if (this.moveQueue.length > 1) {
              const sumCases = this.calcSumNbCase();
              this.game.teleportCharacter(this, sumCases % 32)
          }
          this.moveQueue = [];
          this.manageQueueState = false;
      }
  }

  private calcSumNbCase(): number {
      let sum = 0;
      this.moveQueue.forEach(nbCase => {
          sum += nbCase;
      });
      return sum;
  }
}
