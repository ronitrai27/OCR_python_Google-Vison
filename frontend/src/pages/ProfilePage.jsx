import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import showToast from '../utils/toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Loader2, 
  ArrowLeft,
  Camera,
  Shield,
  Bell,
  Key,
  LogOut,
  Check,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    state: 'Jammu & Kashmir',
    district: '',
    village: '',
    pincode: '',
    fullAddress: '',
  });

  const [farmerData, setFarmerData] = useState({
    totalLandArea: '',
    landUnit: 'kanal',
    primaryCrop: '',
    secondaryCrops: '',
    kisanId: '',
    pmKisanBeneficiary: false,
  });

  // J&K Districts
  const jkDistricts = [
    'Jammu', 'Samba', 'Kathua', 'Udhampur', 'Reasi', 'Rajouri', 'Poonch', 
    'Doda', 'Kishtwar', 'Ramban', 'Srinagar', 'Budgam', 'Anantnag', 
    'Pulwama', 'Shopian', 'Kulgam', 'Baramulla', 'Bandipora', 'Kupwara', 'Ganderbal'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/login');
        return;
      }

      setUser(session.user);
      
      // Get user metadata
      const metadata = session.user.user_metadata || {};
      const farmerProfile = metadata.farmer_profile || {};
      
      setProfileData({
        firstName: metadata.first_name || metadata.full_name?.split(' ')[0] || '',
        lastName: metadata.last_name || metadata.full_name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        phone: farmerProfile.phone || metadata.phone || '',
        alternatePhone: farmerProfile.alternatePhone || '',
        state: 'Jammu & Kashmir',
        district: farmerProfile.district || '',
        village: farmerProfile.village || '',
        pincode: farmerProfile.pincode || '',
        fullAddress: farmerProfile.fullAddress || '',
      });

      setFarmerData({
        totalLandArea: farmerProfile.totalLandArea || '',
        landUnit: farmerProfile.landUnit || 'kanal',
        primaryCrop: farmerProfile.primaryCrop || '',
        secondaryCrops: farmerProfile.secondaryCrops || '',
        kisanId: farmerProfile.kisanId || '',
        pmKisanBeneficiary: farmerProfile.pmKisanBeneficiary || false,
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFarmerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFarmerData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          phone: profileData.phone,
          farmer_profile: {
            ...profileData,
            ...farmerData,
            profile_completed: true,
            updated_at: new Date().toISOString(),
          }
        }
      });

      if (error) throw error;

      showToast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) throw error;
      
      showToast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      showToast.error(error.message || 'Failed to send reset email');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] disabled:bg-neutral-100 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-semibold text-[#292929] mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#292929]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Header */}
      <div className="bg-[#292929] text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-neutral-300 text-sm">Manage your account and preferences</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 sticky top-4">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-[#292929] flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {profileData.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <Camera className="w-4 h-4 text-[#292929]" />
                  </button>
                </div>
                <h3 className="font-semibold text-[#292929] mt-3">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: 'profile', icon: User, label: 'Personal Info' },
                  { id: 'farm', icon: MapPin, label: 'Farm Details' },
                  { id: 'security', icon: Shield, label: 'Security' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-[#292929] text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Info Section */}
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#292929] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      editMode 
                        ? 'bg-neutral-100 text-neutral-600' 
                        : 'bg-[#292929] text-white'
                    }`}
                  >
                    {editMode ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className={`${inputClass} bg-neutral-50`}
                    />
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={profileData.alternatePhone}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value="Jammu & Kashmir"
                      disabled
                      className={`${inputClass} bg-neutral-50`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>District</label>
                    <select
                      name="district"
                      value={profileData.district}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                    >
                      <option value="">Select District</option>
                      {jkDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Village</label>
                    <input
                      type="text"
                      name="village"
                      value={profileData.village}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={profileData.pincode}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      className={inputClass}
                      pattern="[0-9]{6}"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Address</label>
                    <textarea
                      name="fullAddress"
                      value={profileData.fullAddress}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full md:w-auto px-8 py-3 bg-[#292929] text-white rounded-xl font-semibold hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {saving ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                      ) : (
                        <><Save className="w-5 h-5" /> Save Changes</>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Farm Details Section */}
            {activeSection === 'farm' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#292929] flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Farm Details
                  </h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      editMode 
                        ? 'bg-neutral-100 text-neutral-600' 
                        : 'bg-[#292929] text-white'
                    }`}
                  >
                    {editMode ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Total Land Area</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="totalLandArea"
                        value={farmerData.totalLandArea}
                        onChange={handleFarmerChange}
                        disabled={!editMode}
                        step="0.01"
                        className={`${inputClass} flex-1`}
                      />
                      <select
                        name="landUnit"
                        value={farmerData.landUnit}
                        onChange={handleFarmerChange}
                        disabled={!editMode}
                        className={`${inputClass} w-28`}
                      >
                        <option value="kanal">Kanal</option>
                        <option value="marla">Marla</option>
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Primary Crop</label>
                    <input
                      type="text"
                      name="primaryCrop"
                      value={farmerData.primaryCrop}
                      onChange={handleFarmerChange}
                      disabled={!editMode}
                      className={inputClass}
                      placeholder="e.g., Wheat, Rice, Saffron"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Secondary Crops</label>
                    <input
                      type="text"
                      name="secondaryCrops"
                      value={farmerData.secondaryCrops}
                      onChange={handleFarmerChange}
                      disabled={!editMode}
                      className={inputClass}
                      placeholder="e.g., Pulses, Vegetables (comma separated)"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Kisan ID</label>
                    <input
                      type="text"
                      name="kisanId"
                      value={farmerData.kisanId}
                      onChange={handleFarmerChange}
                      disabled={!editMode}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      name="pmKisanBeneficiary"
                      checked={farmerData.pmKisanBeneficiary}
                      onChange={handleFarmerChange}
                      disabled={!editMode}
                      className="w-5 h-5 rounded border-neutral-300"
                    />
                    <label className="text-sm text-[#292929]">
                      I am a PM-KISAN beneficiary
                    </label>
                  </div>
                </div>

                {editMode && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full md:w-auto px-8 py-3 bg-[#292929] text-white rounded-xl font-semibold hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {saving ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                      ) : (
                        <><Save className="w-5 h-5" /> Save Changes</>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                  <h2 className="text-xl font-bold text-[#292929] flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </h2>

                  {/* Change Password */}
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#292929] flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Password
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Send a password reset link to your email
                        </p>
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 bg-[#292929] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm font-medium"
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-[#292929]">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-500">Account Created</span>
                        <p className="font-medium text-[#292929]">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-500">Last Sign In</span>
                        <p className="font-medium text-[#292929]">
                          {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-500">Auth Provider</span>
                        <p className="font-medium text-[#292929] capitalize">
                          {user?.app_metadata?.provider || 'Email'}
                        </p>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-500">Email Verified</span>
                        <p className="font-medium text-[#292929] flex items-center gap-1">
                          {user?.email_confirmed_at ? (
                            <><Check className="w-4 h-4 text-green-600" /> Verified</>
                          ) : (
                            <><X className="w-4 h-4 text-red-600" /> Not Verified</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                  <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
