import React from 'react';
import { Pill, AlertCircle, RefreshCw } from 'lucide-react';
import { InventoryItem } from '../types';

const mockInventory: InventoryItem[] = [
  { id: 'INV-001', name: 'Amoxicillin 500mg', sku: 'PH-AMX-500', stockLevel: 450, unit: 'Capsules', minThreshold: 500, expiryDate: '2025-12-01', category: 'Pharmaceutical', predictedDemand: 800 },
  { id: 'INV-002', name: 'Metformin 850mg', sku: 'PH-MET-850', stockLevel: 1200, unit: 'Tabs', minThreshold: 200, expiryDate: '2024-08-15', category: 'Pharmaceutical', predictedDemand: 1250 },
  { id: 'INV-003', name: 'Surgical Gloves (L)', sku: 'EQ-GLV-L', stockLevel: 50, unit: 'Box', minThreshold: 100, expiryDate: 'N/A', category: 'Surgical', predictedDemand: 120 },
];

export default function Inventory() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">Pharmacy & Inventory</h2>
             <p className="text-slate-500 text-sm">Stock tracking driven by AI demand prediction.</p>
          </div>
          <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm">
             <RefreshCw size={16} />
             Refresh Stock Levels
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockInventory.map((item) => {
             const isLowStock = item.stockLevel < item.minThreshold;
             const isPredictedShortage = item.predictedDemand ? item.stockLevel < item.predictedDemand : false;

             return (
               <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  {/* Status Bar */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${isLowStock ? 'bg-rose-500' : isPredictedShortage ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-3 pl-3">
                     <div>
                        <span className="text-xs font-mono text-slate-400 block mb-1">{item.sku}</span>
                        <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                     </div>
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                        <Pill size={20} />
                     </div>
                  </div>

                  <div className="pl-3 grid grid-cols-2 gap-4 my-4">
                     <div>
                        <p className="text-xs text-slate-500 uppercase">Current Stock</p>
                        <p className={`text-xl font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>{item.stockLevel}</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase flex items-center gap-1">
                           AI Demand 
                           <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        </p>
                        <p className="text-xl font-bold text-slate-800">{item.predictedDemand || '-'}</p>
                     </div>
                  </div>

                  {(isLowStock || isPredictedShortage) && (
                     <div className="ml-3 mt-2 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" />
                        <div>
                           <p className="text-xs font-bold text-rose-700">Restock Recommended</p>
                           <p className="text-[10px] text-rose-600 mt-0.5">
                              {isLowStock ? "Below safety threshold." : "AI predicts upcoming shortage based on disease trends."}
                           </p>
                           <button className="mt-2 text-xs bg-rose-600 text-white px-3 py-1.5 rounded shadow-sm hover:bg-rose-700 transition-colors">
                              Generate PO
                           </button>
                        </div>
                     </div>
                  )}
               </div>
             )
          })}
       </div>
    </div>
  );
}