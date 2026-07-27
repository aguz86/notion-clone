import React, { useState, useEffect } from 'react';
import { X, Target, Briefcase, Plus, Calendar } from 'lucide-react';
import { generateId } from '../utils';
import { Project } from '../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
}

export default function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [icon, setIcon] = useState('🎯');
  const [totalHours, setTotalHours] = useState<number | ''>('');
  const [hoursPerDay, setHoursPerDay] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (startDate && totalHours && hoursPerDay && Number(hoursPerDay) > 0) {
      const days = Math.ceil(Number(totalHours) / Number(hoursPerDay));
      const calculatedDate = new Date(startDate);
      calculatedDate.setDate(calculatedDate.getDate() + days);
      setDueDate(calculatedDate.toISOString().split('T')[0]);
    }
  }, [startDate, totalHours, hoursPerDay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: generateId(),
      title: title || 'Untitled Project',
      description,
      icon,
      status: 'Planning',
      tasks: [],
      budget: budget || 0,
      budgetSpent: 0,
      startDate,
      dueDate: dueDate || undefined,
      totalEstimatedHours: totalHours !== '' ? Number(totalHours) : undefined,
      estimatedHoursPerDay: hoursPerDay !== '' ? Number(hoursPerDay) : undefined
    };
    
    onAdd(newProject);
    setTitle('');
    setDescription('');
    setBudget(0);
    setIcon('🎯');
    setTotalHours('');
    setHoursPerDay('');
    setStartDate('');
    setDueDate('');
    onClose();
  };

  const ICONS = ['🎯', '🚀', '💻', '🎨', '📈', '📱', '🔧', '🌐'];

  const formatNumber = (val: number) => {
    if (!val) return '';
    return val.toLocaleString('id-ID');
  };

  const handleNumberChange = (val: string, setter: (val: number) => void) => {
    const raw = val.replace(/[^0-9]/g, '');
    setter(Number(raw));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-lg font-bold text-[#37352f] dark:text-gray-100">
            <Briefcase size={20} className="text-blue-500" />
            Tambah Projek Baru
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ikon Projek
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                    icon === i 
                      ? 'bg-blue-100 border-blue-500 shadow-sm dark:bg-blue-900/30' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  } border`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nama Projek
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
              placeholder="Contoh: Website Redesign 2026"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200 resize-none"
              placeholder="Tujuan dan ruang lingkup projek..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Anggaran (Budget)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
              <input
                type="text"
                value={formatNumber(budget)}
                onChange={(e) => handleNumberChange(e.target.value, setBudget)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Total Estimasi (Jam)
              </label>
              <input
                type="number"
                min="0"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Estimasi per Hari (Jam)
              </label>
              <input
                type="number"
                min="0"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#37352f] dark:text-gray-200"
                />
              </div>
              {startDate !== '' && totalHours !== '' && hoursPerDay !== '' && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Otomatis dikalkulasi.
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Buat Projek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
