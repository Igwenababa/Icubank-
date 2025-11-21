
// FIX: Import `useRef` from React to resolve 'Cannot find name' errors.
// FIX: Import `useMemo` from React to resolve 'useMemo is not defined' error.
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
// FIX: Update import to be explicit with '.tsx' extension to resolve module ambiguity.
import { SendMoneyFlow } from './components/SendMoneyFlow.tsx';
import { Recipients } from './components/Recipients.tsx';
// FIX: Added 'AdvancedTransferLimits' to fix "Cannot find name 'AdvancedTransferLimits'" error.
import { Transaction, Recipient, TransactionStatus, Card, CardTransaction, Notification, NotificationType, LoanApplication, LoanApplicationStatus, Account, VerificationLevel, CryptoHolding, CryptoAsset, SubscriptionService, AppleCardDetails, AppleCardTransaction, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile, PlatformSettings, View, Task, FlightBooking, UtilityBill, UtilityBiller, AdvisorResponse, BalanceDisplayMode, AccountType, AirtimePurchase, PushNotification, PushNotificationSettings, SavedSession, VirtualCard, Donation, PrivacySettings, Country, AdvancedTransferLimits } from './types.ts';
// FIX: Added 'ALL_COUNTRIES' to imports to resolve "Cannot find name" error.
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_CARD_TRANSACTIONS, INITIAL_ADVANCED_TRANSFER_LIMITS, INITIAL_ACCOUNTS, getInitialCryptoAssets, INITIAL_CRYPTO_HOLDINGS, CRYPTO_TRADE_FEE_PERCENT, INITIAL_SUBSCRIPTIONS, INITIAL_APPLE_CARD_DETAILS, INITIAL_APPLE_CARD_TRANSACTIONS, INITIAL_TRAVEL_PLANS, INITIAL_SECURITY_SETTINGS, INITIAL_TRUSTED_DEVICES, USER_PROFILE, INITIAL_PLATFORM_SETTINGS, THEME_COLORS, INITIAL_TASKS, INITIAL_FLIGHT_BOOKINGS, INITIAL_UTILITY_BILLS, getUtilityBillers, getAirtimeProviders, INITIAL_AIRTIME_PURCHASES, INITIAL_PUSH_SETTINGS, EXCHANGE_RATES, NEW_USER_PROFILE_TEMPLATE, NEW_USER_ACCOUNTS_TEMPLATE, INITIAL_VIRTUAL_CARDS, DOMESTIC_WIRE_FEE, INTERNATIONAL_WIRE_FEE, INITIAL_WALLET_DETAILS, ALL_COUNTRIES } from './constants.ts';
import * as Icons from './components/Icons.tsx';
import { Welcome } from './components/Welcome.tsx';
import { ActivityLog } from './components/ActivityLog.tsx';
import { Security } from './components/Security.tsx';
import { CardManagement } from './components/CardManagement.tsx';
import { Insurance } from './components/Insurance.tsx';
import { Loans } from './components/Loans.tsx';
import { Support } from './components/Support.tsx';
import { DynamicIslandSimulator } from './components/DynamicIslandSimulator.tsx';
import { Accounts } from './components/Accounts.tsx';
import { CryptoDashboard } from './components/CryptoDashboard.tsx';
import { ServicesDashboard } from './components/ServicesDashboard.tsx';
import { TravelCheckIn } from './components/TravelCheckIn.tsx';
import { PlatformFeatures } from './components/PlatformFeatures.tsx';
// FIX: Updated import to match the correct component file name (lowercase) to resolve casing issues.
import { Tasks } from './components/tasks.tsx';
import { Flights } from './components/Flights.tsx';
import { Utilities } from './components/Utilities.tsx';
import { Integrations } from './components/Integrations.tsx';
import { FinancialAdvisor } from './components/FinancialAdvisor.tsx';
import { Investments } from './components/Investments.tsx';
import { AtmLocator } from './components/AtmLocator.tsx';
// FIX: Import Quickteller to resolve "Cannot find name 'Quickteller'" error.
import { Quickteller } from './components/Quickteller.tsx';
import { QrScanner } from './components/QrScanner.tsx';
import { PrivacyCenter } from './components/PrivacyCenter.tsx';
import { WireTransfer } from './components/WireTransfer.tsx';
import { About } from './components/About.tsx';
import { Contact } from './components/Contact.tsx';
import { DigitalWallet } from './components/DigitalWallet.tsx';
import { Ratings } from './components/Ratings.tsx';
import { GlobalAid } from './components/GlobalAid.tsx';
import { GlobalBankingNetwork } from './components/GlobalBankingNetwork.tsx';

import { useLanguage, LanguageProvider } from './contexts/LanguageContext.tsx';
import { LanguageSelector } from './components/LanguageSelector.tsx';

import { getFinancialAnalysis } from './services/geminiService.ts';
import { sendPushNotification, sendTransactionalEmail, sendSmsNotification, generateTransactionReceiptEmail, generateTransactionReceiptSms, generateCardStatusEmail, generateFundsArrivedEmail, generateLoginAlertEmail, generateLoginAlertSms, generateNewAccountOtpEmail, generateNewAccountOtpSms, generateFullWelcomeEmail, generateFullWelcomeSms, generateWelcomeEmail, generateWelcomeSms, generateDepositConfirmationEmail, generateDepositConfirmationSms, generateTaskReminderEmail, generateTaskReminderSms, generateSupportTicketConfirmationEmail, generateSupportTicketConfirmationSms } from './services/notificationService.ts';

import { InactivityModal } from './components/InactivityModal.tsx';
import { ChangePasswordModal } from './components/ChangePasswordModal.tsx';
import { PushNotificationToast } from './components/PushNotificationToast.tsx';
import { AdvancedFirstPage } from './components/AdvancedFirstPage.tsx';
import { OpeningSequence } from './components/OpeningSequence.tsx';
import { PostLoginSecurityCheck } from './components/PostLoginSecurityCheck.tsx';
import { AccountCreationFlow } from './components/AccountCreationFlow.tsx';
import { ResumeSessionModal } from './components/ResumeSessionModal.tsx';
import { ContactSupportModal } from './components/ContactSupportModal.tsx';
import { LinkBankAccountModal } from './components/LinkBankAccountModal.tsx';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal.tsx';
import { LoggedOut } from './components/LoggedOut.tsx';
import { ProfileSignIn } from './components/ProfileSignIn.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalModal } from './components/LegalModal.tsx';

const INACTIVITY_TIMEOUT = 300 * 1000; // 5 minutes
const COUNTDOWN_START = 60; // 60 seconds

// FIX: Change `export default` to a named export `export const App` to resolve the module resolution error.
export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showSendMoneyFlow, setShowSendMoneyFlow] = useState(false);
  const [showWireTransfer, setShowWireTransfer] = useState(false);
  const [wireTransferData, setWireTransferData] = useState<any>(null);
  const [sendMoneyInitialTab, setSendMoneyInitialTab] = useState<'send' | 'split' | 'deposit' | undefined>(undefined);
  const [transactionToRepeat, setTransactionToRepeat] = useState<Transaction | null>(null);

  // Currency State
  const [displayCurrency, setDisplayCurrency] = useState<string>('USD');

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>(INITIAL_VIRTUAL_CARDS);
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>(INITIAL_CARD_TRANSACTIONS);

  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [cryptoAssets, setCryptoAssets] = useState(() => getInitialCryptoAssets(Icons));
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>(INITIAL_CRYPTO_HOLDINGS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionService[]>(INITIAL_SUBSCRIPTIONS);
  const [appleCardDetails, setAppleCardDetails] = useState<AppleCardDetails>(INITIAL_APPLE_CARD_DETAILS);
  const [appleCardTransactions, setAppleCardTransactions] = useState<AppleCardTransaction[]>(INITIAL_APPLE_CARD_TRANSACTIONS);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(INITIAL_TRAVEL_PLANS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>(INITIAL_FLIGHT_BOOKINGS);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>(INITIAL_UTILITY_BILLS);
  const [utilityBillers] = useState(() => getUtilityBillers(Icons));
  const [airtimeProviders] = useState(() => getAirtimeProviders(Icons));
  const [airtimePurchases, setAirtimePurchases] = useState<AirtimePurchase[]>(INITIAL_AIRTIME_PURCHASES);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [linkedServices, setLinkedServices] = useState<Record<string, string>>({ PayPal: 'randy.m.c@...com' });
  const [walletDetails, setWalletDetails] = useState(INITIAL_WALLET_DETAILS);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushNotification, setPushNotification] = useState<PushNotification | null>(null);

  // Settings
  const [advancedTransferLimits, setAdvancedTransferLimits] = useState(INITIAL_ADVANCED_TRANSFER_LIMITS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [pushNotificationSettings, setPushNotificationSettings] = useState<PushNotificationSettings>(INITIAL_PUSH_SETTINGS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
      ads: true,
      sharing: false,
      email: { transactions: true, security: true, promotions: false },
      sms: { transactions: true, security: true, promotions: false },
  });
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(INITIAL_TRUSTED_DEVICES);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_PROFILE);

  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>(VerificationLevel.LEVEL_1);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  // Login & Session State
  const [loginState, setLoginState] = useState<'logged_out'|'intro'|'welcome'|'profile_signin'|'security_check'|'opening_sequence'|'logged_in'>('intro');
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactSupportModal, setshowContactSupportModal] = useState(false);
  const [supportInitialTxId, setSupportInitialTxId] = useState<string | undefined>(undefined);
  const [showLinkAccountModal, setShowLinkAccountModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // AI Advisor State
  const [financialAnalysis, setFinancialAnalysis] = useState<AdvisorResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);

  // Session resume state
  const [savedSession, setSavedSession] = useState<SavedSession | null>(null);
  const [showResumeSessionModal, setShowResumeSessionModal] = useState(false);
  
  // Legal Modal
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; content: string } | null>(null);

  // ... other state ...
  
  // Simulate Geolocated Currency Preference
  useEffect(() => {
      // In a real app, you might fetch IP location here
      // For this demo, we simulate a check that might default to USD or another currency
      // Keeping default as USD for now, but this hook exists for extensibility
      const savedCurrency = localStorage.getItem('icu_currency_pref');
      if (savedCurrency) {
          setDisplayCurrency(savedCurrency);
      }
  }, []);

  // Persist currency choice
  const handleSetCurrency = (currency: string) => {
      setDisplayCurrency(currency);
      localStorage.setItem('icu_currency_pref', currency);
  };
  
  const addNotification = useCallback((type: NotificationType, title: string, message: string, linkTo?: View) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Also trigger a push notification simulation
    if ((type === NotificationType.TRANSACTION && pushNotificationSettings.transactions) ||
        (type === NotificationType.SECURITY && pushNotificationSettings.security)) {
        setPushNotification({ id: `push_${Date.now()}`, type, title, message });
    }
  }, [pushNotificationSettings]);

  // Task reminder effect
  useEffect(() => {
    const checkTasks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tasks.forEach(task => {
            if (!task.completed && task.dueDate && !task.notificationSent) {
                const taskDueDate = new Date(task.dueDate);
                taskDueDate.setHours(0,0,0,0);
                if (taskDueDate.getTime() === today.getTime()) {
                    addNotification(NotificationType.TASK, 'Task Due Today', `Your task "${task.text}" is due today.`);
                    if(privacySettings.email.promotions) generateTaskReminderEmail(userProfile.name, task.text, task.dueDate);
                    if(privacySettings.sms.promotions) generateTaskReminderSms(task.text);
                    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, notificationSent: true } : t));
                }
            }
        });
    };
    const interval = setInterval(checkTasks, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, addNotification, privacySettings, userProfile]);

  const onUpdateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
  };

  const onUpdatePrivacySettings = (update: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => ({...prev, ...update}));
  };
  
  const onUpdateAdvancedLimits = (newLimits: AdvancedTransferLimits) => {
    setAdvancedTransferLimits(newLimits);
  };
  
  const onUpdateCardControls = (cardId: string, updatedControls: Partial<Card['controls']>) => {
      setCards(prevCards => prevCards.map(card => 
          card.id === cardId ? { ...card, controls: { ...card.controls, ...updatedControls } } : card
      ));
      const card = cards.find(c => c.id === cardId);
      if (card && typeof updatedControls.isFrozen !== 'undefined') {
          const status = updatedControls.isFrozen ? 'Frozen' : 'Unfrozen';
          addNotification(NotificationType.CARD, `Card ${status}`, `Your ${card.network} card ending in ${card.lastFour} has been ${status.toLowerCase()}.`);
          const {subject, body} = generateCardStatusEmail(userProfile.name, updatedControls.isFrozen, card.lastFour);
          if (privacySettings.email.security) sendTransactionalEmail(userProfile.email, subject, body);
      }
  };

  const onAddCard = (cardData: Omit<Card, 'id' | 'controls'>) => {
    const newCard: Card = {
        ...cardData,
        id: `card_${Date.now()}`,
        controls: {
            isFrozen: false,
            onlinePurchases: true,
            internationalTransactions: true,
            transactionLimits: { perTransaction: null, daily: null },
            blockedCategories: [],
        },
    };
    setCards(prev => [...prev, newCard]);
  };
  
  const onAddVirtualCard = (data: { nickname: string; linkedCardId: string; spendingLimit: number | null }) => {
    const newCard: VirtualCard = {
        ...data,
        id: `vc_${Date.now()}`,
        lastFour: String(Math.floor(1000 + Math.random() * 9000)),
        fullNumber: `4111 2222 3333 ${String(Math.floor(1000 + Math.random() * 9000))}`,
        expiryDate: '12/29',
        cvc: String(Math.floor(100 + Math.random() * 900)),
        spentThisMonth: 0,
        lockedToMerchant: null,
        isFrozen: false,
    };
    setVirtualCards(prev => [...prev, newCard]);
  };

  const onUpdateVirtualCard = (cardId: string, updates: Partial<VirtualCard>) => {
    setVirtualCards(prev => prev.map(vc => vc.id === cardId ? {...vc, ...updates} : vc));
  };

  const onRevokeDevice = (deviceId: string) => {
      setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
      addNotification(NotificationType.SECURITY, 'Device Revoked', 'You have revoked access for one of your trusted devices.');
  };
  
  const onUpdatePushNotificationSettings = (newSettings: Partial<PushNotificationSettings>) => {
      setPushNotificationSettings(prev => ({...prev, ...newSettings}));
  };
  
  const addRecipient = (data: any) => {
    const newRecipient: Recipient = {
        id: `rec_${Date.now()}`,
        fullName: data.fullName,
        nickname: data.nickname,
        phone: data.phone,
        bankName: data.bankName,
        accountNumber: `•••• ${data.accountNumber.slice(-4)}`,
        country: data.country,
        deliveryOptions: {
            bankDeposit: true,
            cardDeposit: true,
            cashPickup: data.cashPickupEnabled,
        },
        realDetails: {
            accountNumber: data.accountNumber,
            swiftBic: data.swiftBic,
        },
        streetAddress: data.streetAddress,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
    };
    setRecipients(prev => [...prev, newRecipient]);
    addNotification(NotificationType.ACCOUNT, 'Recipient Added', `You have successfully added ${data.fullName} to your recipients.`);
  };

  const onUpdateRecipient = (recipientId: string, data: any) => {
    setRecipients(prev => prev.map(r => {
        if (r.id === recipientId) {
            return {
                ...r,
                fullName: data.fullName,
                nickname: data.nickname,
                phone: data.phone,
                bankName: data.bankName,
                accountNumber: `•••• ${data.accountNumber.slice(-4)}`,
                country: data.country,
                realDetails: {
                    accountNumber: data.accountNumber,
                    swiftBic: data.swiftBic,
                },
                streetAddress: data.streetAddress,
                city: data.city,
                stateProvince: data.stateProvince,
                postalCode: data.postalCode,
            };
        }
        return r;
    }));
    addNotification(NotificationType.ACCOUNT, 'Recipient Updated', `Details for ${data.fullName} have been updated.`);
  };
  
  const addLoanApplication = (application: Omit<LoanApplication, 'id' | 'status' | 'submittedDate'>) => {
      const newApplication: LoanApplication = {
          ...application,
          id: `loan_app_${Date.now()}`,
          status: LoanApplicationStatus.PENDING,
          submittedDate: new Date(),
      };
      setLoanApplications(prev => [newApplication, ...prev]);
  };
  
  const createTransaction = async (transactionDetails: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>): Promise<Transaction | null> => {
      const newTransaction: Transaction = {
          ...transactionDetails,
          id: `txn_${Date.now()}`,
          status: TransactionStatus.SUBMITTED,
          type: 'debit',
          estimatedArrival: new Date(Date.now() + 86400000 * 3), // 3 days from now
          statusTimestamps: {
              [TransactionStatus.SUBMITTED]: new Date(),
          },
      };

      setTransactions(prev => [newTransaction, ...prev]);
      addNotification(
          NotificationType.TRANSACTION,
          'Transfer Submitted',
          `Your transfer of ${transactionDetails.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${transactionDetails.recipient.fullName} has been submitted.`,
          'history'
      );
      
      const {subject, body} = generateTransactionReceiptEmail(newTransaction, userProfile.name);
      if (privacySettings.email.transactions) sendTransactionalEmail(userProfile.email, subject, body);
      if (privacySettings.sms.transactions) sendSmsNotification(userProfile.phone || '', generateTransactionReceiptSms(newTransaction));
      
      return newTransaction;
  };

  const onSplitTransaction = (details: { sourceAccountId: string; splits: { recipient: Recipient; amount: number }[]; totalAmount: number; purpose: string; }): boolean => {
    const sourceAccount = accounts.find(a => a.id === details.sourceAccountId);
    if (!sourceAccount || sourceAccount.balance < details.totalAmount) {
        return false;
    }
    
    details.splits.forEach(split => {
        createTransaction({
            accountId: details.sourceAccountId,
            recipient: split.recipient,
            sendAmount: split.amount,
            receiveAmount: split.amount, // Simplified for this demo
            fee: 0,
            exchangeRate: 1,
            purpose: details.purpose,
            description: `Split: ${details.purpose}`,
            splitGroupId: `split_${Date.now()}`,
        });
    });
    return true;
  };
  
  // Update transaction status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prevTransactions =>
        prevTransactions.map(tx => {
          if (tx.status === TransactionStatus.FUNDS_ARRIVED) return tx;

          const now = new Date();
          const submittedTime = tx.statusTimestamps[TransactionStatus.SUBMITTED].getTime();
          const elapsedSeconds = (now.getTime() - submittedTime) / 1000;
          
          let nextStatus: TransactionStatus | null = null;
          let nextTimestamp: Date | undefined = now;

          if (tx.status === TransactionStatus.SUBMITTED && elapsedSeconds > 4) {
              nextStatus = tx.requiresAuth ? TransactionStatus.FLAGGED_AWAITING_CLEARANCE : TransactionStatus.CONVERTING;
          } else if (tx.status === TransactionStatus.CONVERTING && elapsedSeconds > 8) {
              nextStatus = TransactionStatus.IN_TRANSIT;
          } else if (tx.status === TransactionStatus.IN_TRANSIT && elapsedSeconds > 15) {
              nextStatus = TransactionStatus.FUNDS_ARRIVED;
              if (pushNotificationSettings.transactions) {
                  addNotification(NotificationType.TRANSACTION, 'Funds Arrived', `Your transfer to ${tx.recipient.fullName} has arrived.`);
              }
              const {subject, body} = generateFundsArrivedEmail(tx, userProfile.name);
              if (privacySettings.email.transactions) sendTransactionalEmail(userProfile.email, subject, body);
          } else if (tx.status === TransactionStatus.CLEARANCE_GRANTED && elapsedSeconds > (tx.statusTimestamps[TransactionStatus.CLEARANCE_GRANTED]!.getTime() - submittedTime) / 1000 + 4) {
              nextStatus = TransactionStatus.IN_TRANSIT;
          } else {
              nextTimestamp = undefined;
          }

          if (nextStatus && nextTimestamp) {
              return {
                  ...tx,
                  status: nextStatus,
                  statusTimestamps: { ...tx.statusTimestamps, [nextStatus]: nextTimestamp }
              };
          }
          return tx;
        })
      );
    }, 2000); // Check for updates every 2 seconds

    return () => clearInterval(interval);
  }, [addNotification, pushNotificationSettings, privacySettings, userProfile]);

  const onAuthorizeTransaction = (transactionId: string, method: 'code' | 'fee') => {
      setTransactions(prev => prev.map(tx => {
          if (tx.id === transactionId && tx.status === TransactionStatus.FLAGGED_AWAITING_CLEARANCE) {
              return {
                  ...tx,
                  status: TransactionStatus.CLEARANCE_GRANTED,
                  statusTimestamps: {
                      ...tx.statusTimestamps,
                      [TransactionStatus.CLEARANCE_GRANTED]: new Date(),
                  },
                  clearanceFeePaid: method === 'fee',
              };
          }
          return tx;
      }));
  };

  const onUpdateAccountNickname = (accountId: string, nickname: string) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? {...acc, nickname} : acc));
  };
  
  const onUpdateProfilePicture = (url: string) => {
      setUserProfile(prev => ({...prev, profilePictureUrl: url}));
  };

  const totalNetWorth = useMemo(() => {
    const accountTotal = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const cryptoTotal = cryptoHoldings.reduce((sum, holding) => {
      const asset = cryptoAssets.find(a => a.id === holding.assetId);
      return sum + (asset ? holding.amount * asset.price : 0);
    }, 0);
    return accountTotal + cryptoTotal;
  }, [accounts, cryptoHoldings, cryptoAssets]);
  
  const onBuyCrypto = (assetId: string, usdAmount: number, assetPrice: number): boolean => {
    const checking = accounts.find(a => a.type === AccountType.CHECKING);
    if (!checking || checking.balance < usdAmount) return false;

    const cryptoAmount = usdAmount / assetPrice;
    
    setAccounts(prev => prev.map(a => a.id === checking.id ? { ...a, balance: a.balance - usdAmount } : a));
    
    setCryptoHoldings(prev => {
        const existing = prev.find(h => h.assetId === assetId);
        if (existing) {
            const totalAmount = existing.amount + cryptoAmount;
            const totalCost = (existing.avgBuyPrice * existing.amount) + usdAmount;
            return prev.map(h => h.assetId === assetId ? { ...h, amount: totalAmount, avgBuyPrice: totalCost / totalAmount } : h);
        }
        return [...prev, { assetId, amount: cryptoAmount, avgBuyPrice: assetPrice }];
    });
    return true;
  };
  
  const onSellCrypto = (assetId: string, cryptoAmount: number, assetPrice: number): boolean => {
      const holding = cryptoHoldings.find(h => h.assetId === assetId);
      if (!holding || holding.amount < cryptoAmount) return false;

      const usdAmount = cryptoAmount * assetPrice;

      setAccounts(prev => prev.map(a => a.type === AccountType.CHECKING ? { ...a, balance: a.balance + usdAmount * (1 - CRYPTO_TRADE_FEE_PERCENT) } : a));
      setCryptoHoldings(prev => prev.map(h => h.assetId === assetId ? { ...h, amount: h.amount - cryptoAmount } : h).filter(h => h.amount > 0.000001));
      return true;
  };
  
  const onPaySubscription = (subscriptionId: string): boolean => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    const checking = accounts.find(a => a.type === AccountType.CHECKING);
    if (!sub || !checking || checking.balance < sub.amount) return false;
    
    setAccounts(prev => prev.map(a => a.id === checking.id ? { ...a, balance: a.balance - sub.amount } : a));
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, isPaid: true } : s));
    return true;
  };

  const onUpdateSpendingLimits = (limits: { category: any, limit: number }[]) => {
      setAppleCardDetails(prev => ({...prev, spendingLimits: limits}));
  };

  const onUpdateTransactionCategory = (transactionId: string, category: any) => {
      setAppleCardTransactions(prev => prev.map(tx => tx.id === transactionId ? {...tx, category} : tx));
  };

  const addTravelPlan = (country: Country, startDate: Date, endDate: Date) => {
      const newPlan: TravelPlan = {
          id: `travel_${Date.now()}`,
          country,
          startDate,
          endDate,
          status: new Date() >= startDate && new Date() <= endDate ? TravelPlanStatus.ACTIVE : TravelPlanStatus.UPCOMING
      };
      setTravelPlans(prev => [newPlan, ...prev]);
  };
  
  const addTask = (text: string, dueDate?: Date, category?: any) => {
      const newTask: Task = { id: `task_${Date.now()}`, text, completed: false, dueDate, category };
      setTasks(prev => [newTask, ...prev]);
  };
  
  const toggleTask = (taskId: string) => {
      setTasks(prev => prev.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
  };
  
  const deleteTask = (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const onBookFlight = (booking: Omit<FlightBooking, 'id' | 'bookingDate' | 'status'>, sourceAccountId: string): boolean => {
      const account = accounts.find(a => a.id === sourceAccountId);
      if (!account || account.balance < booking.totalPrice) return false;
      
      setAccounts(prev => prev.map(a => a.id === sourceAccountId ? { ...a, balance: a.balance - booking.totalPrice } : a));
      const newBooking: FlightBooking = { ...booking, id: `fb_${Date.now()}`, bookingDate: new Date(), status: 'Confirmed' };
      setFlightBookings(prev => [newBooking, ...prev]);
      return true;
  };
  
  const onPayUtility = (billId: string, sourceAccountId: string): boolean => {
      const bill = utilityBills.find(b => b.id === billId);
      const account = accounts.find(a => a.id === sourceAccountId);
      if (!bill || !account || account.balance < bill.amount) return false;

      setAccounts(prev => prev.map(a => a.id === sourceAccountId ? { ...a, balance: a.balance - bill.amount } : a));
      setUtilityBills(prev => prev.map(b => b.id === billId ? { ...b, isPaid: true } : b));
      return true;
  };
  
  const onPurchaseAirtime = (providerId: string, phoneNumber: string, amount: number, accountId: string): boolean => {
      const account = accounts.find(a => a.id === accountId);
      if (!account || account.balance < amount) return false;

      setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: a.balance - amount } : a));
      const newPurchase: AirtimePurchase = { id: `ap_${Date.now()}`, providerId, phoneNumber, amount, purchaseDate: new Date() };
      setAirtimePurchases(prev => [newPurchase, ...prev]);
      return true;
  };
  
  const onDonate = (causeId: string, amount: number, accountId: string): boolean => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.balance < amount) return false;

    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: a.balance - amount } : a));
    const newDonation: Donation = { id: `don_${Date.now()}`, causeId, amount, date: new Date() };
    setDonations(prev => [newDonation, ...prev]);
    return true;
  };
  
  const onLinkService = (serviceName: string, identifier: string) => {
      setLinkedServices(prev => ({ ...prev, [serviceName]: identifier }));
  };

  const onAddFunds = async (amount: number, cardLastFour: string, cardNetwork: 'Visa' | 'Mastercard') => {
      const checking = accounts.find(a => a.type === AccountType.CHECKING);
      if (!checking) return;

      setAccounts(prev => prev.map(a => a.id === checking.id ? { ...a, balance: a.balance + amount } : a));
      addNotification(NotificationType.TRANSACTION, "Funds Added", `${amount.toLocaleString('en-US',{style:'currency',currency:'USD'})} was added to your account.`);
      const {subject, body} = generateDepositConfirmationEmail(userProfile.name, amount, cardLastFour);
      if (privacySettings.email.transactions) sendTransactionalEmail(userProfile.email, subject, body);
      if (privacySettings.sms.transactions) sendSmsNotification(userProfile.phone || '', generateDepositConfirmationSms(amount, cardLastFour));
  };
  
  const onDepositCheck = (details: { amount: number, accountId: string, images: { front: string, back: string } }) => {
    const newTransaction: Transaction = {
        id: `txn_${Date.now()}_cheque`,
        accountId: details.accountId,
        recipient: { id: 'self_deposit', fullName: USER_PROFILE.name, bankName: 'Self Deposit', accountNumber: 'Cheque', country: ALL_COUNTRIES.find(c=>c.code==='US')!, deliveryOptions: {bankDeposit: true, cardDeposit: false, cashPickup: false}, realDetails: {accountNumber: '', swiftBic: ''} },
        sendAmount: details.amount,
        receiveAmount: details.amount,
        fee: 0,
        exchangeRate: 1,
        status: TransactionStatus.SUBMITTED,
        type: 'credit',
        estimatedArrival: new Date(Date.now() + 86400000 * 2),
        statusTimestamps: { [TransactionStatus.SUBMITTED]: new Date() },
        description: `Mobile Cheque Deposit`,
        chequeDetails: { images: details.images }
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowSendMoneyFlow(false);
  };
  
  const openLegalModal = (title: string, content: string) => {
      setLegalModalContent({ title, content });
  };
  
  const runFinancialAnalysis = () => {
      setIsAnalyzing(true);
      setAnalysisError(false);
      
      const financialData = JSON.stringify({
          accounts,
          transactions: transactions.slice(0, 20),
          cryptoHoldings,
      });

      getFinancialAnalysis(financialData).then(({ analysis, isError }) => {
          if (isError) {
              setAnalysisError(true);
          } else {
              setFinancialAnalysis(analysis);
          }
          setIsAnalyzing(false);
      });
  };

  const onOpenSendMoneyFlow = (initialTab: 'send' | 'split' | 'deposit' = 'send', transactionToRepeat?: Transaction | null) => {
    setSendMoneyInitialTab(initialTab);
    if(transactionToRepeat) {
        setTransactionToRepeat(transactionToRepeat);
    }
    setShowSendMoneyFlow(true);
  };
  
  const onOpenWireTransfer = (initialData: any = null) => {
      setWireTransferData(initialData);
      setShowWireTransfer(true);
  };

  const handleCreateAccount = (formData: any) => {
    setLoginState('opening_sequence');
    setUserProfile({ ...NEW_USER_PROFILE_TEMPLATE, name: formData.fullName, email: formData.email, phone: formData.phone, lastLogin: { date: new Date(), from: 'New Account' } });
    const newAccounts = NEW_USER_ACCOUNTS_TEMPLATE.map((accTemplate, i) => ({
        ...accTemplate,
        id: `acc_new_${i}_${Date.now()}`,
        fullAccountNumber: `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
        status: 'Provisioning' as const,
    }));
    setAccounts(newAccounts);
    
    // Simulate provisioning and activation
    setTimeout(() => {
        setAccounts(prev => prev.map(a => ({...a, status: 'Active'})));
        
        const accountNumbers = newAccounts.map(a => ({ type: a.type, number: a.accountNumber }));
        
        const {subject, body} = generateFullWelcomeEmail(formData.fullName, accountNumbers);
        sendTransactionalEmail(formData.email, subject, body);
        sendSmsNotification(formData.phone, generateFullWelcomeSms(formData.fullName));

        setTimeout(() => {
            const {subject: welcomeSubject, body: welcomeBody} = generateWelcomeEmail(formData.fullName);
            sendTransactionalEmail(formData.email, welcomeSubject, welcomeBody);
            
            setLoginState('logged_in');
        }, 3000);
    }, 5000);
  };
  
  const handleLogin = () => {
      setLoginState('security_check');
  };
  
  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('iCU_session');
    setLoginState('logged_out');
    setActiveView('dashboard');
  };

  // Inactivity timer logic
  const inactivityTimer = useRef<number | null>(null);
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (loginState === 'logged_in') {
        inactivityTimer.current = window.setTimeout(() => {
            setShowInactivityModal(true);
        }, INACTIVITY_TIMEOUT);
    }
  }, [loginState]);

  useEffect(() => {
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keydown', resetInactivityTimer);
      window.addEventListener('scroll', resetInactivityTimer);
      window.addEventListener('click', resetInactivityTimer);
      resetInactivityTimer();
      return () => {
          window.removeEventListener('mousemove', resetInactivityTimer);
          window.removeEventListener('keydown', resetInactivityTimer);
          window.removeEventListener('scroll', resetInactivityTimer);
          window.removeEventListener('click', resetInactivityTimer);
          if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      };
  }, [resetInactivityTimer]);
  
  const handleStayLoggedIn = () => {
      setShowInactivityModal(false);
      resetInactivityTimer();
  };

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    const theme = platformSettings.theme;
    const colors = THEME_COLORS[theme];
    for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(`--color-primary-${key}`, String(value));
    }

    if (platformSettings.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [platformSettings.theme, platformSettings.themeMode]);

  // Session persistence
  useEffect(() => {
    const storedSession = localStorage.getItem('iCU_session');
    if (storedSession) {
        try {
            const parsedSession: SavedSession = JSON.parse(storedSession);
            // If session is less than 1 hour old
            if (Date.now() - parsedSession.timestamp < 3600 * 1000) {
                setSavedSession(parsedSession);
                setLoginState('profile_signin');
            } else {
                localStorage.removeItem('iCU_session');
                setLoginState('welcome');
            }
        } catch {
            localStorage.removeItem('iCU_session');
            setLoginState('welcome');
        }
    } else {
        // No saved session, could be first time or after logout
        setLoginState('intro');
    }
  }, []);
  
  useEffect(() => {
      if(loginState === 'logged_in') {
        const handleBeforeUnload = () => {
             const sessionToSave: SavedSession = { view: activeView, timestamp: Date.now() };
             localStorage.setItem('iCU_session', JSON.stringify(sessionToSave));
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
      }
  }, [loginState, activeView]);

  // Render logic based on login state
  if (loginState === 'intro') {
      return <AdvancedFirstPage onComplete={() => setLoginState('welcome')} />;
  }

  if (loginState === 'welcome') {
      return (
        <div className="relative">
            {/* We can use a local state in App or a new loginState value. Let's use a conditional render here. */}
             <Welcome 
                onLogin={handleLogin} 
                onStartCreateAccount={() => setLoginState('account_creation' as any)} // This is actually account creation flow, naming is tricky. Let's assume we render AccountCreationFlow if state is 'account_creation'.
            />
             {/* Actually, let's just use the AccountCreationFlow component directly if a specific flag is set, but 'opening_sequence' is the cinematic intro.
                 Let's add 'account_creation' to LoginState type.
             */}
        </div>
      );
  }
  
  // Correcting the flow:
  // 1. Intro -> Welcome
  // 2. Welcome -> Login (Security Check) OR Create Account (Flow -> Opening Sequence -> Logged In)
  // 3. Login -> Security Check -> Post Login Check -> Logged In
  
  return (
    <>
      {loginState === 'logged_out' && <LoggedOut user={userProfile} onLogin={() => setLoginState('profile_signin')} onSwitchUser={() => setLoginState('welcome')} />}
      
      {loginState === 'profile_signin' && <ProfileSignIn user={userProfile} onEnterDashboard={() => setLoginState('security_check')} />}

      {loginState === 'security_check' && <PostLoginSecurityCheck onComplete={() => setLoginState('logged_in')} />}
      
      {loginState === ('account_creation' as any) && (
          // This state is used for both "Account Creation Flow" and the "Cinematic Intro"
          // We need to distinguish. Let's assume we render AccountCreationFlow here, and it handles the animation itself or transitions to it.
          // Actually, the AccountCreationFlow component has a callback `onCreateAccountSuccess` which triggers the `OpeningSequence` component.
          // So we need a state for `account_creation`.
          <AccountCreationFlow 
            onBackToLogin={() => setLoginState('welcome')} 
            onCreateAccountSuccess={handleCreateAccount} // This function sets state to 'opening_sequence' (which is the cinematic part)
          />
      )}
      
      {/* We need to render the actual OpeningSequence component when state is 'opening_sequence' but right now I mapped it to AccountCreationFlow above which is wrong.
          Let's fix the state mapping in the main return.
      */}
    
      {/* CORRECTED MAIN RENDER */}
      <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 font-sans ${platformSettings.theme}`}>
        
        {loginState === 'intro' && <AdvancedFirstPage onComplete={() => setLoginState('welcome')} />}
        
        {loginState === 'welcome' && (
             <Welcome 
                onLogin={handleLogin} 
                onStartCreateAccount={() => setLoginState('account_creation' as any)} 
            />
        )}
        
        {loginState === ('account_creation' as any) && (
            <AccountCreationFlow 
                onBackToLogin={() => setLoginState('welcome')} 
                onCreateAccountSuccess={handleCreateAccount} 
            />
        )}
        
        {loginState === 'opening_sequence' && <OpeningSequence onComplete={() => setLoginState('logged_in')} />}

        {loginState === 'logged_in' && (
            <>
                <Header
                  onMenuToggle={() => setIsMenuOpen(true)}
                  isMenuOpen={isMenuOpen}
                  activeView={activeView}
                  setActiveView={setActiveView}
                  onLogout={() => setShowLogoutModal(true)}
                  notifications={notifications}
                  onMarkNotificationsAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  onNotificationClick={(view) => setActiveView(view)}
                  userProfile={userProfile}
                  onOpenLanguageSelector={() => setIsLanguageSelectorOpen(true)}
                  onUpdateProfilePicture={onUpdateProfilePicture}
                  onOpenSendMoneyFlow={onOpenSendMoneyFlow}
                  onOpenWireTransfer={onOpenWireTransfer}
                  displayCurrency={displayCurrency}
                  setDisplayCurrency={handleSetCurrency}
                />

                <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {activeView === 'dashboard' && (
                    <Dashboard
                      accounts={accounts}
                      transactions={transactions}
                      recipients={recipients}
                      createTransaction={createTransaction}
                      setActiveView={setActiveView}
                      travelPlans={travelPlans}
                      totalNetWorth={totalNetWorth}
                      portfolioChange24h={1.2}
                      userProfile={userProfile}
                      displayCurrency={displayCurrency}
                    />
                  )}
                  {activeView === 'history' && (
                    <ActivityLog 
                        transactions={transactions} 
                        onUpdateTransactions={(ids, updates) => setTransactions(prev => prev.map(t => ids.includes(t.id) ? { ...t, ...updates } : t))}
                        onRepeatTransaction={(tx) => onOpenSendMoneyFlow('send', tx)}
                        onAuthorizeTransaction={onAuthorizeTransaction}
                        accounts={accounts}
                        onContactSupport={(txId) => { setSupportInitialTxId(txId); setshowContactSupportModal(true); }}
                    />
                  )}
                  {activeView === 'send' && (
                      <div className="max-w-4xl mx-auto">
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Send & Request</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <button onClick={() => onOpenSendMoneyFlow('send')} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-digital hover:shadow-lg transition-all text-left group">
                                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                      <Icons.SendIcon className="w-6 h-6 text-primary" />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Send Money</h3>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Transfer funds instantly to friends, family, or businesses worldwide.</p>
                              </button>
                              <button onClick={() => onOpenWireTransfer()} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-digital hover:shadow-lg transition-all text-left group">
                                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                      <Icons.GlobeAmericasIcon className="w-6 h-6 text-purple-500" />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Wire Transfer</h3>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Send large amounts securely via domestic or international wire.</p>
                              </button>
                          </div>
                      </div>
                  )}
                  {activeView === 'recipients' && <Recipients recipients={recipients} addRecipient={addRecipient} onUpdateRecipient={onUpdateRecipient} />}
                  {activeView === 'cards' && (
                    <CardManagement 
                        cards={cards} 
                        virtualCards={virtualCards}
                        onUpdateVirtualCard={onUpdateVirtualCard}
                        cardTransactions={cardTransactions} 
                        onUpdateCardControls={onUpdateCardControls}
                        onAddCard={onAddCard}
                        onAddVirtualCard={onAddVirtualCard}
                        accountBalance={accounts.find(a => a.type === AccountType.CHECKING)?.balance || 0}
                        onAddFunds={onAddFunds}
                    />
                  )}
                  {activeView === 'security' && (
                    <Security
                      advancedTransferLimits={advancedTransferLimits}
                      onUpdateAdvancedLimits={onUpdateAdvancedLimits}
                      cards={cards}
                      onUpdateCardControls={onUpdateCardControls}
                      verificationLevel={verificationLevel}
                      onVerificationComplete={setVerificationLevel}
                      securitySettings={securitySettings}
                      onUpdateSecuritySettings={onUpdateSecuritySettings}
                      trustedDevices={trustedDevices}
                      onRevokeDevice={onRevokeDevice}
                      onChangePassword={() => setShowChangePasswordModal(true)}
                      transactions={transactions}
                      pushNotificationSettings={pushNotificationSettings}
                      onUpdatePushNotificationSettings={onUpdatePushNotificationSettings}
                      userProfile={userProfile}
                      onUpdateProfilePicture={onUpdateProfilePicture}
                      privacySettings={privacySettings}
                      onUpdatePrivacySettings={onUpdatePrivacySettings}
                    />
                  )}
                  {activeView === 'insurance' && <Insurance addNotification={addNotification} />}
                  {activeView === 'loans' && <Loans loanApplications={loanApplications} addLoanApplication={addLoanApplication} addNotification={addNotification} />}
                  {activeView === 'support' && <Support />}
                  {activeView === 'accounts' && <Accounts accounts={accounts} transactions={transactions} verificationLevel={verificationLevel} onUpdateAccountNickname={onUpdateAccountNickname} displayCurrency={displayCurrency} />}
                  {activeView === 'crypto' && (
                    <CryptoDashboard 
                        cryptoAssets={cryptoAssets} 
                        setCryptoAssets={setCryptoAssets}
                        holdings={cryptoHoldings} 
                        checkingAccount={accounts.find(a => a.type === AccountType.CHECKING)}
                        onBuy={onBuyCrypto}
                        onSell={onSellCrypto}
                    />
                  )}
                  {activeView === 'services' && (
                    <ServicesDashboard 
                        subscriptions={subscriptions} 
                        appleCardDetails={appleCardDetails} 
                        appleCardTransactions={appleCardTransactions}
                        onPaySubscription={onPaySubscription}
                        onUpdateSpendingLimits={onUpdateSpendingLimits}
                        onUpdateTransactionCategory={onUpdateTransactionCategory}
                    />
                  )}
                  {activeView === 'checkin' && <TravelCheckIn travelPlans={travelPlans} addTravelPlan={addTravelPlan} />}
                  {activeView === 'platform' && <PlatformFeatures settings={platformSettings} onUpdateSettings={setPlatformSettings} />}
                  {activeView === 'tasks' && <Tasks tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />}
                  {activeView === 'flights' && <Flights bookings={flightBookings} onBookFlight={onBookFlight} accounts={accounts} setActiveView={setActiveView} />}
                  {activeView === 'utilities' && <Utilities bills={utilityBills} billers={utilityBillers} onPayBill={onPayUtility} accounts={accounts} setActiveView={setActiveView} />}
                  {activeView === 'integrations' && <Integrations linkedServices={linkedServices} onLinkService={onLinkService} />}
                  {activeView === 'advisor' && (
                    <FinancialAdvisor 
                        analysis={financialAnalysis} 
                        isAnalyzing={isAnalyzing} 
                        analysisError={analysisError} 
                        runFinancialAnalysis={runFinancialAnalysis} 
                        setActiveView={setActiveView} 
                    />
                  )}
                  {activeView === 'invest' && <Investments />}
                  {activeView === 'atmLocator' && <AtmLocator />}
                  {activeView === 'quickteller' && <Quickteller airtimeProviders={airtimeProviders} purchases={airtimePurchases} accounts={accounts} onPurchase={onPurchaseAirtime} setActiveView={setActiveView} />}
                  {activeView === 'qrScanner' && <QrScanner hapticsEnabled={platformSettings.hapticsEnabled} />}
                  {activeView === 'privacy' && <PrivacyCenter settings={privacySettings} onUpdateSettings={onUpdatePrivacySettings} />}
                  {activeView === 'wire' && (
                      <WireTransfer 
                        accounts={accounts} 
                        onSendWire={createTransaction} 
                        onClose={() => setActiveView('dashboard')} 
                        initialData={wireTransferData} 
                        advancedTransferLimits={advancedTransferLimits}
                        addRecipient={addRecipient}
                        recipients={recipients}
                      />
                  )}
                  {activeView === 'about' && <About />}
                  {activeView === 'contact' && <Contact setActiveView={setActiveView} />}
                  {activeView === 'wallet' && <DigitalWallet wallet={walletDetails} />}
                  {activeView === 'ratings' && <Ratings />}
                  {activeView === 'globalAid' && <GlobalAid donations={donations} onDonate={onDonate} accounts={accounts} />}
                  {activeView === 'network' && <GlobalBankingNetwork onOpenWireTransfer={onOpenWireTransfer} setActiveView={setActiveView} />}
                </main>

                <Footer setActiveView={setActiveView} onOpenSendMoneyFlow={onOpenSendMoneyFlow} openLegalModal={openLegalModal} />
            </>
        )}

        {/* Modals & Overlays */}
        {showInactivityModal && <InactivityModal onStayLoggedIn={handleStayLoggedIn} onLogout={handleLogout} countdownStart={COUNTDOWN_START} />}
        {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} onSuccess={() => { setShowChangePasswordModal(false); addNotification(NotificationType.SECURITY, 'Password Changed', 'Your password was successfully updated.'); }} />}
        {pushNotification && <PushNotificationToast notification={pushNotification} onClose={() => setPushNotification(null)} />}
        {showSendMoneyFlow && (
            <SendMoneyFlow 
                recipients={recipients}
                accounts={accounts}
                createTransaction={createTransaction}
                transactions={transactions}
                securitySettings={securitySettings}
                hapticsEnabled={platformSettings.hapticsEnabled}
                onAuthorizeTransaction={onAuthorizeTransaction}
                setActiveView={setActiveView}
                onClose={() => { setShowSendMoneyFlow(false); setTransactionToRepeat(null); }}
                onLinkAccount={() => setShowLinkAccountModal(true)}
                onDepositCheck={onDepositCheck}
                onSplitTransaction={onSplitTransaction}
                initialTab={sendMoneyInitialTab}
                transactionToRepeat={transactionToRepeat}
                userProfile={userProfile}
                onContactSupport={() => setshowContactSupportModal(true)}
            />
        )}
        {showResumeSessionModal && savedSession && (
            <ResumeSessionModal 
                session={savedSession} 
                onResume={() => { setActiveView(savedSession.view); setLoginState('security_check'); setShowResumeSessionModal(false); }} 
                onStartFresh={() => { localStorage.removeItem('iCU_session'); setLoginState('welcome'); setShowResumeSessionModal(false); }} 
            />
        )}
        {showContactSupportModal && (
            <ContactSupportModal
                onClose={() => { setshowContactSupportModal(false); setSupportInitialTxId(undefined); }}
                onSubmit={async (data) => {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const ticketId = `TICKET-${Math.floor(Math.random() * 100000)}`;
                    addNotification(NotificationType.SUPPORT, 'Support Request Received', `Ticket #${ticketId} created. We'll be in touch shortly.`);
                    const {subject, body} = generateSupportTicketConfirmationEmail(userProfile.name, ticketId, data.topic);
                    if(privacySettings.email.security) sendTransactionalEmail(userProfile.email, subject, body);
                    if(privacySettings.sms.security) sendSmsNotification(userProfile.phone || '', generateSupportTicketConfirmationSms(ticketId));
                }}
                transactions={transactions}
                initialTransactionId={supportInitialTxId}
            />
        )}
        {showLinkAccountModal && (
            <LinkBankAccountModal
                onClose={() => setShowLinkAccountModal(false)}
                onLinkSuccess={(bankName, accountName, lastFour) => {
                    const newAccount: Account = {
                        id: `ext_acc_${Date.now()}`,
                        type: AccountType.EXTERNAL_LINKED,
                        nickname: `${bankName} - ${accountName}`,
                        accountNumber: `•••• ${lastFour}`,
                        fullAccountNumber: `XXXXXXXXXXXX${lastFour}`, // Mock
                        balance: 0, // External accounts don't show balance in this demo flow usually, or we mock it
                        features: ['Linked'],
                        status: 'Active'
                    };
                    setAccounts(prev => [...prev, newAccount]);
                    addNotification(NotificationType.ACCOUNT, 'Account Linked', `Your ${bankName} account has been successfully linked.`);
                    setShowLinkAccountModal(false);
                }}
            />
        )}
        {showLogoutModal && <LogoutConfirmationModal onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />}
        {isLanguageSelectorOpen && <LanguageSelector onClose={() => setIsLanguageSelectorOpen(false)} />}
        {legalModalContent && <LegalModal title={legalModalContent.title} content={legalModalContent.content} onClose={() => setLegalModalContent(null)} />}
      </div>
    </>
  );
};