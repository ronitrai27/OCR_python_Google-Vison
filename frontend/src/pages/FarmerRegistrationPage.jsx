import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import showToast from '../utils/toast';
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Loader2, 
  CheckCircle,
  ArrowRight,
  Tractor,
  Wheat,
  Home,
  Globe
} from 'lucide-react';

// Translations for English and Urdu
const translations = {
  en: {
    // Header
    farmerRegistration: 'Farmer Registration',
    completeProfile: 'Complete your profile for AgriStack services',
    
    // Steps
    personalDetails: 'Personal Details',
    address: 'Address',
    landDetails: 'Land Details',
    documents: 'Documents',
    
    // Personal Details
    fullName: 'Full Name (as per Aadhaar)',
    enterFullName: 'Enter your full name',
    fatherName: "Father's Name",
    enterFatherName: "Enter father's name",
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    selectGender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    mobileNumber: 'Mobile Number',
    mobileDigits: '10-digit mobile number',
    alternateMobile: 'Alternate Mobile Number',
    
    // Address Details
    addressDetails: 'Address Details',
    state: 'State',
    selectState: 'Select State',
    district: 'District',
    selectDistrict: 'Select District',
    blockTehsil: 'Block/Tehsil',
    enterBlock: 'Enter block/tehsil',
    village: 'Village',
    enterVillage: 'Enter village name',
    pincode: 'Pincode',
    pincodeDigits: '6-digit pincode',
    fullAddress: 'Full Address',
    enterFullAddress: 'Enter complete address',
    
    // Land Details
    landAgricultural: 'Land & Agricultural Details',
    totalLandArea: 'Total Land Area',
    enterArea: 'Enter area',
    acres: 'Acres',
    hectares: 'Hectares',
    bigha: 'Bigha',
    kanal: 'Kanal',
    marla: 'Marla',
    irrigationType: 'Irrigation Type',
    selectType: 'Select Type',
    rainfed: 'Rainfed',
    canal: 'Canal',
    tubewell: 'Tubewell',
    well: 'Well',
    dripIrrigation: 'Drip Irrigation',
    sprinkler: 'Sprinkler',
    mixed: 'Mixed',
    soilType: 'Soil Type',
    selectSoilType: 'Select Soil Type',
    alluvial: 'Alluvial',
    black: 'Black (Regur)',
    redSoil: 'Red Soil',
    laterite: 'Laterite',
    sandy: 'Sandy',
    clay: 'Clay',
    loamy: 'Loamy',
    primaryCrop: 'Primary Crop',
    primaryCropPlaceholder: 'e.g., Wheat, Rice, Saffron',
    secondaryCrops: 'Secondary Crops',
    secondaryCropsPlaceholder: 'e.g., Pulses, Vegetables, Fruits (comma separated)',
    
    // Documents
    identityBank: 'Identity & Bank Details',
    aadhaarNumber: 'Aadhaar Number',
    aadhaarDigits: '12-digit Aadhaar number',
    panNumber: 'PAN Number',
    panPlaceholder: 'e.g., ABCDE1234F',
    bankAccountNumber: 'Bank Account Number',
    enterAccountNumber: 'Enter account number',
    ifscCode: 'IFSC Code',
    ifscPlaceholder: 'e.g., SBIN0001234',
    bankName: 'Bank Name',
    enterBankName: 'Enter bank name',
    kisanId: 'Kisan ID (if available)',
    enterKisanId: 'Enter Kisan ID',
    soilHealthCard: 'Soil Health Card Number',
    enterCardNumber: 'Enter card number',
    pmKisanBeneficiary: 'I am a PM-KISAN beneficiary',
    
    // Navigation
    previous: 'Previous',
    next: 'Next',
    saving: 'Saving...',
    completeRegistration: 'Complete Registration',
    skipForNow: 'Skip for now and complete later',
    
    // Language
    language: 'Language',
    english: 'English',
    urdu: 'اردو'
  },
  ur: {
    // Header
    farmerRegistration: 'کسان رجسٹریشن',
    completeProfile: 'ایگری اسٹیک خدمات کے لیے اپنا پروفائل مکمل کریں',
    
    // Steps
    personalDetails: 'ذاتی تفصیلات',
    address: 'پتہ',
    landDetails: 'زمین کی تفصیلات',
    documents: 'دستاویزات',
    
    // Personal Details
    fullName: 'پورا نام (آدھار کے مطابق)',
    enterFullName: 'اپنا پورا نام درج کریں',
    fatherName: 'والد کا نام',
    enterFatherName: 'والد کا نام درج کریں',
    dateOfBirth: 'تاریخ پیدائش',
    gender: 'جنس',
    selectGender: 'جنس منتخب کریں',
    male: 'مرد',
    female: 'عورت',
    other: 'دیگر',
    mobileNumber: 'موبائل نمبر',
    mobileDigits: '10 ہندسوں کا موبائل نمبر',
    alternateMobile: 'متبادل موبائل نمبر',
    
    // Address Details
    addressDetails: 'پتے کی تفصیلات',
    state: 'ریاست',
    selectState: 'ریاست منتخب کریں',
    district: 'ضلع',
    selectDistrict: 'ضلع منتخب کریں',
    blockTehsil: 'بلاک/تحصیل',
    enterBlock: 'بلاک/تحصیل درج کریں',
    village: 'گاؤں',
    enterVillage: 'گاؤں کا نام درج کریں',
    pincode: 'پن کوڈ',
    pincodeDigits: '6 ہندسوں کا پن کوڈ',
    fullAddress: 'مکمل پتہ',
    enterFullAddress: 'مکمل پتہ درج کریں',
    
    // Land Details
    landAgricultural: 'زمین اور زرعی تفصیلات',
    totalLandArea: 'کل زمین کا رقبہ',
    enterArea: 'رقبہ درج کریں',
    acres: 'ایکڑ',
    hectares: 'ہیکٹر',
    bigha: 'بیگھہ',
    kanal: 'کنال',
    marla: 'مرلہ',
    irrigationType: 'آبپاشی کی قسم',
    selectType: 'قسم منتخب کریں',
    rainfed: 'بارانی',
    canal: 'نہر',
    tubewell: 'ٹیوب ویل',
    well: 'کنواں',
    dripIrrigation: 'قطرہ آبپاشی',
    sprinkler: 'اسپرنکلر',
    mixed: 'مخلوط',
    soilType: 'مٹی کی قسم',
    selectSoilType: 'مٹی کی قسم منتخب کریں',
    alluvial: 'نقطی',
    black: 'کالی مٹی',
    redSoil: 'سرخ مٹی',
    laterite: 'لیٹرائٹ',
    sandy: 'ریتلی',
    clay: 'چکنی مٹی',
    loamy: 'دومٹ',
    primaryCrop: 'بنیادی فصل',
    primaryCropPlaceholder: 'مثلاً گندم، چاول، زعفران',
    secondaryCrops: 'ثانوی فصلیں',
    secondaryCropsPlaceholder: 'مثلاً دالیں، سبزیاں، پھل (کوما سے الگ کریں)',
    
    // Documents
    identityBank: 'شناخت اور بینک کی تفصیلات',
    aadhaarNumber: 'آدھار نمبر',
    aadhaarDigits: '12 ہندسوں کا آدھار نمبر',
    panNumber: 'پین نمبر',
    panPlaceholder: 'مثلاً ABCDE1234F',
    bankAccountNumber: 'بینک اکاؤنٹ نمبر',
    enterAccountNumber: 'اکاؤنٹ نمبر درج کریں',
    ifscCode: 'آئی ایف ایس سی کوڈ',
    ifscPlaceholder: 'مثلاً SBIN0001234',
    bankName: 'بینک کا نام',
    enterBankName: 'بینک کا نام درج کریں',
    kisanId: 'کسان آئی ڈی (اگر دستیاب ہو)',
    enterKisanId: 'کسان آئی ڈی درج کریں',
    soilHealthCard: 'مٹی صحت کارڈ نمبر',
    enterCardNumber: 'کارڈ نمبر درج کریں',
    pmKisanBeneficiary: 'میں پی ایم کسان کا مستفید ہوں',
    
    // Navigation
    previous: 'پچھلا',
    next: 'اگلا',
    saving: 'محفوظ ہو رہا ہے...',
    completeRegistration: 'رجسٹریشن مکمل کریں',
    skipForNow: 'ابھی چھوڑیں اور بعد میں مکمل کریں',
    
    // Language
    language: 'زبان',
    english: 'English',
    urdu: 'اردو'
  }
};

// All districts of Jammu & Kashmir (Union Territory)
const jkDistricts = [
  // Jammu Division
  { name: 'Jammu', nameUrdu: 'جموں' },
  { name: 'Samba', nameUrdu: 'سامبہ' },
  { name: 'Kathua', nameUrdu: 'کٹھوعہ' },
  { name: 'Udhampur', nameUrdu: 'اودھم پور' },
  { name: 'Reasi', nameUrdu: 'ریاسی' },
  { name: 'Rajouri', nameUrdu: 'راجوری' },
  { name: 'Poonch', nameUrdu: 'پونچھ' },
  { name: 'Doda', nameUrdu: 'ڈوڈہ' },
  { name: 'Kishtwar', nameUrdu: 'کشتواڑ' },
  { name: 'Ramban', nameUrdu: 'رامبن' },
  // Kashmir Division
  { name: 'Srinagar', nameUrdu: 'سرینگر' },
  { name: 'Budgam', nameUrdu: 'بڈگام' },
  { name: 'Anantnag', nameUrdu: 'اننت ناگ' },
  { name: 'Pulwama', nameUrdu: 'پلوامہ' },
  { name: 'Shopian', nameUrdu: 'شوپیاں' },
  { name: 'Kulgam', nameUrdu: 'کلگام' },
  { name: 'Baramulla', nameUrdu: 'بارہمولہ' },
  { name: 'Bandipora', nameUrdu: 'بانڈی پورہ' },
  { name: 'Kupwara', nameUrdu: 'کپواڑہ' },
  { name: 'Ganderbal', nameUrdu: 'گاندربل' },
];

const FarmerRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'ur' for Urdu
  
  // Get current translations
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    alternatePhone: '',
    
    // Address Details
    state: 'Jammu & Kashmir',
    district: '',
    block: '',
    village: '',
    pincode: '',
    fullAddress: '',
    
    // Land Details
    totalLandArea: '',
    landUnit: 'kanal',
    irrigationType: '',
    soilType: '',
    primaryCrop: '',
    secondaryCrops: '',
    
    // Identity Documents
    aadhaarNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
    
    // Farm Registration
    kisanId: '',
    pmKisanBeneficiary: false,
    soilHealthCard: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        // Pre-fill name from Google auth if available
        if (session.user.user_metadata?.full_name) {
          setFormData(prev => ({
            ...prev,
            fullName: session.user.user_metadata.full_name || ''
          }));
        }
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, always save to user metadata for profile completion tracking
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          farmer_profile: {
            ...formData,
            profile_completed: true,
            updated_at: new Date().toISOString(),
          }
        }
      });

      if (metaError) throw metaError;

      // Optionally try to save to farmer_profiles table if it exists
      try {
        await supabase
          .from('farmer_profiles')
          .upsert({
            user_id: user.id,
            ...formData,
            profile_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      } catch (tableError) {
        // Table might not exist, that's ok - we have user metadata
        console.log('farmer_profiles table not available, using metadata');
      }

      // Show success toast and redirect to dashboard
      showToast.success('Registration completed! Welcome to AgriStack 🌾');
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile save failed:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
      showToast.error(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const steps = [
    { number: 1, title: t.personalDetails, icon: User },
    { number: 2, title: t.address, icon: MapPin },
    { number: 3, title: t.landDetails, icon: Wheat },
    { number: 4, title: t.documents, icon: FileText },
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] ${language === 'ur' ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-semibold text-[#292929] mb-2 ${language === 'ur' ? 'text-right' : 'text-left'}`;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 ${language === 'ur' ? 'rtl' : 'ltr'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#292929] text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Tractor className="w-8 h-8" />
              <h1 className="text-2xl font-bold">{t.farmerRegistration}</h1>
            </div>
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>
          <p className="text-neutral-300">{t.completeProfile}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-neutral-200 py-4 px-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentStep >= step.number ? 1 : 0.8,
                      backgroundColor: currentStep >= step.number ? '#292929' : '#e5e5e5'
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`text-xs mt-1 hidden sm:block ${currentStep >= step.number ? 'text-[#292929] font-medium' : 'text-neutral-400'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${currentStep > step.number ? 'bg-[#292929]' : 'bg-neutral-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 sm:p-8"
          >
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className={`text-xl font-bold text-[#292929] mb-6 flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                  <User className="w-5 h-5" />
                  {t.personalDetails}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t.fullName} *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterFullName}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fatherName} *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterFatherName}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.dateOfBirth} *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.gender} *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t.selectGender}</option>
                      <option value="male">{t.male}</option>
                      <option value="female">{t.female}</option>
                      <option value="other">{t.other}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.mobileNumber} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className={inputClass}
                      placeholder={t.mobileDigits}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.alternateMobile}</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      className={inputClass}
                      placeholder={t.mobileDigits}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className={`text-xl font-bold text-[#292929] mb-6 flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-5 h-5" />
                  {t.addressDetails}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t.state} *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      disabled
                    >
                      <option value="Jammu & Kashmir">{language === 'ur' ? 'جموں و کشمیر' : 'Jammu & Kashmir'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.district} *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t.selectDistrict}</option>
                      {jkDistricts.map(district => (
                        <option key={district.name} value={district.name}>
                          {language === 'ur' ? district.nameUrdu : district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.blockTehsil} *</label>
                    <input
                      type="text"
                      name="block"
                      value={formData.block}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterBlock}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.village} *</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterVillage}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.pincode} *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      className={inputClass}
                      placeholder={t.pincodeDigits}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{t.fullAddress} *</label>
                    <textarea
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className={inputClass}
                      placeholder={t.enterFullAddress}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Land Details */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className={`text-xl font-bold text-[#292929] mb-6 flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                  <Wheat className="w-5 h-5" />
                  {t.landAgricultural}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t.totalLandArea} *</label>
                    <div className={`flex gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="number"
                        name="totalLandArea"
                        value={formData.totalLandArea}
                        onChange={handleChange}
                        required
                        step="0.01"
                        className={`${inputClass} flex-1`}
                        placeholder={t.enterArea}
                      />
                      <select
                        name="landUnit"
                        value={formData.landUnit}
                        onChange={handleChange}
                        className={`${inputClass} w-28`}
                      >
                        <option value="kanal">{t.kanal}</option>
                        <option value="marla">{t.marla}</option>
                        <option value="acres">{t.acres}</option>
                        <option value="hectares">{t.hectares}</option>
                        <option value="bigha">{t.bigha}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.irrigationType} *</label>
                    <select
                      name="irrigationType"
                      value={formData.irrigationType}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t.selectType}</option>
                      <option value="rainfed">{t.rainfed}</option>
                      <option value="canal">{t.canal}</option>
                      <option value="tubewell">{t.tubewell}</option>
                      <option value="well">{t.well}</option>
                      <option value="drip">{t.dripIrrigation}</option>
                      <option value="sprinkler">{t.sprinkler}</option>
                      <option value="mixed">{t.mixed}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.soilType}</label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">{t.selectSoilType}</option>
                      <option value="alluvial">{t.alluvial}</option>
                      <option value="black">{t.black}</option>
                      <option value="red">{t.redSoil}</option>
                      <option value="laterite">{t.laterite}</option>
                      <option value="sandy">{t.sandy}</option>
                      <option value="clay">{t.clay}</option>
                      <option value="loamy">{t.loamy}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.primaryCrop} *</label>
                    <input
                      type="text"
                      name="primaryCrop"
                      value={formData.primaryCrop}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.primaryCropPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{t.secondaryCrops}</label>
                    <input
                      type="text"
                      name="secondaryCrops"
                      value={formData.secondaryCrops}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={t.secondaryCropsPlaceholder}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className={`text-xl font-bold text-[#292929] mb-6 flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                  <FileText className="w-5 h-5" />
                  {t.identityBank}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t.aadhaarNumber} *</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{12}"
                      className={inputClass}
                      placeholder={t.aadhaarDigits}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.panNumber}</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      className={inputClass}
                      placeholder={t.panPlaceholder}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.bankAccountNumber} *</label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterAccountNumber}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.ifscCode} *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      required
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                      className={inputClass}
                      placeholder={t.ifscPlaceholder}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.bankName} *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.enterBankName}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.kisanId}</label>
                    <input
                      type="text"
                      name="kisanId"
                      value={formData.kisanId}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={t.enterKisanId}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.soilHealthCard}</label>
                    <input
                      type="text"
                      name="soilHealthCard"
                      value={formData.soilHealthCard}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={t.enterCardNumber}
                    />
                  </div>
                  <div className={`flex items-center gap-3 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="checkbox"
                      name="pmKisanBeneficiary"
                      checked={formData.pmKisanBeneficiary}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-neutral-300 text-[#292929] focus:ring-[#292929]"
                    />
                    <label className="text-sm text-[#292929]">
                      {t.pmKisanBeneficiary}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex justify-between mt-8 pt-6 border-t border-neutral-200 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border-2 border-neutral-200 text-[#292929] font-semibold hover:bg-neutral-50 transition-all"
                >
                  {t.previous}
                </button>
              ) : (
                <div />
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-6 py-3 rounded-xl bg-[#292929] text-white font-semibold hover:bg-[#1a1a1a] transition-all flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}
                >
                  {t.next}
                  <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-70 ${language === 'ur' ? 'flex-row-reverse' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {t.completeRegistration}
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </form>

        {/* Skip for now option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-neutral-500 hover:text-[#292929] text-sm underline"
          >
            {t.skipForNow}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistrationPage;
