// ffjavascript shim for React Native / Hermes
//
// browser.esm.js runs top-level code that creates a Blob from a TextEncoder
// result — React Native's Blob doesn't support ArrayBufferView construction.
// We temporarily hide globalThis.Blob so it falls back to the btoa path,
// then restore it. Worker is set to null so single-thread mode is used.

const _Blob = globalThis.Blob;
globalThis.Blob = undefined;
globalThis.Worker = globalThis.Worker ?? null;

// "__real_ffjavascript__" is a sentinel resolved by metro.config.js to the
// actual package path at config-load time, avoiding circular imports and
// hardcoded pnpm internal paths that differ between local dev and EAS builds.
module.exports = require("__real_ffjavascript__");

globalThis.Blob = _Blob;