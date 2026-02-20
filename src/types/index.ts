export type TransferType = "direct" | "delayed";

export type TransferInput = {
  uiAmount: string;
  address: string;
  resolvedAddress?: string;
};

export type DepositPayload = Omit<
  TransferPayload,
  "recipient" | "transferType"
>;

export type TransferPayload = {
  // the user sending the tx
  userAddress: string;
  mint: string;
  amount: string; // bigint as string, scaled to token amount
  decimals: number; //
  tokenProgram: string; //
  txSignature: string; // confirm tx didn't error out
  transferType?: TransferType; // use to retry if transfer failed

  // Secrets (never stored, only used in-memory)
  secret: string; // base64
  nullifier: string; // base64
  commitment: string; // base64 (for finding in tree)

  // Withdrawal destination
  recipient: string;
  // NOTE: if sending to multiple recipients, recipient should be relayer address
  multiRecipients?: MultiRecipient[];
};

export type MultiRecipient = {
  destination: string;
  amount: string;
  // Secrets (never stored, only used in-memory 🤡)
  secret: string; // base64
  nullifier: string; // base64
  commitment: string; // base64 (for finding in tree)

  /** @label deposit transaction signature */
  txSignature: string; // confirm tx didn't error out during deposit
};
