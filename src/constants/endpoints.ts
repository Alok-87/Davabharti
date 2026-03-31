export const ENDPOINTS = Object.freeze({
  DUMMY: {
    DUMMY1: 'dummy/dummy1',
    DUMMY2: 'dummy/dummy2',
  },
  MEDICINES: {
    LIST: '/medicine',
    DETAIL: (id: string) => `/medicine/${id}`,
    SLUG: (slug: string) => `/medicine/s/${slug}`,
  },
  SECTIONS: {
    LIST: '/section',
  },
  CUSTOMER: {
    PROFILE: '/customer/me',

    //  Address
    ADDRESS: '/customer/address',
    ADDRESS_DETAIL: (id: string) => `/customer/address/${id}`,

    //  Family Members
    FAMILY_MEMBERS: '/customer/member',
    FAMILY_MEMBER_DETAIL: (id: string) => `/customer/member/${id}`,

    // Saved  Prescriptions
    PRESCRIPTIONS: '/customer/prescriptions',
    PRESCRIPTION: '/customer/prescription',
  },

  //upload prescription
  CLOUDINARY: {
    SIGNATURE: '/cloudinary/signature',
  },

  CART: {
    BASE: '/cart',
    ITEM: (id: string) => `/cart/item/${id}`,
  },
  ORDER: {
    BASE: '/order/customer',
    DETAIL: (id: string) => `/order/${id}`,
    CREATE_PRODUCT: '/order/customer/product',
    CREATE_PRESCRIPTION: '/order/customer/prescription',
    QOUTATION_STATUS_UPDATE: (orderId: string) => `/order/customer/approve/${orderId}`,
    QUOTATION_PAYMENT_UPDATE: (orderId: string) => `/order/customer/quotation-payment/${orderId}`,
    CANCEL: (orderId: string) => `/order/customer/cancel/${orderId}`,
    RETURN: (orderId: string) => `/order/customer/return/${orderId}`,
  },

  DELIVERY: {
    BASE: '/common/delivery-charge',
  },
  //add endpoints for future features
});
