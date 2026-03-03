// snarkjs shim for React Native / Hermes
//
// browser.esm.js imports ffjavascript which has top-level Blob usage.
// We route through our ffjavascript shim by temporarily patching globalThis.Blob.

const _Blob = globalThis.Blob;
globalThis.Blob = undefined;
globalThis.Worker = globalThis.Worker ?? null;

// "__real_snarkjs__" is a sentinel resolved by metro.config.js to the
// actual package path at config-load time, avoiding circular imports and
// hardcoded pnpm internal paths that differ between local dev and EAS builds.
module.exports = require("__real_snarkjs__");

globalThis.Blob = _Blob;