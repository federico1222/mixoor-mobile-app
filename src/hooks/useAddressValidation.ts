import { isAddress } from "@solana/kit";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "tamagui";
import { isSnsDomainFormat, resolveSnsDomain } from "../types/sns";

interface ValidationState {
  isValid: boolean;
  isLoading: boolean;
  errorMessage: string;
  resolvedSNSdAddress?: string;
}

export function useAddressValidation(address: string) {
  const [isTyping, setIsTyping] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const debouncedAddress = useDebounceValue(address, 500);

  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    isLoading: false,
    errorMessage: "",
  });

  const validateAddressOrDomain = async (
    input: string
  ): Promise<ValidationState> => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return {
        isValid: false,
        isLoading: false,
        errorMessage: "Recipient address is required",
      };
    }

    if (isAddress(trimmedInput)) {
      return {
        isValid: true,
        isLoading: false,
        errorMessage: "",
      };
    }

    if (isSnsDomainFormat(trimmedInput)) {
      try {
        const resolvedSNSdAddress = await resolveSnsDomain(trimmedInput);

        if (resolvedSNSdAddress) {
          return {
            isValid: true,
            isLoading: false,
            errorMessage: "",
            resolvedSNSdAddress,
          };
        }

        return {
          isValid: false,
          isLoading: false,
          errorMessage: "SNS domain not found",
        };
      } catch {
        return {
          isValid: false,
          isLoading: false,
          errorMessage: "Failed to verify domain",
        };
      }
    }

    return {
      isValid: false,
      isLoading: false,
      errorMessage: "Invalid Solana address or SNS domain",
    };
  };

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleInputChange = (value: string) => {
    setHasBeenTouched(true);
    setIsTyping(true);

    if (value.trim()) {
      setValidationState((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 200);
  };

  useEffect(() => {
    const validateInput = async () => {
      if (!hasBeenTouched) return;

      if (!debouncedAddress.trim()) {
        setValidationState({
          isValid: true,
          isLoading: false,
          errorMessage: "",
        });
        return;
      }

      const result = await validateAddressOrDomain(debouncedAddress);
      setValidationState(result);
    };

    validateInput();
  }, [debouncedAddress, hasBeenTouched]);

  const showSpinner = validationState.isLoading || isTyping;
  const showError = hasBeenTouched && !validationState.isValid;

  return {
    validationState,
    showSpinner,
    showError,
    handleInputChange,
  };
}
