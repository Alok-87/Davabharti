import api from '@/lib/axios';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  Prescription,
  UploadPrescriptionRequest,
  UploadPrescriptionResponse,
  UploadResponse,
} from './types';

/**
 * Uploads prescription file to Cloudinary using a backend-signed signature.
 */
export const uploadPrescriptionApi = async (file: File): Promise<UploadResponse> => {
  // 1️⃣ Validate file
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowed.includes(file.type)) throw new Error('Unsupported file type');
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5MB)');

  // 2️⃣ Request Cloudinary signature from backend
  const folder = 'prescriptions';
  const { data: sigResponse } = await api.post(ENDPOINTS.CLOUDINARY.SIGNATURE, { folder });

  // 3️⃣ Extract data from response (note: using 'cloudname' from response)
  const { signature, timestamp, cloudname, api_key } = sigResponse.data;

  // 4️⃣ Construct Cloudinary upload URL using the cloudname from backend
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`;

  // 5️⃣ Prepare Cloudinary upload form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp.toString()); // Convert to string
  formData.append('signature', signature);
  formData.append('folder', folder);

  // 6️⃣ Upload to Cloudinary public endpoint
  const cloudRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // 7️⃣ Construct prescription object
  const prescription: Prescription = {
    id: cloudRes.data.asset_id,
    url: cloudRes.data.secure_url,
    fileName: cloudRes.data.original_filename,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };

  return { success: true, prescription };
};

export const uploadPrescriptionApi_ = async (
  body: UploadPrescriptionRequest
): Promise<UploadPrescriptionResponse> => {
  const formData = new FormData();

  formData.append('folder', body.folder);
  formData.append('file', body.file);

  const { data } = await axios.post(`https://dv-back.thundergits.com/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data as UploadPrescriptionResponse;
};
