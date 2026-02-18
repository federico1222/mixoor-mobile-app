import type { Address, Instruction } from "@solana/kit";
import { AccountRole, address } from "@solana/kit";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

// Kit → Legacy conversions
export function toLegacyPublicKey(addr: Address): PublicKey {
  return new PublicKey(addr);
}

export function toLegacyInstruction(
  instruction: Instruction
): TransactionInstruction {
  return new TransactionInstruction({
    keys:
      instruction.accounts?.map((acc) => ({
        pubkey: toLegacyPublicKey(acc.address),
        isSigner:
          acc.role === AccountRole.READONLY_SIGNER ||
          acc.role === AccountRole.WRITABLE_SIGNER,
        isWritable:
          acc.role === AccountRole.WRITABLE ||
          acc.role === AccountRole.WRITABLE_SIGNER,
      })) ?? [],
    programId: toLegacyPublicKey(instruction.programAddress),
    data: Buffer.from(instruction.data ?? new Uint8Array()),
  });
}

// Legacy → Kit conversions
export function fromLegacyPublicKey(pubkey: PublicKey): Address {
  return address(pubkey.toBase58());
}
