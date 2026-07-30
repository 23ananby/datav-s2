import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle2, AlertCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

function formatQ(amount: number) {
  return "Q" + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function App() {
  const [goal, setGoal] = useState<string>('');
  const [currentSales, setCurrentSales] = useState<string>('');

  const numGoal = parseFloat(goal.replace(/,/g, '')) || 0;
  const numSales = parseFloat(currentSales.replace(/,/g, '')) || 0;
  
  // Calculation Logic
  // 1. Remove IVA (12%) -> amount / 1.12
  // 2. Calculate Salary (2%) -> base * 0.02
  const calculateCommission = (amount: number) => {
    return (amount / 1.12) * 0.02;
  };

  const projectedSalary = calculateCommission(numGoal);
  const currentSalary = calculateCommission(numSales);
  const difference = numGoal - numSales;
  const isGoalReached = difference <= 0;

  // Date Logic
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  const daysLeft = daysInMonth - currentDay + 1; // Including today

  const dailyRequired = !isGoalReached && daysLeft > 0 ? difference / daysLeft : 0;
  const generalDailyRequired = numGoal > 0 ? numGoal / daysInMonth : 0;
  const progressPercentage = numGoal > 0 ? Math.min((numSales / numGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-neutral-900 flex justify-center items-start pt-8 md:pt-16">
      <main className="w-full max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Calculadora de Comisiones</h1>
          <p className="text-sm text-neutral-500">Basado en meta mensual y 2% de comisión (sin IVA)</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Inputs Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Meta Mensual (Q)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-neutral-400"
                placeholder="Ej. 350000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Venta Alcanzada (Q)
              </label>
              <input
                type="number"
                value={currentSales}
                onChange={(e) => setCurrentSales(e.target.value)}
                className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
                placeholder="Ej. 150000"
              />
              {numSales > 0 && (
                <p className="text-xs text-neutral-500 pl-2">Equivale a {formatQ(numSales / 1.12)} sin IVA</p>
              )}
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60 space-y-6">
            {/* Salaries */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Salario Actual</p>
                <p className="text-2xl font-bold text-emerald-600">{formatQ(currentSalary)}</p>
              </div>
              <div className="space-y-1 border-l border-neutral-100 pl-4">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Salario Meta</p>
                <p className="text-2xl font-semibold text-neutral-800">{formatQ(projectedSalary)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Progreso de meta</span>
                <span className="text-neutral-900">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${isGoalReached ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Dynamic Stats */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              {isGoalReached && numGoal > 0 ? (
                <div className="flex items-start gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">¡Felicidades, llegaste a la meta!</p>
                    <p className="text-sm opacity-90 mt-0.5">Has superado la meta por {formatQ(Math.abs(difference))}.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-2xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">Faltan {formatQ(difference)}</p>
                    <p className="text-sm mt-0.5 opacity-90">para alcanzar la meta mensual.</p>
                  </div>
                </div>
              )}

              <div className="bg-neutral-50 p-4 rounded-2xl flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Meta Diaria (Mes de {daysInMonth} días)</span>
                </div>
                <p className="text-lg font-semibold text-neutral-800">{formatQ(generalDailyRequired)}</p>
              </div>

              {!isGoalReached && daysLeft > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 p-4 rounded-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Días Restantes</span>
                    </div>
                    <p className="text-lg font-semibold text-neutral-800">{daysLeft} <span className="text-sm font-normal text-neutral-500 tracking-normal">días</span></p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Diaria Restante</span>
                    </div>
                    <p className="text-lg font-semibold text-neutral-800">{formatQ(dailyRequired)}</p>
                  </div>
                </div>
              )}

              {!isGoalReached && daysLeft <= 0 && (
                 <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                   <p className="text-sm text-neutral-600">El mes ha terminado.</p>
                 </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
