/**
 * BHULEKH AI Authentication Service
 * Pluggable architecture supporting UIDAI Aadhaar OTP Gateway and Government Single Sign-On (e-Pramaan / Jan Parichay).
 */

import { UserRole } from '../types/landRecord';

export interface AuthConfig {
  /** When true, simulated mock authentication is enabled */
  isDemoMode: boolean;
  /** Fixed 6-digit OTP accepted in Demo Mode */
  fixedDemoOtp: string;
}

/**
 * Global authentication configuration for BHULEKH AI.
 * In Demo Mode, the fixed OTP (123456) is accepted for any valid 12-digit Aadhaar.
 * When Demo Mode is disabled, fixed demo OTPs cannot bypass authentication.
 */
export const AUTH_CONFIG: AuthConfig = {
  isDemoMode: true,
  fixedDemoOtp: '123456'
};

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  designation?: string;
  aadhaarMasked?: string;
  mobileMasked?: string;
  officialEmail?: string;
  jurisdiction?: {
    state: string;
    district: string;
    tehsil?: string;
  };
  loginTime: string;
  authMethod: 'aadhaar_otp' | 'gov_sso' | 'mock_demo';
}

export interface AadhaarValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  rawDigits?: string;
}

export interface OtpSendResponse {
  success: boolean;
  txnId: string;
  message: string;
  maskedMobile: string;
  demoOtp: string;
  isSimulated: boolean;
}

export interface OtpVerifyResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface GovOfficialCredentials {
  designation: UserRole;
  officialId: string;
  password?: string;
  state: string;
  district: string;
  tehsil: string;
}

// -------------------------------------------------------------
// Pluggable Interface Declarations for Production Integration
// -------------------------------------------------------------

export interface AadhaarAuthProvider {
  validateAadhaar(rawInput: string): AadhaarValidationResult;
  sendOtp(aadhaarNumber: string): Promise<OtpSendResponse>;
  verifyOtp(txnId: string, otp: string, aadhaarNumber: string): Promise<OtpVerifyResponse>;
}

export interface GovernmentAuthProvider {
  loginOfficial(credentials: GovOfficialCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }>;
}

// -------------------------------------------------------------
// Prototype / Demo Mock Aadhaar Authentication Service
// -------------------------------------------------------------

class MockAadhaarAuthService implements AadhaarAuthProvider {
  public validateAadhaar(rawInput: string): AadhaarValidationResult {
    // Remove spaces, hyphens, and non-digit characters
    const cleanDigits = rawInput.replace(/\D/g, '');

    if (!cleanDigits) {
      return { isValid: false, error: 'Aadhaar ID cannot be empty.' };
    }

    if (cleanDigits.length < 12) {
      return { isValid: false, error: `Aadhaar ID must be exactly 12 digits (currently ${cleanDigits.length} digits).` };
    }

    if (cleanDigits.length > 12) {
      return { isValid: false, error: 'Aadhaar ID cannot exceed 12 digits.' };
    }

    // Check for invalid obvious dummy patterns like all zeroes or ones
    if (/^(\d)\1{11}$/.test(cleanDigits)) {
      return { isValid: false, error: 'Invalid Aadhaar sequence.' };
    }

    // Format as 4-4-4
    const formatted = `${cleanDigits.slice(0, 4)} ${cleanDigits.slice(4, 8)} ${cleanDigits.slice(8, 12)}`;

    return {
      isValid: true,
      rawDigits: cleanDigits,
      formatted
    };
  }

  public async sendOtp(aadhaarNumber: string): Promise<OtpSendResponse> {
    const val = this.validateAadhaar(aadhaarNumber);
    if (!val.isValid || !val.rawDigits) {
      throw new Error(val.error || 'Invalid Aadhaar ID');
    }

    // Simulate realistic gateway network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const txnId = `TXN-UIDAI-${Date.now().toString(36).toUpperCase()}`;
    const lastFour = val.rawDigits.slice(8);
    const maskedMobile = `+91 ******${lastFour.slice(-4) || '3821'}`;

    return {
      success: true,
      txnId,
      message: 'OTP sent to your registered mobile number.',
      maskedMobile,
      demoOtp: AUTH_CONFIG.fixedDemoOtp,
      isSimulated: true
    };
  }

  public async verifyOtp(_txnId: string, otp: string, aadhaarNumber: string): Promise<OtpVerifyResponse> {
    const val = this.validateAadhaar(aadhaarNumber);
    if (!val.isValid || !val.rawDigits) {
      return { success: false, error: 'Invalid Aadhaar ID session.' };
    }

    // Simulate network processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      return { success: false, error: 'Please enter the 6-digit OTP.' };
    }

    // Demo Mode Verification: Accepts fixed demo OTP 123456 for any valid 12-digit Aadhaar
    if (AUTH_CONFIG.isDemoMode) {
      if (cleanOtp !== AUTH_CONFIG.fixedDemoOtp) {
        return { 
          success: false, 
          error: 'Invalid OTP. Please enter the correct 6-digit verification code.' 
        };
      }
    } else {
      // Production Mode Guard: Demo OTP cannot bypass authentication when Demo Mode is disabled
      return {
        success: false,
        error: 'Demo Mode is disabled. Live UIDAI verification required.'
      };
    }

    const maskedAadhaar = `XXXX-XXXX-${val.rawDigits.slice(8)}`;

    const user: AuthUser = {
      id: `usr-citizen-${val.rawDigits.slice(8)}`,
      name: 'Rajesh Kumar',
      role: 'citizen',
      designation: 'Citizen / Registered Landholder',
      aadhaarMasked: maskedAadhaar,
      mobileMasked: '+91 98****3821',
      jurisdiction: {
        state: 'Jharkhand',
        district: 'Dumka',
        tehsil: 'Dumka Sadar'
      },
      loginTime: new Date().toISOString(),
      authMethod: 'mock_demo'
    };

    return {
      success: true,
      user
    };
  }
}

// -------------------------------------------------------------
// Prototype / Demo Mock Government Official Authentication Service
// -------------------------------------------------------------

class MockGovAuthService implements GovernmentAuthProvider {
  public async loginOfficial(credentials: GovOfficialCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Simulate SSO gateway validation
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!credentials.officialId || credentials.officialId.trim().length < 3) {
      return { success: false, error: 'Please enter a valid Official Employee ID or Government Email.' };
    }

    const officerProfiles: Record<UserRole, { name: string; designation: string; email: string }> = {
      tehsildar: {
        name: 'S. N. Pandey',
        designation: 'Tehsildar / Circle Officer (Dumka Sadar)',
        email: 'sn.pandey.co@revenue.jharkhand.gov.in'
      },
      patwari: {
        name: 'Anil Soren',
        designation: 'Revenue Inspector / Patwari (Rampur Circle)',
        email: 'anil.soren.ri@revenue.jharkhand.gov.in'
      },
      district_officer: {
        name: 'Rajeshwar Singh (IAS)',
        designation: 'District Collector & Magistrate (Dumka)',
        email: 'dc.dumka@jharkhand.gov.in'
      },
      admin: {
        name: 'Amitabh Sen',
        designation: 'Chief Revenue IT Systems Administrator',
        email: 'admin.dilrmp@nic.in'
      },
      citizen: {
        name: 'Rajesh Kumar',
        designation: 'Citizen / Landholder',
        email: 'rajesh.kumar@gmail.com'
      }
    };

    const profile = officerProfiles[credentials.designation] || officerProfiles.tehsildar;

    const user: AuthUser = {
      id: `usr-gov-${credentials.designation}-${Date.now().toString(36)}`,
      name: profile.name,
      role: credentials.designation,
      designation: profile.designation,
      officialEmail: credentials.officialId.includes('@') ? credentials.officialId : profile.email,
      jurisdiction: {
        state: credentials.state || 'Jharkhand',
        district: credentials.district || 'Dumka',
        tehsil: credentials.tehsil || 'Dumka Sadar'
      },
      loginTime: new Date().toISOString(),
      authMethod: 'gov_sso'
    };

    return {
      success: true,
      user
    };
  }
}

export const aadhaarAuthService = new MockAadhaarAuthService();
export const govAuthService = new MockGovAuthService();
