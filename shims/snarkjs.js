// snarkjs shim for React Native / Hermes
//
// browser.esm.js imports ffjavascript which has top-level Blob usage.
// We route through our ffjavascript shim by temporarily patching globalThis.Blob.

const _Blob = globalThis.Blob;
globalThis.Blob = undefined;
globalThis.Worker = globalThis.Worker ?? null;

module.exports = require("../node_modules/snarkjs/build/browser.esm.js");

globalThis.Blob = _Blob;
