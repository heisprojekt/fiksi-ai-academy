import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Check,
  Zap,
  Info,
  Flame
} from 'lucide-react';

interface TierPlan {
  id: 'pro-monthly' | 'pro-annual' | 'pro-lifetime';
  name: string;
  badge: string;
  price: number;
  formattedPrice: string;
  period: string;
  discountBadge?: string;
  isPopular?: boolean;
  features: string[];
}

const TIER_PLANS: TierPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro Bulanan',
    badge: 'Starter Pro',
    price: 149000,
    formattedPrice: 'Rp 149.000',
    period: '/ bulan',
    features: [
      'Akses ke semua Masterclass & Video Modul',
      'Download 100+ Prompt Formula AI',
      'Download Creative Assets (PSD, LUT, Templates)',
      'Update materi mingguan'
    ]
  },
  {
    id: 'pro-annual',
    name: 'Pro Tahunan',
    badge: 'Paling Populer',
    price: 399000,
    formattedPrice: 'Rp 399.000',
    period: '/ 1 tahun',
    discountBadge: 'Hemat 75%',
    isPopular: true,
    features: [
      'Semua fitur Pro Bulanan selama 1 Tahun Penuh',
      'Akses Masterclass Exclusive Omni & Midjourney v6',
      'Direct Community Support di VIP Discord',
      'Commercial License untuk semua Template & Prompts',
      'Prioritas Request Prompt & Studi Kasus'
    ]
  },
  {
    id: 'pro-lifetime',
    name: 'Lifetime VIP',
    badge: 'Akses Selamanya',
    price: 699000,
    formattedPrice: 'Rp 699.000',
    period: 'sekali bayar',
    discountBadge: 'Investasi Terbaik',
    features: [
      'Akses Seumur Hidup (Tanpa Biaya Langganan Lagi)',
      'Semua Masterclass saat ini & yang akan datang',
      'Private 1-on-1 AI Workflow Consultation',
      'Semua Formula UGC Ads & AI Video Automations',
      'Badge Eksklusif VIP Creator'
    ]
  }
];

export const UpgradeModal: React.FC = () => {
  const { 
    isUpgradeModalOpen, 
    setIsUpgradeModalOpen, 
    currentUser, 
    createQRISPayment, 
    showToast,
    setIsAuthModalOpen 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<TierPlan>(TIER_PLANS[1]);
  const [step, setStep] = useState<'select-plan' | 'qris-payment' | 'success-pending'>('select-plan');
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [proofImage, setProofImage] = useState<string>('');
  const [qrisReference, setQrisReference] = useState<string>('');

  // Reset modal step when opened
  useEffect(() => {
    if (isUpgradeModalOpen) {
      setStep('select-plan');
      setTimerSeconds(900);
      setIsSubmitting(false);
      setProofImage('');
      setQrisReference(`QRIS-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isUpgradeModalOpen]);

  // Countdown timer for QRIS
  useEffect(() => {
    let interval: any = null;
    if (step === 'qris-payment' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  if (!isUpgradeModalOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProceedToQRIS = () => {
    if (!currentUser) {
      setIsUpgradeModalOpen(false);
      setIsAuthModalOpen(true);
      showToast('info', 'Silakan Masuk Terlebih Dahulu', 'Masuk atau daftar untuk melanjutkan proses upgrade membership.');
      return;
    }
    setStep('qris-payment');
    setTimerSeconds(900);
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      await createQRISPayment({
        id: selectedPlan.id,
        name: `${selectedPlan.name} (${selectedPlan.period})`,
        amount: selectedPlan.price,
        formattedAmount: selectedPlan.formattedPrice
      }, proofImage, qrisReference);
      setStep('success-pending');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', `${label} Disalin!`, text);
  };

  return (
    <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} maxWidth="xl">
      <div className="flex flex-col gap-6 p-2">

        {/* ========================================================================= */}
        {/* STEP 1: SELECT MEMBERSHIP TIER PLAN                                       */}
        {/* ========================================================================= */}
        {step === 'select-plan' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header Title */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent-purple/30 text-white mb-1">
                <Crown className="w-6 h-6" />
              </div>
              <Badge variant="purple" icon={<Sparkles className="w-3 h-3" />}>Upgrade Membership</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pilih Paket Akses Pro FIKSI AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
                Buka seluruh modul masterclass eksklusif, ratusan formula prompt komersial, aset kreatif, dan gabung komunitas VIP.
              </p>
            </div>

            {/* Plan Cards Grid with symmetric spacing & top padding for badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              {TIER_PLANS.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-[#121838] border-accent-cyan shadow-xl shadow-accent-cyan/15 ring-2 ring-accent-cyan/40 scale-[1.02]'
                        : 'bg-[#090e24] border-white/10 hover:border-white/20 hover:bg-[#0d1433]'
                    }`}
                  >
                    {/* Floating Top Badge with safe spacing */}
                    {plan.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current text-amber-300" />
                        <span>{plan.badge}</span>
                      </div>
                    )}
                    {plan.discountBadge && !plan.isPopular && (
                      <div className="absolute -top-3.5 right-4 px-2.5 py-0.5 rounded-full bg-accent-purple border border-accent-purple/50 text-white text-[10px] font-extrabold shadow-md">
                        {plan.discountBadge}
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                          isSelected ? 'border-accent-cyan bg-accent-cyan text-black' : 'border-white/20 bg-white/5'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="pb-2 border-b border-white/10">
                        <span className="text-2xl font-black text-white">{plan.formattedPrice}</span>
                        <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                      </div>

                      {/* Features list */}
                      <ul className="flex flex-col gap-2.5 text-xs text-slate-300 my-1">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-accent-cyan' : 'text-slate-500'}`} />
                            <span className="text-[11px] leading-relaxed text-slate-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10">
                      <button
                        type="button"
                        className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                          isSelected
                            ? 'bg-gradient-accent text-white shadow-accent-purple/30'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? 'Paket Terpilih' : 'Pilih Paket Ini'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Continue to QRIS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pembayaran instan & otomatis via QRIS (Semua Bank & E-Wallet)</span>
              </div>
              <GradientButton
                size="md"
                onClick={handleProceedToQRIS}
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Lanjut Bayar via QRIS ({selectedPlan.formattedPrice})
              </GradientButton>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: INTERACTIVE QRIS PAYMENT CHECKOUT                                 */}
        {/* ========================================================================= */}
        {step === 'qris-payment' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('select-plan')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ganti Pilihan Paket</span>
              </button>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 text-accent-cyan text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Batas Waktu Bayar: {formatTimer(timerSeconds)}</span>
              </div>
            </div>

            {/* Symmetrical 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Authentic Styled QRIS Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-between bg-white p-5 rounded-3xl shadow-2xl text-slate-900 border border-slate-200">
                {/* QRIS Header */}
                <div className="flex items-center justify-between w-full pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg tracking-tighter text-rose-600">QRIS</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">National Standard</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">FIKSI AI</span>
                </div>

                {/* QR Code Graphics */}
                <div className="p-3 my-3 bg-white rounded-2xl border-2 border-slate-900 shadow-inner flex flex-col items-center justify-center relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=FIKSI-AI-ACADEMY-PAY-${selectedPlan.id}-${selectedPlan.price}-${qrisReference}`}
                    alt="QRIS QR Code"
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 m-auto w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-accent-cyan" />
                  </div>
                </div>

                {/* QRIS Merchant Info */}
                <div className="text-center w-full">
                  <p className="text-xs font-black text-slate-900 uppercase">FIKSI AI ACADEMY INDONESIA</p>
                  <p className="text-[10px] text-slate-500 font-mono">NMID: ID1024098231029</p>
                </div>

                {/* Supported Payment Logos */}
                <div className="w-full mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-bold text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">BCA</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">Mandiri</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">BRI</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">GoPay</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">OVO</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">DANA</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">ShopeePay</span>
                </div>
              </div>

              {/* Right Column: Order Details & Payment Submission */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4">
                {/* Order Summary Box */}
                <div className="p-4.5 rounded-3xl bg-[#090e24] border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                    <span className="text-slate-400">Paket Upgrade:</span>
                    <span className="font-bold text-white">{selectedPlan.name} ({selectedPlan.period})</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                    <span className="text-slate-400">Akun Member:</span>
                    <span className="font-bold text-accent-cyan font-mono">{currentUser?.email || 'member@email.com'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                    <span className="text-slate-400">Kode Referensi:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{qrisReference}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(qrisReference, 'Kode Referensi')}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                        title="Salin Kode Referensi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-300">Total Nominal Transfer:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-accent-cyan font-mono">{selectedPlan.formattedPrice}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedPlan.price.toString(), 'Nominal Pembayaran')}
                        className="px-2.5 py-1 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan text-[11px] font-bold transition-colors"
                      >
                        Salin Nominal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-3xl bg-accent-purple/10 border border-accent-purple/20 flex items-start gap-3">
                  <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-white">Langkah Pembayaran QRIS:</strong>
                    <ol className="list-decimal list-inside mt-1 flex flex-col gap-0.5 text-slate-300">
                      <li>Buka aplikasi m-Banking atau E-Wallet pilihan Anda.</li>
                      <li>Scan QR code di samping dan periksa nama <strong>FIKSI AI ACADEMY</strong>.</li>
                      <li>Selesaikan pembayaran lalu tekan tombol konfirmasi di bawah.</li>
                    </ol>
                  </div>
                </div>

                {/* Upload Proof (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Upload Bukti Bayar / Screenshot (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={proofImage}
                    onChange={(e) => setProofImage(e.target.value)}
                    placeholder="Tempel URL screenshot bukti pembayaran (opsional)"
                    className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                {/* Action Submit Button */}
                <GradientButton
                  size="md"
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim Konfirmasi...</span>
                    </span>
                  ) : (
                    'Saya Sudah Bayar via QRIS'
                  )}
                </GradientButton>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: TRANSACTION SUBMITTED & PENDING APPROVAL                          */}
        {/* ========================================================================= */}
        {step === 'success-pending' && (
          <div className="flex flex-col items-center text-center gap-5 py-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <Badge variant="green" icon={<Check className="w-3 h-3" />}>Transaksi Terkirim</Badge>
              <h3 className="text-2xl font-black text-white">Konfirmasi QRIS Berhasil Diterima!</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pembayaran untuk paket <strong className="text-white">{selectedPlan.name}</strong> sebesar <strong className="text-accent-cyan">{selectedPlan.formattedPrice}</strong> sedang diverifikasi oleh admin.
              </p>
            </div>

            <div className="p-4.5 rounded-3xl bg-[#090e24] border border-white/10 w-full max-w-sm text-left flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Kode Referensi:</span>
                <span className="font-mono text-white font-bold">{qrisReference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Menunggu Verifikasi Admin</span>
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metode:</span>
                <span className="text-white font-bold">QRIS Instant</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm pt-2">
              <GradientButton
                size="md"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="w-full"
              >
                Tutup & Kembali Belajar
              </GradientButton>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
