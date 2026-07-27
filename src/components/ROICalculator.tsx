import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function ROICalculator() {
  const [businessModel, setBusinessModel] = useState<'startup' | 'fb_ads'>('startup');
  const [initialCapital, setInitialCapital] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  
  // Startup Model
  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);

  // FB Ads Model
  const [salesPerDay, setSalesPerDay] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [costPerSale, setCostPerSale] = useState<number>(0);
  const [adminFee, setAdminFee] = useState<number>(0);

  let annualCost = 0;
  let annualProfit = 0;

  if (businessModel === 'startup') {
    annualCost = monthlyCost * 12;
    annualProfit = monthlyProfit * 12;
  } else {
    const monthlySalesCount = salesPerDay * 30;
    const monthlyGrossProfit = monthlySalesCount * productPrice;
    const monthlyAdsCost = monthlySalesCount * costPerSale;
    const monthlyAdminFee = monthlySalesCount * adminFee;
    
    annualCost = (monthlyCost + monthlyAdsCost + monthlyAdminFee) * 12;
    annualProfit = monthlyGrossProfit * 12;
  }

  const netAnnualProfit = annualProfit - annualCost;
  const totalInvestment = initialCapital + annualCost;
  const roi = totalInvestment > 0 ? (netAnnualProfit / totalInvestment) * 100 : 0;

  const formatNumber = (val: number) => {
    if (!val) return '';
    return val.toLocaleString('id-ID');
  };

  const handleNumberChange = (val: string, setter: (val: number) => void) => {
    const raw = val.replace(/[^0-9]/g, '');
    setter(Number(raw));
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl mx-auto w-full text-[#37352f] dark:text-gray-200">
      <div className="flex items-center mb-6">
        <Calculator size={32} className="mr-4 text-blue-500" />
        <h1 className="text-4xl font-bold">ROI Calculator</h1>
      </div>
      
      <div className="mb-8 text-gray-500 dark:text-gray-400">
        Hitung Return on Investment (ROI) dan proyeksi profit tahunan secara real-time.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Input Data</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model Usaha
            </label>
            <select
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value as 'startup' | 'fb_ads')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
            >
              <option value="startup">Startup / Reguler</option>
              <option value="fb_ads">FB Ads Produk Digital</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modal Awal
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
              <input
                type="text"
                value={formatNumber(initialCapital)}
                onChange={(e) => handleNumberChange(e.target.value, setInitialCapital)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biaya Bulanan Tetap
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
              <input
                type="text"
                value={formatNumber(monthlyCost)}
                onChange={(e) => handleNumberChange(e.target.value, setMonthlyCost)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                placeholder="0"
              />
            </div>
          </div>
          
          {businessModel === 'startup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Untung Bulanan
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                <input
                  type="text"
                  value={formatNumber(monthlyProfit)}
                  onChange={(e) => handleNumberChange(e.target.value, setMonthlyProfit)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {businessModel === 'fb_ads' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah Sales per Hari
                </label>
                <input
                  type="text"
                  value={formatNumber(salesPerDay)}
                  onChange={(e) => handleNumberChange(e.target.value, setSalesPerDay)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harga Produk
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                  <input
                    type="text"
                    value={formatNumber(productPrice)}
                    onChange={(e) => handleNumberChange(e.target.value, setProductPrice)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biaya per Sales (CPA/Ads)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                  <input
                    type="text"
                    value={formatNumber(costPerSale)}
                    onChange={(e) => handleNumberChange(e.target.value, setCostPerSale)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biaya Admin per Transaksi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                  <input
                    type="text"
                    value={formatNumber(adminFee)}
                    onChange={(e) => handleNumberChange(e.target.value, setAdminFee)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <h2 className="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-100">Proyeksi Tahunan</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-blue-200 dark:border-blue-800/50">
              <span className="text-gray-600 dark:text-gray-400">Total Modal (Modal + Biaya 1 Tahun)</span>
              <span className="text-lg font-semibold">Rp {totalInvestment.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-blue-200 dark:border-blue-800/50">
              <span className="text-gray-600 dark:text-gray-400">Total Untung Kotor 1 Tahun</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">Rp {annualProfit.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-blue-200 dark:border-blue-800/50">
              <span className="text-gray-600 dark:text-gray-400">Total Untung Bersih 1 Tahun</span>
              <span className={`text-xl font-bold ${netAnnualProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Rp {netAnnualProfit.toLocaleString('id-ID')}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Return on Investment (ROI)</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${roi >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {roi.toFixed(2)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ tahun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
