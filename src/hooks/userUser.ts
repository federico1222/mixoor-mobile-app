import { useMutation, useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "../context";
import {
  fetchUserDetails,
  privateUserTransfers,
  sendFeedback,
} from "../services/user.service";
import {
  PaginatedTransfersResponse,
  SendFeedbackInput,
  UserDetails,
} from "../types/user";

export function useSendFeedback() {
  return useMutation({
    mutationFn: ({ feedback, wallet }: SendFeedbackInput) =>
      sendFeedback(feedback, wallet),
  });
}

export const useUserDetails = () => {
  const { address: walletAddress } = useMobileWallet();

  return useQuery<UserDetails | null>({
    queryKey: ["userDetails", walletAddress],
    queryFn: async (): Promise<UserDetails | null> => {
      if (!walletAddress) return null;

      try {
        const resp = await fetchUserDetails(walletAddress);

        if (!resp || !resp.data) {
          return null;
        }

        return resp.data as UserDetails;
      } catch (error) {
        console.error("Error fetching user details ->", error);
        return null;
      }
    },
    retry: 2,
    enabled: !!walletAddress,
  });
};

export const useUserPreviousTransfers = (
  limit: number = 10,
  offset: number = 0,
  sortOrder: "asc" | "desc" = "desc"
) => {
  const { address: selectedWalletAccount } = useMobileWallet();

  return useQuery({
    queryKey: ["userTransfers", limit, offset, sortOrder],
    queryFn: async (): Promise<PaginatedTransfersResponse> => {
      try {
        if (!selectedWalletAccount) {
          return {
            success: "no wallet connected",
            data: [],
            pagination: {
              total: 0,
              offset: 0,
              limit: limit,
              hasMore: false,
            },
          };
        }

        const resp = await privateUserTransfers(
          selectedWalletAccount,
          limit,
          offset,
          sortOrder
        );
        return resp;
      } catch (error) {
        console.log("error fetching previous user transactions ->", error);
        throw error;
      }
    },
    retry: 2,
    enabled: !!selectedWalletAccount,
  });
};
