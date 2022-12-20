export abstract class AudioController {

  private static audioRepertory: string = '/audio/';

  public static play(trackName: string): void {
      const music = new Audio(this.audioRepertory + trackName);
      music.play();
  }

}
