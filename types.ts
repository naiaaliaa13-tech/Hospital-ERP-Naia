export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    status: 'Inpatient' | 'Outpatient' | 'Discharged' | 'Critical';
    roomNumber?: string;
    admissionDate: string;
    diagnosis: string;
    lastVitals?: {
      bp: string;
      hr: number;
      temp: number;
    };
  }
  
  export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'Credit' | 'Debit';
    category: 'Billing' | 'Procurement' | 'Payroll' | 'Operational';
    status: 'Cleared' | 'Pending' | 'Flagged';
    referenceId: string;
  }
  
  export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    stockLevel: number;
    unit: string;
    minThreshold: number;
    expiryDate: string;
    category: 'Pharmaceutical' | 'Surgical' | 'Equipment';
    predictedDemand?: number; // AI populated
  }
  
  export interface AIInsight {
    title: string;
    content: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }