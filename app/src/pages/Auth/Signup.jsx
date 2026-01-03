import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: signup form, 2: verification code
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [expiryTime, setExpiryTime] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const codeInputRefs = useRef([]);

  // Countdown timer effect
  useEffect(() => {
    if (expiryTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const passwordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return { score, ...levels[Math.min(score, 3)] };
  };

  const strength = passwordStrength();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.sendVerificationCode(email, password, name);
      if (response.success) {
        setStep(2);
        setExpiryTime(Date.now() + (response.data.expiresIn * 1000));
        setCountdown(response.data.expiresIn);
        // Focus first code input
        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
      } else {
        setError(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await authService.sendVerificationCode(email, password, name);
      if (response.success) {
        setExpiryTime(Date.now() + (response.data.expiresIn * 1000));
        setCountdown(response.data.expiresIn);
        setVerificationCode(['', '', '', '', '', '']);
        codeInputRefs.current[0]?.focus();
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...verificationCode];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setVerificationCode(newCode);
      // Focus the appropriate input
      const nextIndex = Math.min(pastedData.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.verifyCode(email, code);
      if (data.user) {
        // Update auth context with the new user
        setUser(data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code');
      setVerificationCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.slice(0, 3)}***@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-animated">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card glass className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-600">Start your journey with us today</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                  >
                    <AlertCircle className="text-red-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSendVerificationCode} className="space-y-6">
                  <Input
                    label="Full Name"
                    type="text"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  <div>
                    <Input
                      label="Password"
                      type="password"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-semibold ${strength.score >= 3 ? 'text-green-600' : 'text-gray-600'}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength.score ? strength.color : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button type="submit" variant="primary" className="w-full" loading={loading}>
                    Continue
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                      Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5 mr-2" />
                      Facebook
                    </button>
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                    Sign in instead
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="verification-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-gray-600">
                    We've sent a 6-digit code to<br />
                    <span className="font-semibold text-gray-900">{maskEmail(email)}</span>
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                  >
                    <AlertCircle className="text-red-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Code input boxes */}
                  <div className="flex justify-center gap-3">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (codeInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={handleCodePaste}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-600">
                        Code expires in{' '}
                        <span className="font-semibold text-primary-600">{formatTime(countdown)}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-semibold">
                        Code has expired
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleVerifyCode}
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    disabled={verificationCode.join('').length !== 6 || countdown === 0}
                  >
                    <CheckCircle2 size={20} className="mr-2" />
                    Verify & Create Account
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <button
                      onClick={handleResendCode}
                      disabled={resendLoading}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} className="mr-2" />
                          Resend Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
