import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { aadhaarAuthService, govAuthService, AUTH_CONFIG } from '../services/authService';
import { UserRole } from '../types/landRecord';
import { SihBadge, AshokaEmblem } from '../components/common/Emblems';
import {
  ShieldCheck,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  Fingerprint,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff,
  Globe2,
  Lock,
  PhoneCall,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { 
    setActiveTab, 
    loginUser, 
    setSelectedDistrict, 
    setSelectedTehsil, 
    setSelectedState, 
    govLanguage 
  } = useApp();

  const isHindi = govLanguage === 'hi';

  // Selected Auth Mode: 'citizen' | 'official'
  const [authMode, setAuthMode] = useState<'citizen' | 'official'>('citizen');

  // Citizen Aadhaar Flow State
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [showMaskedAadhaar, setShowMaskedAadhaar] = useState(false);
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpTxnId, setOtpTxnId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState(false);

  // Government Official Flow State
  const [officialRole, setOfficialRole] = useState<UserRole>('tehsildar');
  const [officialId, setOfficialId] = useState('sn.pandey.co@revenue.jharkhand.gov.in');
  const [officialPassword, setOfficialPassword] = useState('••••••••••••');
  const [officialState, setOfficialState] = useState('Jharkhand');
  const [officialDistrict, setOfficialDistrict] = useState('Dumka');
  const [officialTehsil, setOfficialTehsil] = useState('Dumka Sadar');
  const [govError, setGovError] = useState<string | null>(null);
  const [isLoggingInGov, setIsLoggingInGov] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Reset temporary OTP session data whenever SignInPage is mounted (e.g. after Logout)
  useEffect(() => {
    setOtpSent(false);
    setOtpInput('');
    setOtpTxnId(null);
    setAadhaarError(null);
    setOtpError(null);
    setGovError(null);
    setSuccessToast(null);
  }, []);

  // Countdown timer for Citizen OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  // Handle Aadhaar formatting (Groups of 4 digits)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < rawVal.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += rawVal[i];
    }
    setAadhaarInput(formatted);
    setAadhaarError(null);
  };

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDigits = aadhaarInput.replace(/\D/g, '');

    const validation = aadhaarAuthService.validateAadhaar(cleanDigits);
    if (!validation.isValid) {
      setAadhaarError(validation.error || 'Please enter a valid 12-digit Aadhaar ID.');
      return;
    }

    setAadhaarError(null);
    setIsSendingOtp(true);
    setOtpError(null);

    try {
      const response = await aadhaarAuthService.sendOtp(cleanDigits);
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpTxnId(response.txnId);
      setOtpMessage(
        isHindi 
          ? `ओटीपी आपके पंजीकृत मोबाइल (${response.maskedMobile}) पर भेज दिया गया है।` 
          : `OTP has been sent to your registered mobile number (${response.maskedMobile}).`
      );
      setCountdown(30);
      setCanResend(false);
      setOtpInput(''); // Clean input field
    } catch (err: any) {
      setIsSendingOtp(false);
      setAadhaarError(err.message || 'Failed to send OTP. Please check your connection.');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = aadhaarInput.replace(/\D/g, '');
    const cleanOtp = otpInput.trim();

    if (!cleanOtp) {
      setOtpError(isHindi ? 'कृपया अपने मोबाइल पर प्राप्त 6-अंकीय ओटीपी दर्ज करें।' : 'Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await aadhaarAuthService.verifyOtp(otpTxnId || 'demo-txn', cleanOtp, cleanDigits);
      setIsVerifyingOtp(false);

      if (res.success && res.user) {
        setSuccessToast(`Welcome, ${res.user.name}! Authenticated as Citizen.`);
        loginUser(res.user);
        setTimeout(() => {
          setActiveTab('location-select');
        }, 500);
      } else {
        setOtpError(res.error || (isHindi ? 'अमान्य ओटीपी। कृपया सही 6-अंकीय ओटीपी दर्ज करें।' : 'Invalid OTP. Please enter the correct 6-digit OTP.'));
      }
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setOtpError(err.message || 'OTP verification failed.');
    }
  };

  // Handle Government Official Sign In
  const handleGovLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialId.trim()) {
      setGovError('Please enter your Official Employee ID or Government Email.');
      return;
    }

    setIsLoggingInGov(true);
    setGovError(null);

    try {
      const res = await govAuthService.loginOfficial({
        designation: officialRole,
        officialId: officialId.trim(),
        password: officialPassword,
        state: officialState,
        district: officialDistrict,
        tehsil: officialTehsil
      });

      setIsLoggingInGov(false);

      if (res.success && res.user) {
        setSuccessToast(`Authenticated as ${res.user.designation}`);
        loginUser(res.user);
        setSelectedState(officialState);
        setSelectedDistrict(officialDistrict);
        setSelectedTehsil(officialTehsil);
        setTimeout(() => {
          setActiveTab('official-dashboard');
        }, 500);
      } else {
        setGovError(res.error || 'Authentication rejected by Government SSO.');
      }
    } catch (err: any) {
      setIsLoggingInGov(false);
      setGovError(err.message || 'Government SSO service unavailable.');
    }
  };

  // Quick Demo Fill for Evaluators
  const handleQuickFillOfficial = (role: UserRole, state = 'Jharkhand', district = 'Dumka', tehsil = 'Dumka Sadar') => {
    setOfficialRole(role);
    setOfficialState(state);
    setOfficialDistrict(district);
    setOfficialTehsil(tehsil);
    if (state === 'Bihar') {
      if (role === 'tehsildar') {
        setOfficialId('rk.jha.co@revenue.bihar.gov.in');
      } else if (role === 'patwari') {
        setOfficialId('vdo.arwal@bihar.gov.in');
      } else {
        setOfficialId('dm.arwal@bihar.gov.in');
      }
    } else {
      if (role === 'tehsildar') {
        setOfficialId('sn.pandey.co@revenue.jharkhand.gov.in');
      } else if (role === 'patwari') {
        setOfficialId('anil.soren.ri@revenue.jharkhand.gov.in');
      } else if (role === 'district_officer') {
        setOfficialId('dc.dumka@jharkhand.gov.in');
      } else if (role === 'admin') {
        setOfficialId('admin.dilrmp@nic.in');
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-130px)] flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 overflow-hidden bg-[#F4F6F9]">
      
      {/* ========================================================================= */}
      {/* 1. STATE EMBLEM OF INDIA (LION CAPITAL OF ASHOKA) BACKGROUND               */}
      {/* ========================================================================= */}
      
      {/* Subtle Government Neutral Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFCFF] via-[#F4F6F9] to-[#EBF0F7] pointer-events-none" />

      {/* Prominent Official State Emblem of India (Lion Capital) Watermark Background */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <img 
          src="/national-emblem-seal.jpg" 
          alt="State Emblem of India" 
          className="w-[500px] sm:w-[650px] lg:w-[720px] max-w-none opacity-[0.22] mix-blend-multiply object-contain filter contrast-105 transition-all duration-700"
        />
      </div>

      {/* Soft Vignette & Subtle Government Aesthetic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-200/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#F4F6F9]/20 to-[#E2E8F0]/30 pointer-events-none" />

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#138808] text-white rounded-lg shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 border border-[#0E6006]">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Foreground Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-4 sm:space-y-5">
        
        {/* Page Header Chips Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Page Breadcrumb Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-[11px] text-slate-700 shadow-sm">
            <span 
              className="cursor-pointer hover:text-[#003D7C] hover:underline transition-colors font-semibold" 
              onClick={() => setActiveTab('landing')}
            >
              {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
            </span>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-[#002856]">
              {isHindi ? 'पोर्टल प्रवेश एवं प्रमाणीकरण' : 'Portal Sign In & Authentication'}
            </span>
          </div>

          {/* National Trust Seal Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-[11px] text-[#002856] font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138808] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#138808]" />
            </span>
            <span>{isHindi ? 'राष्ट्रीय डिजिटल भूमि मिशन (DILRMP 2.0)' : 'National Digital Land Mission (DILRMP 2.0)'}</span>
          </div>
        </div>

        {/* Main Government Portal Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT 7-COLUMNS: AUTHENTICATION FORM CARD (UIDAI / e-PRAMAAN STYLE)       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xl shadow-slate-900/10 overflow-hidden ring-1 ring-slate-900/5 transition-all">
            
            {/* Card Header with Navy Band & Saffron Accent */}
            <div className="bg-[#003D7C] text-white px-5 sm:px-6 py-4 border-b-2 border-[#FF9933] relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/10 rounded-lg border border-white/15">
                    <AshokaEmblem variant="light" className="h-7 w-auto" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#FF9933]" />
                      <span>{isHindi ? 'सुरक्षित पोर्टल लॉगिन' : 'Secure Portal Sign In'}</span>
                    </h2>
                    <p className="text-[11px] text-[#C2DCF0] mt-0.5 font-medium">
                      {isHindi 
                        ? 'कृपया अपना प्रमाणीकरण माध्यम चुनें'
                        : 'Select your authentication role to continue'}
                    </p>
                  </div>
                </div>
                <SihBadge className="bg-[#002856] text-white border-[#005FA8] hidden sm:inline-flex shadow-xs" />
              </div>
            </div>

            {/* Exactly Two Sharp Government Primary Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/90">
              <button
                type="button"
                id="user-login-tab"
                onClick={() => {
                  setAuthMode('citizen');
                  setSuccessToast(null);
                  setAadhaarError(null);
                  setOtpError(null);
                }}
                className={`py-3.5 px-3 text-xs font-bold text-center border-r border-slate-200 transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'citizen'
                    ? 'bg-white text-[#003D7C] border-b-2 border-b-[#FF9933] shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-[#003D7C] hover:bg-slate-100/70'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-[#003D7C]" />
                <span>{isHindi ? 'नागरिक लॉगिन (आधार)' : 'Citizen Login (Aadhaar)'}</span>
              </button>

              <button
                type="button"
                id="official-login-tab"
                onClick={() => {
                  setAuthMode('official');
                  setSuccessToast(null);
                  setGovError(null);
                }}
                className={`py-3.5 px-3 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'official'
                    ? 'bg-white text-[#003D7C] border-b-2 border-b-[#FF9933] shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-[#003D7C] hover:bg-slate-100/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#003D7C]" />
                <span>{isHindi ? 'अधिकारी लॉगिन (SSO)' : 'Official Login (SSO)'}</span>
              </button>
            </div>

            {/* FORM BODY */}
            <div className="p-5 sm:p-6 space-y-5">
              
              {/* ========================================================================= */}
              {/* 1. CITIZEN AADHAAR OTP FLOW                                               */}
              {/* ========================================================================= */}
              {authMode === 'citizen' && (
                <div className="space-y-4">
                  
                  {/* Notice Box */}
                  <div className="p-3 bg-[#F0F5FA] border-l-4 border-[#003D7C] rounded-r text-[11px] text-slate-700 leading-relaxed shadow-2xs space-y-1.5">
                    <div>
                      <span className="font-bold text-[#002856]">
                        {isHindi ? 'नागरिक स्व-सेवा प्रमाणीकरण:' : 'Citizen Self-Service Access:'}
                      </span>{' '}
                      {isHindi 
                        ? 'अपने 12-अंकीय आधार संख्या द्वारा ओटीपी प्राप्त कर अपने पंजीकृत खसरा, खतियान व लगान स्थिति की जांच करें।'
                        : 'Authenticate with your 12-digit Aadhaar ID to inspect your land locker, digital deed records, and dispute status.'}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium pt-1 border-t border-slate-200/70">
                      <Sparkles className="w-3 h-3 text-[#FF9933] shrink-0" />
                      <span>
                        {isHindi
                          ? 'सिम्युलेटेड प्रमाणीकरण (डेमो मोड): यह वातावरण लाइव यूआईडीएआई सर्वर से नहीं जुड़ता है।'
                          : 'Simulated Authentication (Demo Mode): This environment does not verify Aadhaar through live UIDAI servers.'}
                      </span>
                    </div>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-[#002856] mb-1.5">
                          <label htmlFor="aadhaar-input">{isHindi ? '12-अंकीय आधार संख्या (Aadhaar Number)' : '12-Digit Aadhaar ID'}</label>
                          <span className="text-[10px] text-slate-500 font-mono font-medium">XXXX XXXX XXXX</span>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Fingerprint className="w-4 h-4 text-[#003D7C]" />
                          </div>
                          
                          <input
                            id="aadhaar-input"
                            type={showMaskedAadhaar ? 'password' : 'text'}
                            value={aadhaarInput}
                            onChange={handleAadhaarChange}
                            placeholder={isHindi ? "12-अंकीय आधार संख्या दर्ज करें" : "Enter 12-digit Aadhaar Number"}
                            maxLength={14}
                            className={`w-full pl-9 pr-12 py-2.5 bg-white border rounded-md text-xs font-mono tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all ${
                              aadhaarError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300 hover:border-[#003D7C]'
                            }`}
                            autoFocus
                          />

                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                            <button
                              type="button"
                              onClick={() => setShowMaskedAadhaar(!showMaskedAadhaar)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              title={showMaskedAadhaar ? 'Show digits' : 'Mask digits'}
                            >
                              {showMaskedAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {aadhaarError && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{aadhaarError}</span>
                          </p>
                        )}
                      </div>

                      {/* Send OTP Button */}
                      <button
                        type="submit"
                        disabled={isSendingOtp || aadhaarInput.replace(/\D/g, '').length !== 12}
                        className="w-full py-2.5 px-4 rounded-md text-xs font-bold bg-[#003D7C] hover:bg-[#002856] disabled:opacity-50 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isHindi ? 'यूआईडीएआई गेटवे से जुड़ रहा है...' : 'Connecting to UIDAI OTP Gateway...'}</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>{isHindi ? 'आधार ओटीपी भेजें' : 'Send Aadhaar OTP'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      
                      {/* OTP Sent Alert */}
                      <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-md text-xs text-[#138808] flex items-start gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">{isHindi ? 'ओटीपी सफलतापूर्वक भेजा गया' : 'OTP Sent Successfully'}</div>
                          <div className="text-[11px] text-[#0E6006] font-medium mt-0.5">{otpMessage}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-[#002856] mb-1.5">
                          <label htmlFor="otp-input">{isHindi ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}</label>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {isHindi ? '6-अंकीय सुरक्षा कोड' : '6-digit security code'}
                          </span>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <KeyRound className="w-4 h-4 text-[#FF9933]" />
                          </div>
                          
                          <input
                            id="otp-input"
                            type="text"
                            value={otpInput}
                            onChange={(e) => {
                              setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                              setOtpError(null);
                            }}
                            placeholder={isHindi ? "6-अंकीय ओटीपी दर्ज करें" : "Enter 6-digit OTP"}
                            maxLength={6}
                            className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-md text-sm font-mono tracking-widest text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all ${
                              otpError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300'
                            }`}
                            autoFocus
                          />
                        </div>

                        {/* Demo OTP Information Note */}
                        <div className="mt-2 p-2.5 bg-[#FFF8E1] border border-[#FDE68A] rounded-md text-xs text-[#002856] flex items-center justify-between flex-wrap gap-1 shadow-2xs">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                            <span>
                              <strong>Demo OTP: {AUTH_CONFIG.fixedDemoOtp}</strong>
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 italic">
                            For demonstration purposes only.
                          </span>
                        </div>

                        {otpError && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{otpError}</span>
                          </p>
                        )}
                      </div>

                      {/* Resend OTP & Change Aadhaar */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpInput('');
                          }}
                          className="hover:text-[#003D7C] underline font-medium"
                        >
                          {isHindi ? 'आधार संख्या बदलें' : 'Change Aadhaar ID'}
                        </button>

                        {canResend ? (
                          <button
                            type="button"
                            onClick={() => handleSendOtp()}
                            className="text-[#003D7C] font-bold hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isHindi ? 'पुनः ओटीपी भेजें' : 'Resend OTP'}</span>
                          </button>
                        ) : (
                          <span>{isHindi ? 'पुनः भेजें' : 'Resend in'} <strong className="font-mono text-slate-700">{countdown}s</strong></span>
                        )}
                      </div>

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={isVerifyingOtp || otpInput.length < 6}
                        className="w-full py-2.5 px-4 rounded-md text-xs font-bold bg-[#138808] hover:bg-[#0E6006] disabled:opacity-50 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        {isVerifyingOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isHindi ? 'ओटीपी सत्यापित हो रहा है...' : 'Verifying with UIDAI Gateway...'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isHindi ? 'सत्यापित करें व डैशबोर्ड खोलें' : 'Verify & Open Citizen Dashboard'}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. GOVERNMENT OFFICIAL LOGIN FLOW (e-PRAMAAN SSO)                         */}
              {/* ========================================================================= */}
              {authMode === 'official' && (
                <form onSubmit={handleGovLogin} className="space-y-4">
                  
                  {/* Notice Box */}
                  <div className="p-3 bg-[#F0F5FA] border-l-4 border-[#003D7C] rounded-r text-[11px] text-slate-700 leading-relaxed shadow-2xs">
                    <span className="font-bold text-[#002856]">
                      {isHindi ? 'विभागीय राजस्व एकल साइन-ऑन (SSO):' : 'Official Revenue Single Sign-On:'}
                    </span>{' '}
                    {isHindi
                      ? 'अंचल अधिकारी (CO), खंड विकास अधिकारी (BDO) एवं जिला समाहर्ता (DM) हेतु 3-स्तरीय वैधानिक पहुँच।'
                      : 'Role-based statutory access control for Level 1 (BDO), Level 2 (CO), and Level 3 (District Collector).'}
                  </div>

                  {/* One-Click Evaluator Personas */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#003D7C] mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9933]" />
                      <span>{isHindi ? 'त्वरित डेमो प्राधिकारी चयन:' : 'One-Click Demo Personas:'}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickFillOfficial('tehsildar', 'Jharkhand', 'Dumka', 'Dumka Sadar')}
                        className={`p-2 rounded-md text-left border transition-all text-xs ${
                          officialRole === 'tehsildar' && officialState === 'Jharkhand'
                            ? 'bg-[#E1EDF7] border-[#003D7C] text-[#002856] font-bold shadow-2xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Level 2: CO</div>
                        <div className="text-[9px] text-slate-500">Dumka, JH</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickFillOfficial('patwari', 'Jharkhand', 'Dumka', 'Rampur')}
                        className={`p-2 rounded-md text-left border transition-all text-xs ${
                          officialRole === 'patwari'
                            ? 'bg-[#E1EDF7] border-[#003D7C] text-[#002856] font-bold shadow-2xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Level 1: BDO</div>
                        <div className="text-[9px] text-slate-500">Rampur, JH</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickFillOfficial('district_officer', 'Jharkhand', 'Dumka', 'Dumka Sadar')}
                        className={`p-2 rounded-md text-left border transition-all text-xs ${
                          officialRole === 'district_officer'
                            ? 'bg-[#E1EDF7] border-[#003D7C] text-[#002856] font-bold shadow-2xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Level 3: DM</div>
                        <div className="text-[9px] text-slate-500">Collector, JH</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickFillOfficial('tehsildar', 'Bihar', 'Arwal', 'Arwal Sadar')}
                        className={`p-2 rounded-md text-left border transition-all text-xs ${
                          officialState === 'Bihar'
                            ? 'bg-[#E1EDF7] border-[#003D7C] text-[#002856] font-bold shadow-2xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Level 2: CO</div>
                        <div className="text-[9px] text-[#B45309]">Arwal, Bihar</div>
                      </button>
                    </div>
                  </div>

                  {/* Official ID */}
                  <div>
                    <label htmlFor="official-id-input" className="block text-xs font-bold text-[#002856] mb-1">
                      {isHindi ? 'शासकीय कर्मचारी आईडी / ई-मेल' : 'Official Employee ID / Gov Email'}
                    </label>
                    <input
                      id="official-id-input"
                      type="text"
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      placeholder="e.g. tehsildar.dumka@revenue.gov.in"
                      className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all"
                    />
                  </div>

                  {/* Password / e-Pramaan Token */}
                  <div>
                    <label htmlFor="official-password-input" className="block text-xs font-bold text-[#002856] mb-1">
                      {isHindi ? 'ई-प्रमाण सुरक्षा पासवर्ड / टोकन' : 'Security Password / e-Pramaan Token'}
                    </label>
                    <input
                      id="official-password-input"
                      type="password"
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all"
                    />
                  </div>

                  {/* Jurisdiction Selectors */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label htmlFor="state-select" className="block text-[10px] font-semibold text-slate-600 mb-0.5">{isHindi ? 'राज्य' : 'State'}</label>
                      <select
                        id="state-select"
                        value={officialState}
                        onChange={(e) => setOfficialState(e.target.value)}
                        className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all"
                      >
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Bihar">Bihar</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="district-select" className="block text-[10px] font-semibold text-slate-600 mb-0.5">{isHindi ? 'ज़िला' : 'District'}</label>
                      <select
                        id="district-select"
                        value={officialDistrict}
                        onChange={(e) => setOfficialDistrict(e.target.value)}
                        className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all"
                      >
                        {officialState === 'Bihar' ? (
                          <option value="Arwal">Arwal</option>
                        ) : (
                          <option value="Dumka">Dumka</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tehsil-select" className="block text-[10px] font-semibold text-slate-600 mb-0.5">{isHindi ? 'अंचल/प्रखंड' : 'Tehsil'}</label>
                      <select
                        id="tehsil-select"
                        value={officialTehsil}
                        onChange={(e) => setOfficialTehsil(e.target.value)}
                        className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003D7C]/20 focus:border-[#003D7C] transition-all"
                      >
                        {officialState === 'Bihar' ? (
                          <option value="Arwal Sadar">Arwal Sadar</option>
                        ) : (
                          <option value="Dumka Sadar">Dumka Sadar</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {govError && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{govError}</span>
                    </p>
                  )}

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoggingInGov}
                    className="w-full py-2.5 px-4 rounded-md text-xs font-bold bg-[#003D7C] hover:bg-[#002856] disabled:opacity-50 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {isLoggingInGov ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isHindi ? 'ई-प्रमाण एसएसओ द्वारा सत्यापित हो रहा है...' : 'Authenticating via e-Pramaan SSO...'}</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>{isHindi ? 'राजस्व अधिकारी के रूप में लॉगिन करें' : 'Sign In as Government Official'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT 5-COLUMNS: OFFICIAL INSTRUCTIONS & HELPDESK GUIDANCE PANEL         */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Government Guidance Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xl shadow-slate-900/10 p-5 space-y-3.5 ring-1 ring-slate-900/5">
              <div className="flex items-center gap-2 text-[#002856] font-bold text-xs border-b border-slate-200 pb-2.5">
                <HelpCircle className="w-4 h-4 text-[#003D7C]" />
                <span>{isHindi ? 'नागरिक सहायता एवं सुरक्षा निर्देश' : 'Security & Citizen Advisory'}</span>
              </div>

              <ul className="space-y-2.5 text-[11px] text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#138808] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#002856]">{isHindi ? 'ओटीपी सुरक्षा:' : 'OTP Security:'}</strong> {isHindi ? 'अपना 6-अंकीय आधार ओटीपी किसी के साथ साझा न करें। सरकारी अधिकारी कभी ओटीपी नहीं मांगते।' : 'Never share your 6-digit Aadhaar OTP. Revenue officials will never ask for your verification code.'}
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200/80">
                  <FileCheck className="w-3.5 h-3.5 text-[#003D7C] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#002856]">{isHindi ? 'दस्तावेज़ प्रारूप:' : 'Document Formats:'}</strong> {isHindi ? 'पंजीकृत विलेख व खतियान पीडीएफ या जेपीजी प्रारूप में अपलोड किए जा सकते हैं।' : 'Registered deeds and Khatiyan/RoR can be uploaded in PDF or JPG/PNG formats.'}
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200/80">
                  <Globe2 className="w-3.5 h-3.5 text-[#FF9933] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#002856]">{isHindi ? 'डीआईएलआरएमपी 2.0:' : 'DILRMP 2.0:'}</strong> {isHindi ? 'सभी भूमि अभिलेख राष्ट्रीय मानकों के अनुसार सुरक्षित व एनआईसी डेटाबेस से जुड़े हैं।' : 'All land records are cryptographically verified and connected to national cadastral databases.'}
                  </span>
                </li>
              </ul>

              {/* National Helpline Banner */}
              <div className="p-3 bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] border border-[#FDE68A] rounded-lg flex items-center gap-3 text-xs text-[#002856] shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#138808]/15 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-[#138808]" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#002856]">{isHindi ? 'टोल-फ्री राजस्व सहायता केंद्र' : 'National Revenue Helpdesk'}</div>
                  <div className="text-[11px] font-bold text-[#B45309] font-mono">1800-180-1551 (24x7 Toll Free)</div>
                </div>
              </div>
            </div>

            {/* Quick Public Explorer Links */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-lg p-3 text-xs flex items-center justify-between text-[#003D7C] ring-1 ring-slate-900/5">
              <button
                type="button"
                onClick={() => setActiveTab('landing')}
                className="hover:underline font-bold flex items-center gap-1 hover:text-[#002856] transition-colors"
              >
                ← {isHindi ? 'सार्वजनिक होमपेज' : 'Public Portal Home'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('check-document')}
                className="hover:underline font-bold flex items-center gap-1 hover:text-[#002856] transition-colors"
              >
                <span>{isHindi ? '14-अंकीय खोज' : '14-Digit Search'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
