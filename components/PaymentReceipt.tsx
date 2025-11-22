
import React, { useState, useEffect } from 'react';
import { Transaction, Account, TransactionStatus } from '../types';
import { USER_PROFILE } from '../constants';
import { LiveTransactionView } from './LiveTransactionView';
import { 
    CheckCircleIcon, 
    ArrowDownTrayIcon, 
    ArrowPathIcon,
    ArrowRightIcon,
    ClipboardDocumentIcon,
    SpinnerIcon,
    ICreditUnionLogo,
    ScaleIcon,
    ShieldCheckIcon,
    GlobeAmericasIcon,
    LockClosedIcon,
    BankIcon
} from './Icons';
import { AuthorizationWarningModal } from './AuthorizationWarningModal';
import { DownloadableReceipt } from './DownloadableReceipt';
import { timeSince } from '../utils/time';

declare const html2canvas: any;
declare const jspdf: any;

interface PaymentReceiptProps {
    transaction: Transaction;
    sourceAccount: Account;
    onStartOver: () => void;
    onViewActivity: () => void;
    onAuthorizeTransaction: (transactionId: string, method: 'code' | 'fee') => void;
    phone?: string;
    onContactSupport: () => void;
    accounts: Account[];
}

const KeyValueRow: React.FC<{ label: string; value: React.ReactNode; isMono?: boolean; large?: boolean }> = ({ label, value, isMono, large }) => (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
        <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">{label}</span>
        <span className={`text-slate-100 text-right ${isMono ? 'font-mono tracking-tight' : 'font-medium'} ${large ? 'text-lg' : 'text-sm'}`}>
            {value}
        </span>
    </div>
);

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ transaction, sourceAccount, onStartOver, onViewActivity, onAuthorizeTransaction, phone, onContactSupport, accounts }) => {
    const totalDebited = transaction.sendAmount + transaction.fee;
    const isCompleted = transaction.status === TransactionStatus.FUNDS_ARRIVED;
    const [showAuthWarning, setShowAuthWarning] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showStamp, setShowStamp] = useState(false);

    useEffect(() => {
        if (transaction.status === TransactionStatus.IN_TRANSIT) {
             const timer = setTimeout(() => {
                setShowAuthWarning(true);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowAuthWarning(false);
        }
    }, [transaction.status]);

    useEffect(() => {
        // Trigger stamp animation after a slight delay
        setTimeout(() => setShowStamp(true), 800);
    }, []);

    const handleDownloadReceipt = () => {
        setIsGeneratingPdf(true);
        setTimeout(() => {
            const receiptElement = document.getElementById(`receipt-capture-${transaction.id}`);
            if (receiptElement && typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
                html2canvas(receiptElement, { scale: 2, backgroundColor: '#0f172a' }).then((canvas: any) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jspdf.jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: [canvas.width, canvas.height]
                    });
                    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                    pdf.save(`iCU_Official_Receipt_${transaction.id}.pdf`);
                    setIsGeneratingPdf(false);
                });
            } else {
                console.error('Could not generate PDF.');
                setIsGeneratingPdf(false);
            }
        }, 100);
    };

    const submissionDate = transaction.statusTimestamps[TransactionStatus.SUBMITTED] || new Date();
    const formattedDate = submissionDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = submissionDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });

    // Simulated Digital Signature
    const digitalSignature = `SHA256:${transaction.id.substring(0, 8).toUpperCase()}...${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
        <>
            {showAuthWarning && (
                <AuthorizationWarningModal
                    transaction={transaction}
                    onAuthorize={onAuthorizeTransaction}
                    onClose={() => setShowAuthWarning(false)}
                    onContactSupport={onContactSupport}
                    accounts={accounts}
                />
            )}

            <div className="fixed inset-0 z-0 pointer-events-none">
                 {/* Cinematic Global Background */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>
                 <div className="absolute inset-0 bg-slate-900/90"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto pb-12 animate-fade-in-up">
                
                {/* Receipt Header / Tracker */}
                <div className="w-full mb-8">
                    <LiveTransactionView transaction={transaction} phone={phone} />
                </div>

                {/* The "Digital Bond" Receipt Card */}
                <div 
                    id={`receipt-capture-${transaction.id}`}
                    className="relative w-full bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Holographic Security Strip */}
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-500 opacity-80 z-20"></div>
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-30"></div>

                    {/* Official Header */}
                    <div className="relative bg-slate-950 p-8 border-b border-white/10 flex justify-between items-start overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <ICreditUnionLogo />
                                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Official Receipt</h2>
                            </div>
                            <p className="text-xs text-slate-400 font-mono">ISSUED BY ICREDIT UNION TREASURY SERVICES</p>
                        </div>

                        <div className="text-right relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wide mb-2">
                                <ShieldCheckIcon className="w-3 h-3" />
                                {isCompleted ? 'Settled & Cleared' : 'Processing'}
                            </div>
                            <p className="text-xs text-slate-500 font-mono">{transaction.id}</p>
                        </div>
                    </div>

                    {/* Main Receipt Body */}
                    <div className="p-8 relative">
                        {/* "VERIFIED" Stamp Animation */}
                        {isCompleted && (
                            <div className={`absolute top-10 right-10 z-50 pointer-events-none transition-all duration-500 ease-out ${showStamp ? 'opacity-90 scale-100 rotate-[-12deg]' : 'opacity-0 scale-[3] rotate-[-30deg]'}`}>
                                <div className="w-32 h-32 border-4 border-green-500/50 rounded-full flex items-center justify-center p-2 mask-image-grunge">
                                    <div className="w-full h-full border-2 border-green-500 rounded-full flex flex-col items-center justify-center text-green-500 uppercase">
                                        <span className="text-xs font-bold tracking-widest mb-1">iCredit Union</span>
                                        <span className="text-2xl font-black tracking-tighter">APPROVED</span>
                                        <span className="text-[10px] font-mono mt-1">{formattedDate}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left Column: Transaction Details */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Amount Debited</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-mono font-bold text-white tracking-tight">
                                            {totalDebited.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                        <span className="text-xs text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded">USD</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <KeyValueRow label="Principal Amount" value={transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} isMono />
                                    <KeyValueRow label="Transaction Fee" value={transaction.fee.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} isMono />
                                    <KeyValueRow label="Exchange Rate" value={transaction.exchangeRate !== 1 ? `1 USD = ${transaction.exchangeRate.toFixed(4)} ${transaction.receiveCurrency}` : '1.0000'} isMono />
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-green-400 text-xs uppercase tracking-wider font-bold">Beneficiary Receives</span>
                                        <span className="text-green-400 font-mono font-bold text-lg">
                                            {transaction.receiveAmount.toLocaleString('en-US', { style: 'currency', currency: transaction.receiveCurrency })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Entities */}
                            <div className="space-y-8">
                                {/* Sender */}
                                <div className="relative pl-4 border-l-2 border-slate-700">
                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Originator (Sender)</p>
                                    <p className="text-white font-bold">{USER_PROFILE.name}</p>
                                    <p className="text-slate-400 text-sm">{sourceAccount.nickname}</p>
                                    <p className="text-slate-500 text-xs font-mono mt-1">{sourceAccount.fullAccountNumber}</p>
                                </div>

                                {/* Recipient */}
                                <div className="relative pl-4 border-l-2 border-primary">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-slate-900"></div>
                                    <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-2">Beneficiary (Recipient)</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={`https://flagsapi.com/${transaction.recipient.country.code}/shiny/16.png`} alt="Flag" className="w-4 h-auto" />
                                        <p className="text-white font-bold">{transaction.recipient.fullName}</p>
                                    </div>
                                    <p className="text-slate-400 text-sm">{transaction.recipient.bankName}</p>
                                    <p className="text-slate-500 text-xs font-mono mt-1">{transaction.recipient.realDetails.accountNumber}</p>
                                    <p className="text-slate-500 text-xs font-mono">BIC: {transaction.recipient.realDetails.swiftBic}</p>
                                </div>
                            </div>
                        </div>

                        {/* Security & Compliance Footer */}
                        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-4">
                            <div className="text-xs text-slate-500 space-y-1 max-w-md">
                                <div className="flex items-center gap-2 text-slate-400 font-mono mb-2">
                                    <LockClosedIcon className="w-3 h-3" />
                                    <span>Digital Signature: {digitalSignature.substring(0, 24)}...</span>
                                </div>
                                <p>This transaction has been processed via the iCredit Union® secure global settlement network (SGSN). It is subject to international AML/KYC regulations.</p>
                                <p>Settlement Date: {formattedDate} • Time: {formattedTime}</p>
                            </div>
                            
                            <div className="bg-white p-2 rounded-lg">
                                <img src={`https://quickchart.io/qr?text=iCU-Secure-Receipt-${transaction.id}&size=80`} alt="QR Code" className="w-16 h-16" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
                    <button 
                        onClick={handleDownloadReceipt} 
                        disabled={isGeneratingPdf}
                        className="flex items-center justify-center space-x-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold shadow-lg border border-white/5 transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                        {isGeneratingPdf ? <SpinnerIcon className="w-5 h-5"/> : <ArrowDownTrayIcon className="w-5 h-5" />}
                        <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                    </button>
                    
                    <button 
                        onClick={onStartOver} 
                        className="flex items-center justify-center space-x-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold shadow-lg border border-white/5 transition-all transform hover:scale-105"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        <span>New Transfer</span>
                    </button>
                    
                    <button 
                        onClick={onViewActivity} 
                        className="flex items-center justify-center space-x-2 py-4 bg-primary hover:bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                    >
                        <ClipboardDocumentIcon className="w-5 h-5" />
                        <span>View History</span>
                    </button>
                </div>
            </div>

            {/* Hidden PDF Render Target (if needed for different layout, but here we use the main card) */}
            {/* Using the main receipt ID for better fidelity */}
        </>
    );
};
