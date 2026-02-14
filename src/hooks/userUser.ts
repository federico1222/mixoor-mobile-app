import { useMutation } from "@tanstack/react-query";
import { sendFeedback } from "../services/user.service";
import { SendFeedbackInput } from "../types/user";

export function useSendFeedback() {
  return useMutation({
    mutationFn: ({ feedback, wallet }: SendFeedbackInput) =>
      sendFeedback(feedback, wallet),
  });
}
