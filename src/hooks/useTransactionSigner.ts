import { useMobileWallet } from "@wallet-ui/react-native-kit";

export function useTransactionSigner() {
  const { client, getTransactionSigner, account } = useMobileWallet();

  const getSendingSigner = async () => {
    const {
      context: { slot: minContextSlot },
    } = await client.rpc.getLatestBlockhash().send();

    return getTransactionSigner(account!.address, minContextSlot);
  };

  return { getSendingSigner };
}
