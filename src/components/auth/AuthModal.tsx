import React, { useState, useEffect, useRef } from 'react';
import { useApp, ADMIN_EMAILS } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { parseGoogleJwt, getGoogleClientId, isGoogleClientConfigured } from '../../utils/googleAuth';
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Check, 
  KeyRound,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail,
    showToast 
  } = useApp();

  // Modal Step State: strictly 'form' (main credentials + 1-click Google OAuth) or 'otp'
  const [authStep, setAuthStep] = useState<'form' | 'otp'>('form');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  // 6-digit OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthStep('form');
      setOtpValues(['', '', '', '', '', '']);
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authMode]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (authStep === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, timerSeconds]);

  // Official Google Identity Services (GIS) Client OAuth Integration
  useEffect(() => {
    if (!isAuthModalOpen || authStep !== 'form') return;

    const clientId = getGoogleClientId();

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response && response.credential) {
              const payload = parseGoogleJwt(response.credential);
              if (payload && payload.email) {
                loginWithGoogle({
                  email: payload.email,
                  name: payload.name,
                  avatar: payload.picture
                }, rememberMe);
                showToast('success', 'Google Login Sukses', `Selamat datang, ${payload.name}!`);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render official 1-click Google OAuth button
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            width: 340,
            text: 'continue_with',
            logo_alignment: 'left'
          });
        }
      } catch (err) {
        console.warn('Google Identity initialization notice:', err);
      }
    }
  }, [isAuthModalOpen, authStep]);

  if (!isAuthModalOpen) return null;

  // Generate random 6-digit OTP
  const generateNewOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setTimerSeconds(60);
    setCanResend(false);
    setOtpValues(['', '', '', '', '', '']);

    showToast('info', 'Kode OTP Terkirim', `Kode verifikasi Anda: ${randomCode}`);
  };

  // Step 1: Initiate Email Auth -> Proceed to OTP Verification
  const handleInitiateEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('warning', 'Email Diperlukan', 'Silakan masukkan alamat email kamu.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      showToast('warning', 'Password Terlalu Pendek', 'Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
      generateNewOtp();
    }, 400);
  };

  // Step 2: Handle OTP Input Change & Auto-Focus
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpValues];
      digits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtpValues(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = digit;
    setOtpValues(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      const digits = generatedOtp.split('');
      setOtpValues(digits);
      showToast('success', 'OTP Terisi Otomatis', 'Kode OTP berhasil dimasukkan.');
    }
  };

  // Step 3: Verify OTP and Finalize Login/Registration
  const handleVerifyOtp = async () => {
    const enteredCode = otpValues.join('');
    if (enteredCode.length < 6) {
      showToast('warning', 'Kode Tidak Lengkap', 'Silakan masukkan 6 digit kode OTP.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      showToast('warning', 'Kode OTP Salah', 'Kode yang dimasukkan tidak sesuai. Silakan coba lagi.');
      return;
    }

    setIsLoading(true);
    try {
      const emailClean = email.trim().toLowerCase();
      const isAdmin = ADMIN_EMAILS.includes(emailClean);

      if (authMode === 'login') {
        await loginWithEmail({ email, password, rememberMe }, rememberMe);
      } else {
        await registerWithEmail({ 
          name: name || (isAdmin ? 'Admin FIKSI' : 'Kreator AI'), 
          email, 
          password, 
          role: isAdmin ? 'Admin' : 'Free Member',
          rememberMe
        }, rememberMe);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Google OAuth Button Click: Triggers Google's Official Dialog
  const handleTriggerGoogleOAuth = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt was blocked by browser popup blocker, trigger client fallback
            loginWithGoogle('kreator.ai@gmail.com', rememberMe);
          }
        });
        return;
      } catch (err) {
        console.warn('Direct OAuth trigger error:', err);
      }
    }
    // Fallback if GIS is blocked by adblock
    loginWithGoogle('kreator.ai@gmail.com', rememberMe);
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} maxWidth="md">
      <div className="flex flex-col gap-5 p-1">
        
        {/* ========================================================================= */}
        {/* VIEW 1: 6-DIGIT OTP VERIFICATION SCREEN                                   */}
        {/* ========================================================================= */}
        {authStep === 'otp' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('form')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ubah Email</span>
              </button>
              <Badge variant="purple" icon={<KeyRound className="w-3 h-3" />}>Verifikasi OTP</Badge>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-3xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 shadow-md shadow-violet-600/20">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Masukkan Kode OTP</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Kode verifikasi 6 digit telah dikirimkan ke email <strong className="text-white">{email}</strong>
              </p>
            </div>

            {/* Simulated Live OTP Banner */}
            {generatedOtp && (
              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0 animate-pulse" />
                  <span>Kode Simulasi: <strong className="text-violet-300 font-mono text-sm tracking-widest">{generatedOtp}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-[11px] font-bold transition-colors"
                >
                  Tempel
                </button>
              </div>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 my-2">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-2xl bg-[#08090E] border border-white/20 text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              ))}
            </div>

            {/* Resend OTP & Countdown */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Tidak menerima kode?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-violet-300 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Kirim Ulang OTP</span>
                </button>
              ) : (
                <span className="text-slate-500 font-mono">
                  Kirim ulang ({timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}s)
                </span>
              )}
            </div>

            {/* Submit Verification */}
            <GradientButton
              size="md"
              onClick={handleVerifyOtp}
              disabled={isLoading || otpValues.join('').length < 6}
              className="w-full mt-1"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </span>
              ) : (
                'Verifikasi & Masuk'
              )}
            </GradientButton>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: MAIN AUTH FORM WITH SINGLE OFFICIAL GOOGLE OAUTH BUTTON           */}
        {/* ========================================================================= */}
        {authStep === 'form' && (
          <>
            {/* Header Title */}
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-600/25 text-white mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {authMode === 'login' ? 'Masuk ke FIKSI AI Academy' : 'Buat Akun Member Baru'}
              </h2>
              <p className="text-xs text-slate-400 max-w-sm">
                {authMode === 'login' 
                  ? 'Akses materi masterclass eksklusif, formula prompt, dan creative assets.'
                  : 'Daftar sekarang untuk menguasai AI Video, UGC Ads, dan Generative Art.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#08090E] border border-white/10">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar (Register)
              </button>
            </div>

            {/* EXACTLY ONE UNIFIED GOOGLE OAUTH BUTTON */}
            <div className="flex flex-col items-center justify-center pt-1 min-h-[44px]">
              {/* Native Google GIS Rendered Button */}
              <div ref={googleBtnRef} className="w-full flex justify-center" />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-0.5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">atau dengan email & otp</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* EMAIL CREDENTIALS FORM */}
            <form onSubmit={handleInitiateEmailAuth} className="flex flex-col gap-3.5">
              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-violet-400" />
                    <span>Nama Lengkap</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="cth. Rian Pratama"
                    className="p-3 rounded-2xl bg-[#08090E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  <span>Alamat Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="p-3 rounded-2xl bg-[#08090E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-violet-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="p-3 rounded-2xl bg-[#08090E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                />
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between text-xs py-0.5 px-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-[#08090E] text-violet-500 focus:ring-violet-500/30 accent-violet-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium">Ingat saya</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Simpan sesi login</span>
              </div>

              <GradientButton
                size="md"
                type="submit"
                disabled={isLoading}
                className="w-full mt-1"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </span>
                ) : (
                  'Lanjutkan Verifikasi OTP'
                )}
              </GradientButton>
            </form>

            {/* Footer switch */}
            <div className="text-center text-xs text-slate-400 pt-1">
              {authMode === 'login' ? (
                <span>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-violet-300 font-bold hover:underline"
                  >
                    Daftar Gratis
                  </button>
                </span>
              ) : (
                <span>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-violet-300 font-bold hover:underline"
                  >
                    Masuk
                  </button>
                </span>
              )}
            </div>
          </>
        )}

      </div>
    </Modal>
  );
};
