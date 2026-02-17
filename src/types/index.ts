export type TransferType = "direct" | "delayed";

export type TransferInput = {
  uiAmount: string;
  address: string;
  resolvedAddress?: string;
};
