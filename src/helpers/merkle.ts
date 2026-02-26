/**
 * Pure-JS reimplementation of @smithii_io/mixoor's MerkleTree and
 * generateCommitment using poseidon-lite (no WASM / no circomlibjs).
 *
 * Outputs are byte-for-byte identical to the originals.
 */
import { poseidon2, poseidon4 } from "poseidon-lite";
import { getAddressEncoder } from "@solana/kit";
import type { Address } from "@solana/kit";

const SNARK_FIELD_SIZE = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

function toFieldElement(bytes: Uint8Array): bigint {
  let bigInt = 0n;
  for (let i = 0; i < bytes.length; i++) {
    bigInt = (bigInt << 8n) | BigInt(bytes[i]);
  }
  return bigInt % SNARK_FIELD_SIZE;
}

function bigIntToBytes(value: bigint): Uint8Array {
  const bytes = new Uint8Array(32);
  let temp = value;
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(temp & 0xffn);
    temp = temp >> 8n;
  }
  return bytes;
}

function uint8ArrayToBigInt(arr: Uint8Array): bigint {
  let result = 0n;
  for (let i = 0; i < arr.length; i++) {
    result = (result << 8n) | BigInt(arr[i]);
  }
  return result;
}

function hashNodes(left: Uint8Array, right: Uint8Array): Uint8Array {
  const l = uint8ArrayToBigInt(left) % SNARK_FIELD_SIZE;
  const r = uint8ArrayToBigInt(right) % SNARK_FIELD_SIZE;
  return bigIntToBytes(poseidon2([l, r]));
}

export class MerkleTreeLocal {
  private levels: number;
  private _leaves: Uint8Array[];
  private _zeros: Uint8Array[];

  constructor(levels: number) {
    this.levels = levels;
    this._leaves = [];
    this._zeros = new Array(levels + 1);

    // Build zero tree synchronously — no WASM needed
    this._zeros[0] = new Uint8Array(32);
    for (let i = 1; i <= levels; i++) {
      this._zeros[i] = hashNodes(this._zeros[i - 1], this._zeros[i - 1]);
    }
  }

  insert(leaf: Uint8Array) {
    this._leaves.push(leaf);
  }

  root(): Uint8Array {
    if (this._leaves.length === 0) {
      return this._zeros[this.levels];
    }
    let currentLevel = [...this._leaves];
    for (let level = 0; level < this.levels; level++) {
      const nextLevel: Uint8Array[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right =
          i + 1 < currentLevel.length ? currentLevel[i + 1] : this._zeros[level];
        nextLevel.push(hashNodes(left, right));
      }
      currentLevel = nextLevel;
    }
    return currentLevel[0];
  }
}

export function generateCommitmentLocal(
  secret: Uint8Array,
  nullifier: Uint8Array,
  amount: bigint,
  poolId: Address
): Uint8Array {
  const poolIdBytes = getAddressEncoder().encode(poolId);
  const secretField = toFieldElement(secret);
  const nullifierField = toFieldElement(nullifier);
  const amountField = amount;
  const poolIdField = toFieldElement(Uint8Array.from(poolIdBytes));

  const hashBigInt = poseidon4([secretField, nullifierField, amountField, poolIdField]);
  return bigIntToBytes(hashBigInt);
}
