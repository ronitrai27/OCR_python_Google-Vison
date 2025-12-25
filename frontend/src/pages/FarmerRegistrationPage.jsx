import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Home
} from 'lucide-react';

const FarmerRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    alternatePhone: '',
    
    // Address Details
    state: '',
    district: '',
    block: '',
    village: '',
    pincode: '',
    fullAddress: '',
    
    // Land Details
    totalLandArea: '',
    landUnit: 'acres',
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
      // Save farmer profile to Supabase
      const { error: profileError } = await supabase
        .from('farmer_profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          profile_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        // If table doesn't exist, save to user metadata instead
        const { error: metaError } = await supabase.auth.updateUser({
          data: {
            farmer_profile: formData,
            profile_completed: true,
          }
        });

        if (metaError) throw metaError;
      }

      // Show success toast and redirect to home page
      showToast.success('Registration completed! Welcome to AgriStack 🌾');
      navigate('/');
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

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Land Details', icon: Wheat },
    { number: 4, title: 'Documents', icon: FileText },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929]";
  const labelClass = "block text-sm font-semibold text-[#292929] mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-[#292929] text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Tractor className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Farmer Registration</h1>
          </div>
          <p className="text-neutral-300">Complete your profile for AgriStack services</p>
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
                <h2 className="text-xl font-bold text-[#292929] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name (as per Aadhaar) *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Father's Name *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
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
                    <label className={labelClass}>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className={inputClass}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Alternate Mobile Number</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      className={inputClass}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#292929] mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>District *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Block/Tehsil *</label>
                    <input
                      type="text"
                      name="block"
                      value={formData.block}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter block/tehsil"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Village *</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter village name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      className={inputClass}
                      placeholder="6-digit pincode"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Address *</label>
                    <textarea
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className={inputClass}
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Land Details */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#292929] mb-6 flex items-center gap-2">
                  <Wheat className="w-5 h-5" />
                  Land & Agricultural Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Total Land Area *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="totalLandArea"
                        value={formData.totalLandArea}
                        onChange={handleChange}
                        required
                        step="0.01"
                        className={`${inputClass} flex-1`}
                        placeholder="Enter area"
                      />
                      <select
                        name="landUnit"
                        value={formData.landUnit}
                        onChange={handleChange}
                        className={`${inputClass} w-28`}
                      >
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                        <option value="bigha">Bigha</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Irrigation Type *</label>
                    <select
                      name="irrigationType"
                      value={formData.irrigationType}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select Type</option>
                      <option value="rainfed">Rainfed</option>
                      <option value="canal">Canal</option>
                      <option value="tubewell">Tubewell</option>
                      <option value="well">Well</option>
                      <option value="drip">Drip Irrigation</option>
                      <option value="sprinkler">Sprinkler</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Soil Type</label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Soil Type</option>
                      <option value="alluvial">Alluvial</option>
                      <option value="black">Black (Regur)</option>
                      <option value="red">Red Soil</option>
                      <option value="laterite">Laterite</option>
                      <option value="sandy">Sandy</option>
                      <option value="clay">Clay</option>
                      <option value="loamy">Loamy</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Primary Crop *</label>
                    <input
                      type="text"
                      name="primaryCrop"
                      value={formData.primaryCrop}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="e.g., Wheat, Rice, Cotton"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Secondary Crops</label>
                    <input
                      type="text"
                      name="secondaryCrops"
                      value={formData.secondaryCrops}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g., Pulses, Vegetables, Fruits (comma separated)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#292929] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Identity & Bank Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Aadhaar Number *</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{12}"
                      className={inputClass}
                      placeholder="12-digit Aadhaar number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      className={inputClass}
                      placeholder="e.g., ABCDE1234F"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bank Account Number *</label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>IFSC Code *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      required
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                      className={inputClass}
                      placeholder="e.g., SBIN0001234"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Kisan ID (if available)</label>
                    <input
                      type="text"
                      name="kisanId"
                      value={formData.kisanId}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter Kisan ID"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Soil Health Card Number</label>
                    <input
                      type="text"
                      name="soilHealthCard"
                      value={formData.soilHealthCard}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter card number"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="pmKisanBeneficiary"
                      checked={formData.pmKisanBeneficiary}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-neutral-300 text-[#292929] focus:ring-[#292929]"
                    />
                    <label className="text-sm text-[#292929]">
                      I am a PM-KISAN beneficiary
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border-2 border-neutral-200 text-[#292929] font-semibold hover:bg-neutral-50 transition-all"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl bg-[#292929] text-white font-semibold hover:bg-[#1a1a1a] transition-all flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Complete Registration
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
            Skip for now and complete later
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistrationPage;
