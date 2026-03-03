import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { useQRScanner } from "@/src/hooks/useQRScanner";
import { CameraView } from "expo-camera";
import {
  QrCodeIcon,
  UserCircleIcon,
  WarningIcon,
  XIcon,
} from "phosphor-react-native";
import { useCallback, useEffect } from "react";
import { Modal } from "react-native";
import { Button, Input, Spinner, Text, View, XStack, YStack } from "tamagui";

interface WalletAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onResolvedAddress?: (resolved: string | undefined) => void;
  placeholder?: string;
  index?: number;
}

export default function WalletAddressInput({
  value,
  onChange,
  onResolvedAddress,
  placeholder = "Enter Wallet Address",
  index,
}: WalletAddressInputProps) {
  const { validationState, showSpinner, showError, handleInputChange } =
    useAddressValidation(value);

  useEffect(() => {
    onResolvedAddress?.(validationState.resolvedSNSdAddress);
  }, [validationState.resolvedSNSdAddress]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
      handleInputChange(newValue);
    },
    [onChange, handleInputChange],
  );

  const { isScanning, startScan, stopScan, handleBarCodeScanned } =
    useQRScanner(handleChange);

  return (
    <YStack>
      <XStack
        py="$2"
        px="$3"
        items="center"
        borderWidth={1}
        borderColor={showError ? "#E53E3E" : "#27272A"}
        rounded="$3"
        height={44}
      >
        {showSpinner ? (
          <Spinner size="small" color="#5D44BE" />
        ) : (
          <UserCircleIcon size={18} color="#CED0D1" weight="fill" />
        )}

        <Input
          flex={1}
          ml="$3"
          bg="transparent"
          fontSize={13}
          color="#FAFAFA"
          fontFamily="Noto_400"
          placeholder={placeholder}
          placeholderTextColor="rgba(250, 250, 250, 0.50)"
          value={value}
          onChangeText={handleChange}
          borderWidth={0}
          p={0}
          focusStyle={{ outlineWidth: 0, borderWidth: 0 }}
        />

        <Button chromeless p={0} onPress={startScan}>
          <QrCodeIcon size={18} color="#CED0D1" weight="bold" />
        </Button>
      </XStack>

      {showError && (
        <XStack
          mt={10}
          gap="$2"
          items="center"
          bg="#2B0010"
          p="$2.5"
          rounded="$2"
        >
          <WarningIcon size={14} color="#EFB2CE" weight="fill" />
          <Text fontSize={12} color="#EFB2CE" flex={1}>
            {validationState.errorMessage}
          </Text>
        </XStack>
      )}

      <Modal
        visible={isScanning}
        animationType="slide"
        onRequestClose={stopScan}
      >
        <View flex={1} bg="black">
          {/* Camera fills the entire modal */}
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarCodeScanned}
          />

          {/* Dimmed overlay */}
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justify="center"
            items="center"
            bg="rgba(0,0,0,0.55)"
          >
            {/* Scan frame with corner brackets */}
            <View width={240} height={240}>
              {/* Top-left */}
              <View
                position="absolute"
                top={0}
                left={0}
                w={20}
                h={20}
                borderTopWidth={3}
                borderLeftWidth={3}
                borderColor="#5D44BE"
                borderTopLeftRadius={4}
              />
              {/* Top-right */}
              <View
                position="absolute"
                top={0}
                right={0}
                w={20}
                h={20}
                borderTopWidth={3}
                borderRightWidth={3}
                borderColor="#5D44BE"
                borderTopRightRadius={4}
              />
              {/* Bottom-left */}
              <View
                position="absolute"
                bottom={0}
                left={0}
                w={20}
                h={20}
                borderBottomWidth={3}
                borderLeftWidth={3}
                borderColor="#5D44BE"
                borderBottomLeftRadius={4}
              />
              {/* Bottom-right */}
              <View
                position="absolute"
                bottom={0}
                right={0}
                w={20}
                h={20}
                borderBottomWidth={3}
                borderRightWidth={3}
                borderColor="#5D44BE"
                borderBottomRightRadius={4}
              />
            </View>

            <Text
              fontSize={13}
              color="#FAFAFA"
              opacity={0.8}
              mt="$4"
              textAlignVertical="center"
            >
              Point at a Solana wallet QR code
            </Text>
          </View>

          {/* Close button */}
          <Button
            position="absolute"
            top={52}
            right={20}
            size="$3"
            circular
            bg="rgba(0,0,0,0.5)"
            onPress={stopScan}
            icon={<XIcon size={18} color="#FAFAFA" weight="bold" />}
          />
        </View>
      </Modal>
    </YStack>
  );
}
