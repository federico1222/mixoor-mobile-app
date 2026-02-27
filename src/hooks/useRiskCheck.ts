import { useState, useCallback } from "react";
import { checkAddressWithRangeApi } from "../services/proxy.service";
import { useToast } from "../provider";

type RiskCheckResult = {
  riskScore: number;
  riskLevel: string;
  attribution: string | null;
};

type RiskCheckResponse = {
  success: boolean;
  message: string;
  data: RiskCheckResult;
};

const HIGH_RISK_SCORE = 10;

export const useRiskCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkAddressRisk = useCallback(
    async (address: string): Promise<boolean> => {
      setIsChecking(true);

      try {
        const response: RiskCheckResponse =
          await checkAddressWithRangeApi(address);

        if (response?.success && response.data?.riskScore === HIGH_RISK_SCORE) {
          toast({
            type: "error",
            title: "Address Flagged",
            description:
              "Your wallet has been flagged as high risk. Unable to proceed.",
          });
          return false;
        }

        // Allow if response is undefined, error, or risk score < 10
        return true;
      } catch (error) {
        // On error (including 400), allow the transfer to proceed
        console.warn("Risk check failed, proceeding with transfer:", error);
        return true;
      } finally {
        setIsChecking(false);
      }
    },
    [toast],
  );

  return {
    checkAddressRisk,
    isChecking,
  };
};
