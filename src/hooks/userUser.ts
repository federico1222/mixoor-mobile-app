import { useMutation, useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "../context";
import { fetchUserDetails, sendFeedback } from "../services/user.service";
import { SendFeedbackInput, UserDetails } from "../types/user";

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
