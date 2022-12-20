export abstract class Utils {
  /**
   * Convertis un degré en radian
   * @param  {number} degrees Degré à convertir
   * @returns number Radian correspondant
   */
  static degrees_to_radians(degrees: number): number {
      return degrees * (Math.PI / 180);
  }

  /**
   * Retourne un entier aléatoire dans une plage de nombre
   * @param  {number} min Nombre minimale
   * @param  {number} max Nombre maximale
   * @returns number Entier aléatoire
   */
  static getRandomInt(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  }

  static nFormatter(num: number) {
      const lookup = [
          { value: 1, symbol: "" },
          { value: 1e3, symbol: "k" },
          { value: 1e6, symbol: "M" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function(item) {
          return num >= item.value;
      });
      return item ? (num / item.value).toFixed(10).replace(rx, "$1") + item.symbol : "0";
  }

  static sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isset(obj: any): boolean {
      return typeof obj !== 'undefined';
  }

}
