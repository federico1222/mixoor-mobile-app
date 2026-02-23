export type CreateUserPayload = {
  username: string;
  address: string;
  profilePic: string;
};

export type SendFeedbackInput = {
  feedback: string;
  wallet?: string;
};

export interface UserDetails {
  address: string;
  avatarUri: string;
  createdAt: string;
  username: string;
}

export type PaginatedTransfersResponse = {
  success: string;
  data: PreviousPrivateTransferLogs[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};

export type PreviousPrivateTransferLogs = {
  depositId: string;
  uiAmount: number;
  txSignature: string;
  createdAt: Date;
  poolAddress: string;
  mintAddress: string;
  assetType: "Sol" | "SplToken";
  recipientAddress?: string;
  errorRecipientAddress?: string;
  errorReason?: string;
  isErrorResolved?: boolean;
  // FIX: this was removed
  multiRecipients?: [
    {
      uiAmount: number;
      destination: string;
    }
  ];
  tokenMetadata?: {
    symbol?: string;
    name?: string;
    image?: string;
    decimals?: number;
  };
};

export type UserDeposits = {
  id: number;
  createdAt: string;
  uiAmount: number | string;
  poolAddress: string;
  mintAddress: string;
  isSpent: boolean;
  assetType: "Sol" | "SplToken";
  txSignature?: string; // this is the deposit tx signature
  tokenMetadata?: {
    symbol?: string;
    name?: string;
    image?: string;
    decimals?: number;
  };
};
