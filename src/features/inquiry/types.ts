import { User } from "../auth/types";

/* -------------------------------------------------------------------------- */
/*                                 INQUIRIES                                  */
/* -------------------------------------------------------------------------- */

export interface Inquiry {
  id: string;
  inquiryId: string;
  userId: string;
  user?: User;
  question: string;

  //  Reply is an object or null
  reply: {
    text: string;
    repliedAt: string;
  } | null;

  repliedById: string | null;

  //  repliedBy may contain nested info or null
  repliedBy: {
    id: string;
    name: string;
    email: string;
  } | null;

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  //  Convenience flattened fields from backend
  repliedByName?: string | null;
  repliedByEmail?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                          MEDICINE REQUEST TYPES                            */
/* -------------------------------------------------------------------------- */

export interface MedicineRequest {
  id: string;
  medicineRequestId: string;
  userId: string;
  user?: User;
  medicineName: string;
  quantity: number;

  //  reply can be string or object (to match backend flexibility)
  reply: {
    text: string;
    repliedAt: string;
  } | null;

  repliedById: string | null;
  repliedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  repliedByName?: string | null;
  repliedByEmail?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                             PAYLOAD INTERFACES                             */
/* -------------------------------------------------------------------------- */

//  Inquiry create payload
export interface CreateInquiryPayload {
  question: string;
}

//  Medicine request create payload
export interface CreateMedicineRequestPayload {
  medicineName: string;
  quantity: number;
}

/* -------------------------------------------------------------------------- */
/*                             RESPONSE INTERFACES                            */
/* -------------------------------------------------------------------------- */

export interface InquiryResponse {
  data: {
    inquiry: Inquiry;
    inquiries: Inquiry[];
  };
  status: string;
  message: string;
  errors: any;
}

export interface MedicineRequestResponse {
  data: {
    requestMedicine: MedicineRequest;
    requestMedicines: MedicineRequest[];
  };
  status: string;
  message: string;
  errors: any;
}
