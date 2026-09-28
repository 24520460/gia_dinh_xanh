export type ScreenId = 
  | 'customer-landing'
  | 'customer-booking'
  | 'customer-tracking'
  | 'customer-appointments'
  | 'partner-shift'
  | 'partner-board'
  | 'partner-wallet'
  | 'admin-dashboard'
  | 'admin-pricing'
  | 'admin-kyc';

export type UserRole = 'customer' | 'partner' | 'admin';

export interface OrderItem {
  id: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  service: string;
  serviceType: 'clean' | 'cook' | 'deep-clean';
  partnerName: string;
  partnerRating: number;
  partnerCompletedJobs: number;
  partnerAvatar: string;
  timeSlot: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'in_progress' | 'dispute' | 'completed' | 'waiting_partner' | 'in_transit';
  statusLabel: string;
}

export interface KYCCandidate {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  submittedTime: string;
  specialties: string[];
  status: 'pending' | 'needs_update' | 'approved' | 'rejected';
  statusLabel: string;
  cccdNumber: string;
  dob: string;
  cccdIssueDate: string;
  judicialRecordNumber: string;
  hospital: string;
  examDate: string;
  hepBResult: string;
  xrayResult: string;
  theoryScore: number;
  interviewer: string;
  interviewDate: string;
  evalComments: string;
}
