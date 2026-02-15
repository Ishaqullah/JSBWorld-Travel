import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { Save, User, Lock, Mail, Phone } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await authService.updateProfile(profileData);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters');
        }

        setPasswordLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="card">
                    <div className="card-header border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User size={20} className="text-primary-600" />
                            Profile Information
                        </h2>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Email Address (Read-only)</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="input pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    value={user?.email || ''}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    className="input pl-10"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    className="input pl-10"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                                disabled={profileLoading}
                            >
                                {profileLoading ? <div className="spinner-sm"></div> : <Save size={18} />}
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="card">
                    <div className="card-header border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Lock size={20} className="text-primary-600" />
                            Security Settings
                        </h2>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Current Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="input pl-10"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="input pl-10"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input pl-10"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? <div className="spinner-sm"></div> : <Save size={18} />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
