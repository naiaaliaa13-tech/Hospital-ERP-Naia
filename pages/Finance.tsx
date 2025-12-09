import React, { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, Search, Download } from 'lucide-react';
import { Transaction } from '../types';
import { detectFinancialAnomalies } from '../services/geminiService';

const mockTransactions: Transaction[] = [
  { id: 'TRX-9920', date: '2024-03-10', description: 'Pharmaceutical Supply Inc - Invoice #442', amount: 12500.00, type: 'Debit', category: 'Procurement', status: 'Pending', referenceId: 'PO-5512' },
  { id: 'TRX-9921', date: '2024-03-10', description: 'Insurance Claim Payout - Aetna', amount: 4500.00, type: 'Credit', category: 'Billing', status: 'Cleared', referenceId: 'CLM-1102' },
  { id: 'TRX-9922', date: '2024-03-11', description: 'Consultant Fee - Unspecified', amount: 9999.00, type: 'Debit', category: 'Operational', status: 'Pending', referenceId: 'INV-000' },
  { id: 'TRX-9923', date: '2024-03-11', description: 'Consultant Fee - Unspecified', amount: 9999.00, type: 'Debit', category: 'Operational', status: 'Pending', referenceId: 'INV-000' }, // Duplicate intended
  { id: 'TRX-9924', date: '2024-03-12', description: 'Cafeteria Revenue', amount: 850.50, type: 'Credit', category: 'Operational', status: 'Cleared', referenceId: 'POS-Daily' },
];

export default function Finance() {
  const [anomalyReport, setAnomalyReport] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runAnomalyDetection = async () => {
    setIsScanning(true);
    // Simulate slight delay for effect before API call
    setTimeout(async () => {
      const result = await detectFinancialAnomalies(JSON.stringify(mockTransactions));
      setAnomalyReport(result);
      setIsScanning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Core Finance & General Ledger</h2>
            <p className="text-slate-500 text-sm">Monitor cash flow, claims, and audit logs.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                <Download size={16} />
                Export Ledger
             </button>
             <button 
                onClick={runAnomalyDetection}
                disabled={isScanning}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md shadow-rose-500/20 text-sm font-medium transition-all disabled:opacity-70"
             >
                {isScanning ? <span className="animate-pulse">Auditing...</span> : (
                    <>
                        <AlertTriangle size={16} />
                        AI Fraud Audit
                    </>
                )}
             </button>
          </div>
       </div>

       {/* Anomaly Report Alert */}
       {anomalyReport && (
         <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-3">
               <div className="p-2 bg-rose-100 rounded-lg">
                  <AlertTriangle className="text-rose-600" size={20} />
               </div>
               <div className="flex-1">
                  <h3 className="text-rose-800 font-bold text-sm uppercase tracking-wide mb-2">Anomaly Detection Report</h3>
                  <div className="prose prose-sm prose-rose text-rose-700 max-w-none">
                     <p className="whitespace-pre-wrap">{anomalyReport}</p>
                  </div>
               </div>
               <button onClick={() => setAnomalyReport(null)} className="text-rose-400 hover:text-rose-600">Dismiss</button>
            </div>
         </div>
       )}

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex gap-4 items-center">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter transactions..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                />
             </div>
          </div>
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                   <th className="p-4 font-semibold">Reference</th>
                   <th className="p-4 font-semibold">Date</th>
                   <th className="p-4 font-semibold">Description</th>
                   <th className="p-4 font-semibold">Category</th>
                   <th className="p-4 font-semibold text-right">Amount</th>
                   <th className="p-4 font-semibold text-center">Status</th>
                </tr>
             </thead>
             <tbody className="text-sm divide-y divide-slate-100">
                {mockTransactions.map((tx) => (
                   <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 font-mono text-slate-400 text-xs">{tx.id}</td>
                      <td className="p-4 text-slate-600">{tx.date}</td>
                      <td className="p-4 font-medium text-slate-800">{tx.description}</td>
                      <td className="p-4 text-slate-500">
                         <span className="px-2 py-1 bg-slate-100 rounded text-xs">{tx.category}</span>
                      </td>
                      <td className={`p-4 text-right font-bold ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                         {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                         <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 
                            tx.status === 'Flagged' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                         }`}>
                            {tx.status}
                         </span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}