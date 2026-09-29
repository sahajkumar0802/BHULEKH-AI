import React from 'react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem, DigitalIndiaEmblem, SihBadge, TricolorRibbon } from '../common/Emblems';
import {
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Globe,
  Award
} from 'lucide-react';

export const GovFooter: React.FC = () => {
  const { govLanguage, setActiveTab } = useApp();
  const isHindi = govLanguage === 'hi';

  return (
    <footer className="bg-[#001A3A] text-[#C2DCF0] text-xs border-t-2 border-[#003D7C] select-none mt-auto">
      {/* Tricolor Ribbon Top Accent */}
      <TricolorRibbon />

      {/* Main 4-Column Government Sitemap Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#0B3B60]">
          
          {/* COLUMN 1: About Portal & DILRMP */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AshokaEmblem className="h-7 w-auto fill-white" size={28} />
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                  BHULEKH AI
                </h3>
                <p className="text-[10px] text-[#8FBFE4] mt-0.5">
                  {isHindi ? 'राष्ट्रीय भूमि अभिलेख डिजिटलीकरण' : 'National Land Digitization Portal'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              {isHindi
                ? 'डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण कार्यक्रम (DILRMP) के अंतर्गत भूमि अभिलेखों के डिजिटलीकरण, 3-स्तरीय वैधानिक राजस्व सत्यापन एवं बहु-स्रोत विसंगति निवारण हेतु आधिकारिक राष्ट्रीय पोर्टल।'
                : 'National intelligence and cross-record validation system under the Digital India Land Records Modernization Programme (DILRMP), supporting 3-stage statutory revenue verification.'}
            </p>

            <div className="pt-2">
              <SihBadge className="bg-[#002856] text-white border-[#005FA8]" />
            </div>
          </div>

          {/* COLUMN 2: Related National Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#0B3B60] pb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{isHindi ? 'संबंधित राष्ट्रीय पोर्टल' : 'Related National Portals'}</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a 
                  href="https://dilrmp.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#8FBFE4]" />
                  <span>DILRMP (MoRD)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://ngdrs.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#8FBFE4]" />
                  <span>NGDRS (National Deed Registry)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://uidai.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#8FBFE4]" />
                  <span>UIDAI (Aadhaar Services)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://services.ecourts.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#8FBFE4]" />
                  <span>e-Courts National Case Management</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://bhunaksha.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#8FBFE4]" />
                  <span>Bhu-Naksha Cadastral GIS</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Citizen Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#0B3B60] pb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#138808]" />
              <span>{isHindi ? 'नागरिक एवं राजस्व सेवाएं' : 'Citizen & Revenue Services'}</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button 
                  onClick={() => setActiveTab('user-dashboard')}
                  className="hover:text-white hover:underline text-left transition-colors"
                >
                  • {isHindi ? 'नागरिक भूमि लॉकर (Citizen Dashboard)' : 'Citizen Land Locker Dashboard'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('upload-document')}
                  className="hover:text-white hover:underline text-left transition-colors"
                >
                  • {isHindi ? 'दस्तावेज़ अपलोड व एआई सत्यापन' : 'Upload Sale Deed / Khatiyan'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('check-document')}
                  className="hover:text-white hover:underline text-left transition-colors"
                >
                  • {isHindi ? '14-अंकीय भू-आधार (ULPIN) खोज' : '14-Digit ULPIN Record Search'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('track-progress')}
                  className="hover:text-white hover:underline text-left transition-colors"
                >
                  • {isHindi ? '3-स्तरीय सत्यापन स्थिति एवं अपील' : 'Track 3-Stage Verification & Appeals'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('official-dashboard')}
                  className="hover:text-white hover:underline text-left transition-colors"
                >
                  • {isHindi ? 'राजस्व अधिकारी पोर्टल (BDO / CO / DC)' : 'Revenue Officer Portal (RBAC)'}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Helpdesk, Policies & Ministry Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#0B3B60] pb-1.5 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{isHindi ? 'सहायता एवं संपर्क' : 'Help & Support'}</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF9933] shrink-0 mt-0.5" />
                <span className="text-[#94A3B8]">
                  Department of Land Resources, NBO Building, Nirman Bhawan, New Delhi - 110011
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                <span>Helpline: <strong>1800-180-1551 (Toll Free)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#8FBFE4] shrink-0" />
                <span>support.bhulekh-ai@gov.in</span>
              </div>
            </div>

            {/* Official Policy Links */}
            <div className="pt-2 border-t border-[#0B3B60] flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#8FBFE4]">
              <span className="hover:text-white cursor-pointer">{isHindi ? 'वेबसाइट नीतियां' : 'Website Policies'}</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">{isHindi ? 'नियम व शर्तें' : 'Terms of Use'}</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">{isHindi ? 'अभिगम्यता विवरण' : 'Accessibility'}</span>
            </div>
          </div>

        </div>

        {/* SIH 2026 Problem Statement PS-18 Prototype Banner */}
        <div className="py-4 my-4 px-4 bg-[#002856] rounded border border-[#0B4F8A] flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#FF9933] shrink-0" />
            <div>
              <span className="font-bold text-white">Smart India Hackathon (SIH 2026) Prototype</span>
              <p className="text-[#94A3B8] text-[10px]">
                Developed for Problem Statement PS-18: Intelligent Land Record Digitization, Cross-Record Validation &amp; Geospatial Intelligence System.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <DigitalIndiaEmblem />
          </div>
        </div>

        {/* Bottom Copyright & NIC Hosting Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
          <div>
            © 2026 {isHindi ? 'भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय, भारत सरकार। सर्वाधिकार सुरक्षित।' : 'Department of Land Resources, Ministry of Rural Development, Government of India. All Rights Reserved.'}
          </div>
          <div className="text-right">
            <span>{isHindi ? 'अंतिम अद्यतन: 15 सितंबर 2026' : 'Last Updated: 15 September 2026'} | Designed &amp; Maintained by <strong>NIC / BHULEKH AI Team</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
