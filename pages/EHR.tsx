import React, { useState } from 'react';
import { Search, Filter, ChevronRight, MessageSquare, Mic, FileText, Activity, Users } from 'lucide-react';
import { Patient } from '../types';
import { generateClinicalInsight } from '../services/geminiService';

const mockPatients: Patient[] = [
  { id: 'P-1001', name: 'Eleanor Rigby', age: 72, gender: 'Female', status: 'Inpatient', admissionDate: '2023-10-24', diagnosis: 'Acute Congestive Heart Failure', lastVitals: { bp: '140/90', hr: 88, temp: 37.1 }, roomNumber: 'ICU-04' },
  { id: 'P-1002', name: 'Father McKenzie', age: 65, gender: 'Male', status: 'Inpatient', admissionDate: '2023-10-25', diagnosis: 'Pneumonia (Viral)', lastVitals: { bp: '120/80', hr: 76, temp: 38.5 }, roomNumber: 'WD-102' },
  { id: 'P-1003', name: 'Desmond Jones', age: 45, gender: 'Male', status: 'Outpatient', admissionDate: '2023-10-26', diagnosis: 'Type 2 Diabetes Checkup', lastVitals: { bp: '130/85', hr: 72, temp: 36.6 } },
];

export default function EHR() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setAiAnalysis(''); 
  };

  const handleRunAI = async () => {
    if (!selectedPatient) return;
    setAnalyzing(true);
    const context = `
      Name: ${selectedPatient.name}, Age: ${selectedPatient.age}, Diagnosis: ${selectedPatient.diagnosis}.
      Vitals: BP ${selectedPatient.lastVitals?.bp}, HR ${selectedPatient.lastVitals?.hr}, Temp ${selectedPatient.lastVitals?.temp}.
      Status: ${selectedPatient.status}.
    `;
    const insight = await generateClinicalInsight(context);
    setAiAnalysis(insight);
    setAnalyzing(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Patient List (Left) */}
      <div className={`${selectedPatient ? 'hidden lg:block w-1/3' : 'w-full'} bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 mb-4">Patient Registry</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Name or MRN" 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockPatients.map((p) => (
            <div 
              key={p.id}
              onClick={() => handlePatientSelect(p)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedPatient?.id === p.id ? 'bg-teal-50/50 border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.status === 'Inpatient' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">ID: {p.id} • {p.age} yrs • {p.gender}</p>
              <p className="text-sm text-slate-700 truncate">{p.diagnosis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Detail & AI Assistant (Right) */}
      {selectedPatient ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                 <button className="text-slate-400 hover:text-slate-600 lg:hidden" onClick={() => setSelectedPatient(null)}>
                    Back
                 </button>
              </div>
              <p className="text-slate-500 mt-1">MRN: {selectedPatient.id} • Admitted: {selectedPatient.admissionDate}</p>
            </div>
            <div className="flex gap-2">
               <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  <FileText size={18} />
               </button>
               <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-500/20">
                  Update Chart
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
             {/* Clinical Data */}
             <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Vitals */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Blood Pressure</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">{selectedPatient.lastVitals?.bp}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Heart Rate</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">{selectedPatient.lastVitals?.hr} <span className="text-xs font-normal text-slate-400">bpm</span></p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Temp</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">{selectedPatient.lastVitals?.temp}°C</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Current Diagnosis</h3>
                   <p className="text-slate-700 bg-amber-50 p-3 rounded border border-amber-100">{selectedPatient.diagnosis}</p>
                </div>
                
                 <div className="space-y-2">
                   <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Clinical Notes</h3>
                   <div className="text-sm text-slate-600 space-y-2">
                      <p>Patient presenting with shortness of breath and fatigue. History of hypertension.</p>
                      <p>Labs ordered: CBC, BMP, BNP. Echocardiogram scheduled for tomorrow morning.</p>
                   </div>
                </div>
             </div>

             {/* AI Assistant Sidebar (Right within panel) */}
             <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                   <div className="flex items-center gap-2 text-teal-700">
                      <Activity size={18} />
                      <span className="font-semibold text-sm">Clinical Assistant</span>
                   </div>
                   <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Gemini Powered</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                   {/* Initial Prompt */}
                   {!aiAnalysis && !analyzing && (
                      <div className="text-center py-8">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-200">
                             <Activity className="text-teal-500 w-6 h-6" />
                         </div>
                         <p className="text-slate-500 text-sm mb-4">I can analyze this patient's chart for insights.</p>
                         <button 
                            onClick={handleRunAI}
                            className="bg-white border border-teal-200 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors shadow-sm"
                         >
                            Analyze Patient Context
                         </button>
                      </div>
                   )}

                   {analyzing && (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                         <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-xs text-slate-400">Processing medical records...</p>
                      </div>
                   )}

                   {aiAnalysis && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                         <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">AI Summary</h4>
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
                      </div>
                   )}
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-slate-200 bg-white">
                   <div className="relative">
                      <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         placeholder="Ask assistant..." 
                         className="w-full pl-4 pr-10 py-2.5 bg-slate-100 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600">
                         <Mic size={16} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-slate-400 flex-col gap-4">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Users size={32} />
           </div>
           <p>Select a patient to view Electronic Health Records</p>
        </div>
      )}
    </div>
  );
}