const _Blob = globalThis.Blob;
globalThis.Blob = undefined;
globalThis.Worker = globalThis.Worker ?? null;

const ffjavascript = require("../node_modules/.pnpm/ffjavascript@0.2.63/node_modules/ffjavascript");

globalThis.Blob = _Blob;

module.exports = ffjavascript;