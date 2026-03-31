import api from '@/lib/axios';
import type { Inquiry, InquiryResponse } from './types';

/* -------------------------------------------------------------------------- */
/*                               INQUIRY APIs                                 */
/* -------------------------------------------------------------------------- */

// ✅ Create Inquiry
export const createInquiryApi = async (payload: { question: string }): Promise<Inquiry> => {
  const { data } = await api.post<InquiryResponse>('/inquiry/query', payload);
  return data.data.inquiry;
};

// ✅ Get My Inquiries (with pagination)
export const getMyInquiriesApi = async ({
  offset = 0,
  limit = 20,
}: {
  offset?: number;
  limit?: number;
}): Promise<Inquiry[]> => {
  const { data } = await api.get<InquiryResponse>(
    `/inquiry/query/mine?offset=${offset}&limit=${limit}`
  );
  return data.data.inquiries;
};

/* -------------------------------------------------------------------------- */
/*                          MEDICINE REQUEST APIs                             */
/* -------------------------------------------------------------------------- */

// ✅ Create Medicine Request
export const createMedicineRequestApi = async (payload: {
  medicineName: string;
  quantity: number;
}): Promise<any> => {
  const { data } = await api.post('/inquiry/medicine-request', payload);
  return data.data.requestMedicine;
};

// ✅ Get My Medicine Requests (with pagination)
export const getMyMedicineRequestsApi = async ({
  offset = 0,
  limit = 20,
}: {
  offset?: number;
  limit?: number;
}): Promise<any[]> => {
  const { data } = await api.get(
    `/inquiry/medicine-request/mine?offset=${offset}&limit=${limit}`
  );
  return data.data.requestMedicines;
};
