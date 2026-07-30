import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle2, AlertCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

function formatQ(amount: number) {
  return "Q" + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'progreso' | 'planificador'>('progreso');
  
  // Estado para Progreso
  const [progresoGoal, setProgresoGoal] = useState<string>('');
  const [progresoSales, setProgresoSales] = useState<string>('');
  
  // Estado para Planificador
  const [planificadorGoal, setPlanificadorGoal] = useState<string>('');
  const [planificadorSales, setPlanificadorSales] = useState<string>('');
  const [planificadorDesiredSalary, setPlanificadorDesiredSalary] = useState<string>('');

  const numProgresoGoal = parseFloat(progresoGoal.replace(/,/g, '')) || 0;
  const numProgresoSales = parseFloat(progresoSales.replace(/,/g, '')) || 0;
  
  const numPlanificadorGoal = parseFloat(planificadorGoal.replace(/,/g, '')) || 0;
  const numPlanificadorSales = parseFloat(planificadorSales.replace(/,/g, '')) || 0;
  const numPlanificadorDesiredSalary = parseFloat(planificadorDesiredSalary.replace(/,/g, '')) || 0;

  // Calculation Logic
  // 1. Remove IVA (12%) -> amount / 1.12
  // 2. Calculate Salary (2%) -> base * 0.02
  const calculateCommission = (amount: number) => {
    return (amount / 1.12) * 0.02;
  };

  // Logic para Progreso
  const progresoProjectedSalary = calculateCommission(numProgresoGoal);
  const progresoCurrentSalary = calculateCommission(numProgresoSales);
  const progresoDifference = numProgresoGoal - numProgresoSales;
  const isProgresoGoalReached = progresoDifference <= 0;

  // Date Logic
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  const daysLeft = daysInMonth - currentDay + 1; // Including today

  const progresoDailyRequired = !isProgresoGoalReached && daysLeft > 0 ? progresoDifference / daysLeft : 0;
  const progresoGeneralDailyRequired = numProgresoGoal > 0 ? numProgresoGoal / daysInMonth : 0;
  const progresoProgressPercentage = numProgresoGoal > 0 ? Math.min((numProgresoSales / numProgresoGoal) * 100, 100) : 0;

  // Logic para Planificador
  const planificadorDesiredGoalNoIva = numPlanificadorDesiredSalary > 0 ? numPlanificadorDesiredSalary / 0.02 : 0;
  const planificadorDesiredGoalWithIva = planificadorDesiredGoalNoIva > 0 ? planificadorDesiredGoalNoIva * 1.12 : 0;
  const planificadorDesiredDifference = planificadorDesiredGoalWithIva - numPlanificadorSales;
  const planificadorDesiredDailyRequired = planificadorDesiredDifference > 0 && daysLeft > 0 ? planificadorDesiredDifference / daysLeft : 0;
  const planificadorGeneralDesiredDailyRequired = planificadorDesiredGoalWithIva > 0 ? planificadorDesiredGoalWithIva / daysInMonth : 0;

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-neutral-900 flex justify-center items-start pt-8 md:pt-16">
      <main className="w-full max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Calculadora de Comisiones</h1>
          <p className="text-sm text-neutral-500">Basado en meta mensual y 2% de comisión (sin IVA)</p>
        </header>

        {/* Tabs */}
        <div className="flex bg-neutral-200/50 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('progreso')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'progreso' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Progreso
          </button>
          <button 
            onClick={() => setActiveTab('planificador')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'planificador' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Planificador
          </button>
        </div>

        {activeTab === 'progreso' && (
          <motion.div
            key="progreso"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
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
                  value={progresoGoal}
                  onChange={(e) => setProgresoGoal(e.target.value)}
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
                  value={progresoSales}
                  onChange={(e) => setProgresoSales(e.target.value)}
                  className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
                  placeholder="Ej. 150000"
                />
                {numProgresoSales > 0 && (
                  <p className="text-xs text-neutral-500 pl-2">Equivale a {formatQ(numProgresoSales / 1.12)} sin IVA</p>
                )}
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60 space-y-6">
              {/* Salaries */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Salario Actual</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatQ(progresoCurrentSalary)}</p>
                </div>
                <div className="space-y-1 border-l border-neutral-100 pl-4">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Salario Meta</p>
                  <p className="text-2xl font-semibold text-neutral-800">{formatQ(progresoProjectedSalary)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-neutral-600">Progreso de meta</span>
                  <span className="text-neutral-900">{progresoProgressPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${isProgresoGoalReached ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progresoProgressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Dynamic Stats */}
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                {isProgresoGoalReached && numProgresoGoal > 0 ? (
                  <div className="flex items-start gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">¡Felicidades, llegaste a la meta!</p>
                      <p className="text-sm opacity-90 mt-0.5">Has superado la meta por {formatQ(Math.abs(progresoDifference))}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-2xl">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-900">Faltan {formatQ(progresoDifference)}</p>
                      <p className="text-sm mt-0.5 opacity-90">para alcanzar la meta mensual.</p>
                    </div>
                  </div>
                )}

                <div className="bg-neutral-50 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Meta Diaria (Mes de {daysInMonth} días)</span>
                  </div>
                  <p className="text-lg font-semibold text-neutral-800">{formatQ(progresoGeneralDailyRequired)}</p>
                </div>

                {!isProgresoGoalReached && daysLeft > 0 && (
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
                      <p className="text-lg font-semibold text-neutral-800">{formatQ(progresoDailyRequired)}</p>
                    </div>
                  </div>
                )}

                {!isProgresoGoalReached && daysLeft <= 0 && (
                   <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                     <p className="text-sm text-neutral-600">El mes ha terminado.</p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'planificador' && (
          <motion.div
            key="planificador"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
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
                  value={planificadorGoal}
                  onChange={(e) => setPlanificadorGoal(e.target.value)}
                  className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-neutral-400"
                  placeholder="Ej. 350000"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Venta Alcanzada (Q)
                </label>
                <input
                  type="number"
                  value={planificadorSales}
                  onChange={(e) => setPlanificadorSales(e.target.value)}
                  className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
                  placeholder="Ej. 150000"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Salario Deseado (Q)
                </label>
                <input
                  type="number"
                  value={planificadorDesiredSalary}
                  onChange={(e) => setPlanificadorDesiredSalary(e.target.value)}
                  className="w-full text-2xl font-medium bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-400"
                  placeholder="Ej. 10000"
                />
              </div>
            </div>

            {/* Results Card */}
            {numPlanificadorDesiredSalary > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60 space-y-5">
                <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-2">Análisis de Salario</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Meta requerida (Con IVA)</p>
                    <p className="text-xl font-bold text-blue-600">{formatQ(planificadorDesiredGoalWithIva)}</p>
                  </div>
                  <div className="space-y-1 border-l border-neutral-100 pl-4">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Sin IVA</p>
                    <p className="text-xl font-semibold text-neutral-800">{formatQ(planificadorDesiredGoalNoIva)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-4">
                  {planificadorDesiredDifference <= 0 ? (
                    <div className="flex items-start gap-3 bg-blue-50 text-blue-700 p-4 rounded-2xl">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">¡Ya aseguraste tu salario deseado!</p>
                        <p className="text-sm mt-0.5 opacity-90">Tus ventas actuales ({formatQ(numPlanificadorSales)}) superan la meta requerida.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 bg-neutral-50 text-neutral-800 p-4 rounded-2xl">
                        <Target className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                        <div>
                          <p className="font-medium">Faltan {formatQ(planificadorDesiredDifference)}</p>
                          <p className="text-sm mt-0.5 text-neutral-500">en ventas para tu salario deseado.</p>
                        </div>
                      </div>

                      {daysLeft > 0 && (
                        <div className="bg-neutral-50 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-medium">Diaria necesaria (restante):</span>
                          </div>
                          <p className="text-lg font-semibold text-neutral-800">{formatQ(planificadorDesiredDailyRequired)}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="bg-neutral-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Meta diaria (mes completo):</span>
                    </div>
                    <p className="text-lg font-semibold text-neutral-800">{formatQ(planificadorGeneralDesiredDailyRequired)}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
