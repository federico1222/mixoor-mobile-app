const _Blob = globalThis.Blob;
globalThis.Blob = undefined;
globalThis.Worker = globalThis.Worker ?? null;

const snarkjs = require("../node_modules/.pnpm/snarkjs@0.7.6/node_modules/snarkjs");

globalThis.Blob = _Blob;

module.exports = snarkjs;