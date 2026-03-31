// utils/relationshipMapper.ts
import { FrontendRelationship, BackendRelationship } from '@/features/user-profile/types';

// Map frontend values to backend values
export const frontendToBackendRelationship = (
  frontend: FrontendRelationship
): BackendRelationship => {
  const mapping: Record<FrontendRelationship, BackendRelationship> = {
    FATHER: 'PARENT',
    MOTHER: 'PARENT',
    SPOUSE: 'SPOUSE',
    CHILD: 'CHILD',
    OTHER: 'OTHER',
  };
  return mapping[frontend];
};

// Map backend values to frontend values
export const backendToFrontendRelationship = (
  backend: BackendRelationship,
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
): FrontendRelationship => {
  if (backend === 'PARENT') {
    // Determine FATHER/MOTHER based on gender if available
    return gender === 'MALE' ? 'FATHER' : 'MOTHER';
  }

  const mapping: Record<Exclude<BackendRelationship, 'PARENT'>, FrontendRelationship> = {
    SELF: 'OTHER', // Map SELF to OTHER in frontend
    SPOUSE: 'SPOUSE',
    CHILD: 'CHILD',
    SIBLING: 'OTHER', // Map SIBLING to OTHER in frontend
    OTHER: 'OTHER',
  };

  return mapping[backend as Exclude<BackendRelationship, 'PARENT'>] || 'OTHER';
};

// For display purposes in UI
export const formatRelationshipForDisplay = (
  relationship: FrontendRelationship | BackendRelationship
): string => {
  const displayMap: Record<FrontendRelationship | BackendRelationship, string> = {
    FATHER: 'Father',
    MOTHER: 'Mother',
    SPOUSE: 'Spouse',
    CHILD: 'Child',
    OTHER: 'Other',
    SELF: 'Self',
    PARENT: 'Parent',
    SIBLING: 'Sibling',
  };
  return displayMap[relationship] || relationship;
};

// Transform backend family member to frontend format
export const transformBackendToFrontendFamilyMember = (backendMember: any): any => {
  return {
    ...backendMember,
    relationship: backendToFrontendRelationship(backendMember.relationship, backendMember.gender),
  };
};

// Transform frontend family member to backend format for API calls
export const transformFrontendToBackendFamilyMember = (frontendMember: any): any => {
  return {
    ...frontendMember,
    relationship: frontendToBackendRelationship(frontendMember.relationship),
  };
};
