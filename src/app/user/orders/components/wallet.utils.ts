import type { WalletSetting } from '@/features/user-profile/types';

export function computeWalletUsage(
  amountBeforeWallet: number,
  form: { useWalletCash: boolean; cashAmount: string; useWalletCoins: boolean },
  wallet: { cashBalance?: any; coinBalance?: any } | null | undefined,
  walletSetting: WalletSetting | null | undefined
) {
  const availableCash = Number(wallet?.cashBalance ?? 0);
  const availableCoins = Number(wallet?.coinBalance ?? 0);
  const redemptionPercent = Number(walletSetting?.redemptionPercent ?? 0);

  let coinsToUse = 0;
  if (form.useWalletCoins && amountBeforeWallet > 0 && redemptionPercent > 0) {
    const maxCoinsByPercent = Math.floor((amountBeforeWallet * redemptionPercent) / 100);
    const maxUsableCoinsThisOrder = Math.min(availableCoins, maxCoinsByPercent);
    coinsToUse = Math.min(maxUsableCoinsThisOrder, amountBeforeWallet);
  }

  const amountAfterCoins = Math.max(amountBeforeWallet - coinsToUse, 0);

  let walletCashToUse = 0;
  if (form.useWalletCash && amountAfterCoins > 0) {
    const requested = Number(form.cashAmount || 0);
    const safeRequested = isNaN(requested) ? 0 : Math.max(requested, 0);
    walletCashToUse = Math.min(safeRequested, availableCash, amountAfterCoins);
  }

  return { walletCashToUse, coinsToUse, availableCash, availableCoins, redemptionPercent };
}