export function computePaymentState(order: any) {
  const payments: any[] = Array.isArray(order?.payment) ? order.payment : [];

  // 1. Financial totals
  // totalPaid: Amount successfully captured via previous Online payments.
  const totalPaid = payments
    .filter((p) => p?.status === 'PAID')
    .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

  // codCommittedAmount: Total balance assigned to COD payment records.
  const codCommittedAmount = payments
    .filter((p) => p?.paymentMethod === 'COD')
    .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

  const targetAmount = Number(order?.finalAmount ?? 0);

  /**
   * balanceDue calculation:
   * Positive (+) balance means the user needs to pay MORE.
   * Negative (-) balance means the user has overpaid (Savings on COD or Refund on Online).
   */
  const balanceDue = Math.round((targetAmount - totalPaid - codCommittedAmount) * 100) / 100;

  // 2. State-based visibility flags

  /**
   * EDGE CASE: Quick Order Initial Payment
   * Path: Upload RX -> Staff Quoted -> User Accepts -> PAYMENT SECTION SHOWN.
   * Logic: Hidden until quotationStatus === 'SUPPORT_QUOTE_ACCEPTED'. 
   * Transition to PLACED happens AFTER this section is completed.
   */
  const isQuickOrderInitialPaymentPending =
    order?.orderType === 'PRESCRIPTION' &&
    order?.orderStatus === 'DRAFT' &&
    order?.quotationStatus === 'SUPPORT_QUOTE_ACCEPTED';

  /**
   * EDGE CASE: RX Modification Adjustment (Post-Placement)
   * Path: Order PLACED -> RX Modified -> User Accepts -> PAYMENT SECTION SHOWN.
   * Logic: Only shown if Price Increased (balanceDue > 0) AND user has accepted the modification.
   * If price decreased, we show a refund/savings message but hide the manual payment section.
   */
  const isRxModificationPaymentPending =
    order?.isModifiedByRx === true &&
    order?.quotationStatus === 'RX_QUOTE_ACCEPTED' &&
    balanceDue > 0;

  /**
   * EDGE CASE: Standard Product Order Initial Checkout
   * Path: Product Checkout (Online) -> FAILED/PLACED -> PAYMENT SECTION SHOWN.
   * Logic: Only shown for non-modified orders where payment is pending and balance is due.
   */
  const isStandardProductPaymentPending =
    order?.orderType === 'PRODUCT' &&
    !order?.isModifiedByRx &&
    (order?.orderStatus === 'PLACED' || order?.orderStatus === 'PAYMENT_FAILED') &&
    balanceDue > 0;

  const shouldShowPaymentSection =
    (isQuickOrderInitialPaymentPending || isRxModificationPaymentPending || isStandardProductPaymentPending) &&
    order?.orderStatus !== 'CANCELLED_BY_CUSTOMER' &&
    order?.orderStatus !== 'REJECTED';

  // 3. Messaging (used by both PaymentSection and QuotationCard)
  let paymentMessage = '';
  const firstPaymentMethod = payments?.[0]?.paymentMethod || 'Online';
  const isCOD = firstPaymentMethod === 'COD';

  if (balanceDue < 0) {
    /**
     * EDGE CASE: Price Decrease / Savings
     * For COD: Item decrease results in "Savings" on the final bill.
     * For Online: Item decrease results in "Refund" to the original source.
     */
    const absDiff = Math.abs(balanceDue).toFixed(2);
    paymentMessage = isCOD
      ? `You saved ₹${absDiff} on this order`
      : `₹${absDiff} will be refunded to your account`;
  } else if (balanceDue > 0) {
    /**
     * EDGE CASE: Price Increase / Pending Balance
     * We show this message even if the payment section is technically hidden (e.g., inside QuotationCard) 
     * so the user knows the financial impact before clicking "Accept Quotation".
     */
    const dueStr = balanceDue.toFixed(2);
    paymentMessage = isCOD
      ? `You have to pay ₹${dueStr} more at delivery`
      : `You have to pay ₹${dueStr} more`;
  }

  return {
    totalPaid,
    targetAmount,
    balanceDue,
    isFullyPaid: balanceDue <= 0,
    shouldShowPaymentSection,
    paymentMessage,
    flags: {
      isQuickOrderInitialPaymentPending,
      isRxModificationPaymentPending,
      isStandardProductPaymentPending,
    },
  };
}

