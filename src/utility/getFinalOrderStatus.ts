// ================= Display Enum =================
export enum DisplayOrderStatus {
  PROCESSING = "Processing",

  // PAYMENT
  PAYMENT_PENDING = "Payment Pending",
  PAYMENT_FAILED = "Payment Failed",
  PAYMENT_COMPLETED = "Payment Completed",

  // SUPPORT STAFF
  WAITING_FOR_SUPPORT_STAFF = "Waiting for Support Staff Approval",
  QUOTATION_SENT = "Quotation Received",

  // RX
  AWAITING_PRESCRIPTION_APPROVAL = "Awaiting Prescription Approval",
  REJECTED_BY_PHARMACIST = "Rejected by Pharmacist",

  // VENDOR
  AWAITING_VENDOR_CONFIRMATION = "Awaiting Vendor Confirmation",
  REJECTED_BY_VENDOR = "Rejected by Vendor",
  ORDER_CONFIRMED = "Order Confirmed",

  // DELIVERY
  SHIPPED = "Shipped",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",

  // RETURN
  RETURN_INITIATED = "Return Initiated",
  RETURN_IN_PROGRESS = "Return In Progress",
  RETURNED = "Returned",
  RETURN_ACCEPTED = "Return Accepted",
  RETURN_DECLINED = "Return Declined",
  RETURN_IN_TRANSIT = "Return In Transit",

  // CANCELLED
  CANCELLED = "Cancelled",
  ORDER_REJECTED = "Order Rejected",
}


// ================ Input Interface ================
export interface OrderStatusInput {
  orderType: 'PRODUCT' | 'PRESCRIPTION';
  orderStatus: string;
  deliveryStatus?: string;
  rxApprovalStatus?: string;
  vendorApprovalStatus?: string;
  returnStatus?: string;
  payment?: any;
  supportStaffStatus?: string;
  quotationStatus?: string;
}


// =============== Main Utility ==================
export function getFinalOrderStatus(order: OrderStatusInput): string {
  const {
    orderType,
    orderStatus,
    deliveryStatus,
    rxApprovalStatus,
    vendorApprovalStatus,
    returnStatus,
    payment,
    supportStaffStatus,
    quotationStatus,
  } = order;

  // -------------------------------------------------
  // 1. RETURN FLOW
  // -------------------------------------------------
  if (returnStatus) {
    switch (returnStatus) {
      case "RETURN_INIT": return DisplayOrderStatus.RETURN_INITIATED;
      case "ACCEPTED": return DisplayOrderStatus.RETURN_ACCEPTED;
      case "DECLINED": return DisplayOrderStatus.RETURN_DECLINED;
      case "RETURN_SHIPPED": return DisplayOrderStatus.RETURN_IN_TRANSIT;
      case "RETURN_RECEIVED_FROM_CUSTOMER":
      case "RETURN_REACHED_TO_VENDOR":
      case "REFUND_INIT": return DisplayOrderStatus.RETURN_IN_PROGRESS;
      case "RETURN_COMPLETED": return DisplayOrderStatus.RETURNED;
    }
  }

  // -------------------------------------------------
  // 2. CANCEL / REJECT
  // -------------------------------------------------
  if (orderStatus === "CANCELLED_BY_CUSTOMER")
    return DisplayOrderStatus.CANCELLED;

  if (orderStatus === "REJECTED")
    return DisplayOrderStatus.ORDER_REJECTED;

  if (supportStaffStatus === "DECLINED")
    return DisplayOrderStatus.ORDER_REJECTED;

  if (rxApprovalStatus === "REJECTED")
    return DisplayOrderStatus.REJECTED_BY_PHARMACIST;

  if (vendorApprovalStatus === "DECLINED")
    return DisplayOrderStatus.REJECTED_BY_VENDOR;

  // -------------------------------------------------
  // 3. SUPPORT STAFF LAYER (PRESCRIPTION FLOW)
  // -------------------------------------------------
  if (orderType === "PRESCRIPTION") {
    if (supportStaffStatus === "PENDING")
      return DisplayOrderStatus.WAITING_FOR_SUPPORT_STAFF;

    // Support staff accepted → quotation sent → waiting for customer to make payment selection
    if (supportStaffStatus === "ACCEPTED" && (!payment || payment.length === 0))
      return DisplayOrderStatus.QUOTATION_SENT;
  }

  // -------------------------------------------------
  // 3.5 QUOTATION STATUS (NEW)
  // -------------------------------------------------
  if (order.quotationStatus) {
    switch (order.quotationStatus) {
      case "SUPPORT_QUOTE_PENDING":
        return DisplayOrderStatus.QUOTATION_SENT;
      case "SUPPORT_QUOTE_ACCEPTED":
        if (!payment || payment.length === 0) return DisplayOrderStatus.PAYMENT_PENDING;
        break;
      case "SUPPORT_QUOTE_REJECTED":
        return DisplayOrderStatus.ORDER_REJECTED;
      case "SUPPORT_QUOTE_EXPIRED":
        return DisplayOrderStatus.ORDER_REJECTED;

      case "RX_QUOTE_PENDING":
        return DisplayOrderStatus.QUOTATION_SENT;
      case "RX_QUOTE_ACCEPTED":
        if (!payment || payment.length === 0) return DisplayOrderStatus.PAYMENT_PENDING;
        break;
      case "RX_QUOTE_REJECTED":
        return DisplayOrderStatus.ORDER_REJECTED;
      case "RX_QUOTE_EXPIRED":
        return DisplayOrderStatus.ORDER_REJECTED;
    }
  }

  // -------------------------------------------------
  // 4. PAYMENT STATUS
  // (ONLINE or COD both follow same rule)
  // -------------------------------------------------
  if (payment?.[0]?.status === "FAILED")
    return DisplayOrderStatus.PAYMENT_FAILED;

  // -------------------------------------------------
  // 5. RX APPROVAL FLOW
  // -------------------------------------------------
  if (rxApprovalStatus === "PENDING")
    return DisplayOrderStatus.AWAITING_PRESCRIPTION_APPROVAL;

  // -------------------------------------------------
  // 6. DELIVERY FLOW
  // -------------------------------------------------
  if (deliveryStatus) {
    if (deliveryStatus === "SHIPPED") return DisplayOrderStatus.SHIPPED;
    if (deliveryStatus === "OUT_FOR_DELIVERY") return DisplayOrderStatus.OUT_FOR_DELIVERY;
    if (deliveryStatus === "DELIVERED") return DisplayOrderStatus.DELIVERED;
  }

  // -------------------------------------------------
  // 7. VENDOR APPROVAL FLOW
  // -------------------------------------------------
  if (vendorApprovalStatus === "PENDING")
    return DisplayOrderStatus.AWAITING_VENDOR_CONFIRMATION;

  if (vendorApprovalStatus === "ACCEPTED")
    return DisplayOrderStatus.ORDER_CONFIRMED;

  // -------------------------------------------------
  // 8. DEFAULT
  // -------------------------------------------------
  return DisplayOrderStatus.PROCESSING;
}

