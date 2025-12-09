import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Sparkles, AlertCircle } from 'lucide-react';
import { forecastBedOccupancy } from '../services/geminiService';

const data = [
  { name: 'Mon', occupancy: 65, staff: 40 },
  { name: 'Tue', occupancy: 68, staff: 42 },
  { name: 'Wed', occupancy: 75, staff: 45 },
  { name: 'Thu', occupancy: 82, staff: 48 },
  { name: 'Fri', occupancy: 85, staff: 50 },
  { name: 'Sat', occupancy: 70, staff: 40 },
  { name: 'Sun', occupancy: 60, staff: 35 },
];

const StatCard = ({ title, value, sub, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-teal-50 rounded-lg">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{sub}</p>
  </div>
);

export default function Dashboard() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateForecast = async () => {
    setLoading(true);
    const summary = "Current avg occupancy 72%. Weekly trend rising by 5%. Flu season approaching.";
    const result = await forecastBedOccupancy(summary);
    setAiInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
          <p className="text-slate-500 text-sm">Real-time hospital operational metrics.</p>
        </div>
        <button 
            onClick={generateForecast}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 text-sm font-medium"
        >
          {loading ? (
              <span className="animate-pulse">Consulting Vertex AI...</span>
          ) : (
              <>
                  <Sparkles size={16} />
                  Generate AI Forecast
              </>
          )}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="1,248" sub="142 Admitted Today" icon={Users} trend={12} />
        <StatCard title="Revenue (MTD)" value="$4.2M" sub="Pending Claims: $850k" icon={DollarSign} trend={8} />
        <StatCard title="Bed Occupancy" value="78%" sub="Critical Care: 92%" icon={Activity} trend={-2} />
        <StatCard title="Staff Active" value="342" sub="Nurse:Patient Ratio 1:4" icon={TrendingUp} trend={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Bed Occupancy & Resource Forecast</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="occupancy" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorOccupancy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="font-semibold tracking-wide">Vertex AI Insights</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {aiInsight ? (
                    <div className="prose prose-invert prose-sm">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-700">{aiInsight}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                        <Activity className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-sm">Click "Generate Forecast" to analyze occupancy trends using our Predictive Model.</p>
                    </div>
                )}
            </div>

            {!aiInsight && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <AlertCircle size={12} />
                        <span>Model: gemini-2.5-flash (Time-series)</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}