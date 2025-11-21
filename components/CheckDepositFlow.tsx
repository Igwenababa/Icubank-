import React, { useState, useRef } from 'react';
import { Account } from '../types';
import { SpinnerIcon, CameraIcon, CheckCircleIcon, ArrowLeftIcon } from './Icons';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

interface CheckDepositFlowProps {
    accounts: Account[];
    onDepositCheck: (details: { amount: number, accountId: string, images: { front: string, back: string } }) => void;
}

const ImageUploader: React.FC<{
    label: string;
    onImageUpload: (base64: string) => void;
    image: string | null;
}> = ({ label, onImageUpload, image }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsAnalyzing(true);
            setIsAnalyzed(false);
            const base64 = await fileToBase64(file);
            
            // Simulate AI analysis
            setTimeout(() => {
                onImageUpload(base64);
                setIsAnalyzing(false);
                setIsAnalyzed(true);
            }, 2000);
        }
    };

    return (
        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm transition-all hover:border-primary/50">
            <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" />
            <div className="flex items-center space-x-4">
                <div 
                    className="w-24 h-16 bg-slate-200 dark:bg-slate-600 rounded-md flex items-center justify-center cursor-pointer overflow-hidden relative"
                    onClick={() => inputRef.current?.click()}
                >
                    {image ? (
                        <img src={image} alt={`${label} preview`} className="w-full h-full object-cover" />
                    ) : (
                        <CameraIcon className="w-8 h-8 text-slate-400" />
                    )}
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <SpinnerIcon className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}
                </div>
                
                <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
                    <div className="flex items-center space-x-2 h-5">
                        {isAnalyzing ? (
                            <span className="text-xs text-primary animate-pulse">Analyzing image quality...</span>
                        ) : isAnalyzed ? (
                            <span className="text-xs text-green-600 flex items-center font-medium">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Accepted
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500">Tap to capture</span>
                        )}
                    </div>
                </div>

                {!isAnalyzed && !isAnalyzing && (
                    <button 
                        type="button" 
                        onClick={() => inputRef.current?.click()} 
                        className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                    >
                        Upload
                    </button>
                )}
            </div>
        </div>
    );
};

export const CheckDepositFlow: React.FC<CheckDepositFlowProps> = ({ accounts, onDepositCheck }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Images, 3: Review
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleDetailsSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        setError('');
        setStep(2);
    };
    
    const handleImagesSubmit = () => {
        if (!frontImage || !backImage) {
             setError('Please upload both front and back images of the check.');
            return;
        }
        setError('');
        setStep(3);
    };
    
    const handleDeposit = () => {
        if (frontImage && backImage && accountId) {
            onDepositCheck({
                amount: parseFloat(amount),
                accountId,
                images: { front: frontImage, back: backImage }
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Deposit a Check</h2>
                <div className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                    Step {step} of 3
                </div>
            </div>
            
            {step === 1 && (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Check Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 pl-8 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" 
                                placeholder="0.00" 
                                autoFocus 
                            />
                        </div>
                         {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Deposit To</label>
                        <select 
                            value={accountId} 
                            onChange={e => setAccountId(e.target.value)} 
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.nickname || acc.type} (**** {acc.accountNumber.slice(-4)})</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handleDetailsSubmit} 
                        className="w-full py-3 text-white bg-primary hover:bg-primary-600 rounded-lg font-semibold shadow-md transition-transform active:scale-[0.98]"
                    >
                        Continue
                    </button>
                </div>
            )}
            
            {step === 2 && (
                 <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                        Ensure good lighting and a dark background for best results.
                    </p>
                    
                    <ImageUploader label="Front of Check" image={frontImage} onImageUpload={setFrontImage} />
                    <ImageUploader label="Back of Check" image={backImage} onImageUpload={setBackImage} />
                    
                    {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
                    
                    <div className="flex space-x-3 pt-2">
                        <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors">Back</button>
                        <button onClick={handleImagesSubmit} disabled={!frontImage || !backImage} className="flex-1 py-3 text-white bg-primary hover:bg-primary-600 rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Review Deposit
                        </button>
                    </div>
                </div>
            )}
            
            {step === 3 && (
                <div className="space-y-5">
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                         <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                             <span className="text-slate-500 dark:text-slate-400 text-sm">Amount</span> 
                             <span className="font-bold text-2xl text-slate-800 dark:text-white">${parseFloat(amount).toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-slate-500 dark:text-slate-400 text-sm">To Account</span> 
                             <span className="font-medium text-slate-800 dark:text-slate-200">{accounts.find(a=>a.id === accountId)?.nickname}</span>
                         </div>
                         <div className="pt-2">
                             <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Check Images</p>
                             <div className="flex space-x-3">
                                <div className="relative w-20 h-12">
                                    <img src={frontImage!} alt="Front" className="w-full h-full object-cover rounded border border-slate-300 dark:border-slate-600 shadow-sm"/>
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">Front</span>
                                </div>
                                <div className="relative w-20 h-12">
                                    <img src={backImage!} alt="Back" className="w-full h-full object-cover rounded border border-slate-300 dark:border-slate-600 shadow-sm"/>
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">Back</span>
                                </div>
                             </div>
                         </div>
                     </div>
                     
                     <div className="text-xs text-slate-500 dark:text-slate-400 text-center px-4">
                        By clicking "Deposit Check", you agree that the images are legible and the check is endorsed.
                     </div>

                    <div className="flex space-x-3">
                        <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors">Back</button>
                        <button onClick={handleDeposit} className="flex-1 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-md transition-all transform active:scale-[0.98]">
                            Confirm Deposit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};