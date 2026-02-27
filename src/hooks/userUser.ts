import { useMutation, useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import {
  fetchUserDeposits,
  fetchUserDetails,
  privateUserTransfers,
  sendFeedback,
} from "../services/user.service";
import {
  PaginatedTransfersResponse,
  SendFeedbackInput,
  UserDeposits,
  UserDetails,
} from "../types/user";

export function useSendFeedback() {
  return useMutation({
    mutationFn: ({ feedback, wallet }: SendFeedbackInput) =>
      sendFeedback(feedback, wallet),
  });
}

export const useUserDetails = () => {
  const { account } = useMobileWallet();

  return useQuery<UserDetails | null>({
    queryKey: ["userDetails", account?.address],
    queryFn: async (): Promise<UserDetails | null> => {
      if (!account?.address) return null;

      try {
        const resp = await fetchUserDetails(account?.address);

        if (!resp || !resp.data) {
          return null;
        }

        return resp.data as UserDetails;
      } catch (error) {
        console.log("Error fetching user details ->", error);
        return null;
      }
    },
    retry: 2,
    enabled: !!account?.address,
  });
};

export const useUserPreviousTransfers = (
  limit: number = 10,
  offset: number = 0,
  sortOrder: "asc" | "desc" = "desc"
) => {
  const { account } = useMobileWallet();

  return useQuery({
    queryKey: ["userTransfers", limit, offset, sortOrder],
    queryFn: async (): Promise<PaginatedTransfersResponse> => {
      try {
        if (!account?.address) {
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
          account?.address,
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
    enabled: !!account?.address,
  });
};

export const useUserDeposits = () => {
  const { account } = useMobileWallet();

  return useQuery({
    queryKey: ["userDeposits", account?.address],
    queryFn: async (): Promise<UserDeposits[]> => {
      try {
        if (!account?.address) return [];

        const resp = await fetchUserDeposits(account?.address);

        return resp?.data ?? [];
      } catch (error) {
        console.log("error fetching unspent user deposits ->", error);
        return [];
      }
    },
    retry: 2,
    enabled: !!account?.address,
  });
};
