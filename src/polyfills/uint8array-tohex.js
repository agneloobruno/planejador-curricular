// Polyfill para navegadores que ainda nao implementam Uint8Array.prototype.toHex.
if (
  typeof Uint8Array !== "undefined" &&
  typeof Uint8Array.prototype.toHex !== "function"
) {
  Object.defineProperty(Uint8Array.prototype, "toHex", {
    value: function toHex() {
      let out = "";
      for (let i = 0; i < this.length; i += 1) {
        out += this[i].toString(16).padStart(2, "0");
      }
      return out;
    },
    writable: true,
    configurable: true,
  });
}
