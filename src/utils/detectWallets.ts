export const WALLET_APPS = [
  {
    name: "Phantom",
    playStoreUrl: "https://play.google.com/store/apps/details?id=app.phantom",
    icon: require("../assets/wallets/phantom.png"),
  },
  {
    name: "Solflare",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.solflare.mobile",
    icon: require("../assets/wallets/solflare.png"),
  },
  {
    name: "Backpack",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=app.backpack.mobile",
    icon: "https://play-lh.googleusercontent.com/oU0hWlCk3ZT_5dng09QaxdcIUpY2m5GkZGDa4TrbJ36zG6zxKL2yFPyC9jvnMeecRPA=w240-h480-rw",
  },
  {
    name: "Trust Wallet",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
    icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
  },
  {
    name: "Jupiter Mobile",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=ag.jup.jupiter.android",
    icon: "https://play-lh.googleusercontent.com/KcJWk7luRdGes1XHadwM_FDisrkYtspIwGKjhz4d4VAW-A_bg7YR6M-f_oidKzPrTGZsGH5n1-lvIS3VoUj9qA=w240-h480-rw",
  },
  {
    name: "Glow Wallet",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.luma.wallet.prod",
    icon: "https://play-lh.googleusercontent.com/wjRjMDJ0GJDURRVhHeJ9GvBs171vfUuW1chLMPqeqHqB3o5LBQHWjYmt--eGwej4Ng",
  },
];

export function isNoWalletsError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || "";
  const errorName = error?.name?.toLowerCase() || "";

  return (
    errorName.includes("solanamobilewalletadaptererror") ||
    errorMessage.includes("found no installed wallet") ||
    errorMessage.includes("no installed wallet that supports")
  );
}
