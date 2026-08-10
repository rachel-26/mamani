import React, { useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useApi } from '../hooks/useApi';
import { getGoals, createGoal, depositToGoal, deleteGoal } from '../api/goals';

interface GoalOut {
  id: number;
  title: string;
  saved_amount: number;
  target_amount: number;
  progress_percentage: number;
  target_date: string | null;
  is_short_term: boolean;
  image_url: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  high:   'bg-primary/90 text-white',
  medium: 'bg-secondary/90 text-white',
  low:    'bg-orange-400 text-white',
};

function getStatus(pct: number): { label: string; colorClass: string } {
  if (pct >= 70) return { label: 'Ahead of Schedule', colorClass: STATUS_COLORS.high };
  if (pct >= 40) return { label: 'On Track',          colorClass: STATUS_COLORS.medium };
  return           { label: 'Needs Focus',            colorClass: STATUS_COLORS.low };
}

const GoalsPage: React.FC = () => {
  const { formatAmount, symbol } = useCurrency();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Short-term' | 'Long-term'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target_amount: '', target_date: '', is_short_term: true });
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: goals, loading, error, refetch } = useApi<GoalOut[]>(getGoals);

  const filtered = (goals ?? []).filter(g => {
    if (activeFilter === 'Short-term') return g.is_short_term;
    if (activeFilter === 'Long-term')  return !g.is_short_term;
    return true;
  });

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newGoal.title || !newGoal.target_amount) {
      setFormError('Title and target amount are required.');
      return;
    }
    setIsCreating(true);
    try {
      await createGoal({
        title: newGoal.title,
        target_amount: parseFloat(newGoal.target_amount),
        target_date: newGoal.target_date ? new Date(newGoal.target_date).toISOString() : undefined,
        is_short_term: newGoal.is_short_term,
      });
      refetch();
      setShowCreateModal(false);
      setNewGoal({ title: '', target_amount: '', target_date: '', is_short_term: true });
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || 'Could not create goal.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositGoalId || !depositAmount || parseFloat(depositAmount) <= 0) return;
    setIsDepositing(true);
    try {
      await depositToGoal(depositGoalId, parseFloat(depositAmount));
      refetch();
      setDepositGoalId(null);
      setDepositAmount('');
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Deposit failed.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await deleteGoal(id);
      refetch();
    } catch {
      alert('Could not delete goal.');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-lg">
        {/* Header */}
        <section className="mb-gutter flex flex-col md:flex-row md:items-end justify-between gap-gutter">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-1">Financial Goals</h2>
            <p className="font-body-md text-on-surface-variant">Track your progress and build lasting wealth.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-low p-1 rounded-xl border border-black/5">
              {(['All', 'Short-term', 'Long-term'] as const).map(f => (
                <button
                  key={f}
                  className={`px-4 py-1.5 rounded-lg text-label-bold ${activeFilter === f ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-label-bold hover:opacity-90 active:scale-95 transition-all"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Goal
            </button>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-black/5 p-6 animate-pulse space-y-4">
                <div className="h-40 bg-gray-100 rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-error mb-2 block">error</span>
            <p className="text-on-surface-variant">{error}</p>
            <button onClick={refetch} className="mt-4 text-primary font-label-bold hover:underline">Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">track_changes</span>
            <h3 className="font-headline-md text-on-background mb-2">No goals yet</h3>
            <p className="text-on-surface-variant mb-6">Create your first financial goal and start tracking progress.</p>
            <button
              className="px-6 py-3 bg-primary text-white rounded-xl font-label-bold hover:opacity-90 transition-all"
              onClick={() => setShowCreateModal(true)}
            >
              Create your first goal
            </button>
          </div>
        )}

        {/* Goals grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filtered.map(goal => {
              const { label, colorClass } = getStatus(goal.progress_percentage);
              return (
                <div key={goal.id} className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                    {goal.image_url ? (
                      <img src={goal.image_url} alt={goal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary/30">savings</span>
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${colorClass}`}>
                      {label}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-label-bold text-on-surface">{goal.title}</h3>
                      <button
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-full hover:bg-error/10 text-error transition-all"
                        onClick={() => handleDelete(goal.id)}
                        title="Delete goal"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <span className="font-numbers-md text-numbers-md text-primary">
                        {formatAmount(goal.saved_amount)}
                        <span className="text-on-surface-variant text-body-md font-normal"> / {formatAmount(goal.target_amount)}</span>
                      </span>
                      <span className="text-label-bold text-secondary">{Math.round(goal.progress_percentage)}%</span>
                    </div>

                    <div className="w-full h-2 bg-surface-container-high rounded-full mb-4">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-700"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>

                    {goal.target_date && (
                      <p className="text-label-sm text-on-surface-variant mb-4">
                        Target: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    )}

                    <button
                      className="w-full py-2 bg-secondary/10 text-secondary font-label-bold rounded-lg hover:bg-secondary/20 transition-colors"
                      onClick={() => { setDepositGoalId(goal.id); setDepositAmount(''); }}
                    >
                      Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary stats */}
        {!loading && !error && (goals ?? []).length > 0 && (
          <div className="mt-xl grid grid-cols-3 gap-gutter">
            {[
              { label: 'Total Goals', value: String((goals ?? []).length), icon: 'flag' },
              { label: 'Total Saved',  value: formatAmount((goals ?? []).reduce((s, g) => s + g.saved_amount, 0)), icon: 'savings' },
              { label: 'Total Target', value: formatAmount((goals ?? []).reduce((s, g) => s + g.target_amount, 0)), icon: 'track_changes' },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-black/5 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">{stat.label}</p>
                  <p className="font-numbers-md text-numbers-md text-on-background">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface">Create New Goal</h3>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5" onClick={() => setShowCreateModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="font-label-bold text-on-surface-variant block mb-1">Goal Title</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Emergency Fund"
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div>
                <label className="font-label-bold text-on-surface-variant block mb-1">Target Amount ({symbol})</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20"
                  placeholder="10000"
                  type="number"
                  min="1"
                  value={newGoal.target_amount}
                  onChange={e => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                />
              </div>
              <div>
                <label className="font-label-bold text-on-surface-variant block mb-1">Target Date (optional)</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20"
                  type="date"
                  value={newGoal.target_date}
                  onChange={e => setNewGoal({ ...newGoal, target_date: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="font-label-bold text-on-surface-variant">Goal Type</label>
                <div className="flex p-1 bg-surface-container-low rounded-lg">
                  <button type="button" className={`px-4 py-1.5 rounded-md font-label-bold text-label-bold transition-all ${newGoal.is_short_term ? 'bg-primary text-white' : 'text-on-surface-variant'}`}
                    onClick={() => setNewGoal({ ...newGoal, is_short_term: true })}>Short-term</button>
                  <button type="button" className={`px-4 py-1.5 rounded-md font-label-bold text-label-bold transition-all ${!newGoal.is_short_term ? 'bg-primary text-white' : 'text-on-surface-variant'}`}
                    onClick={() => setNewGoal({ ...newGoal, is_short_term: false })}>Long-term</button>
                </div>
              </div>
              {formError && <p className="text-error text-label-bold text-sm">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" className="flex-1 py-3 border border-outline-variant rounded-lg font-label-bold text-on-surface-variant hover:bg-surface-container-low" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="flex-1 py-3 bg-primary text-white rounded-lg font-label-bold hover:opacity-90 disabled:opacity-60">
                  {isCreating ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {depositGoalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setDepositGoalId(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-headline-md text-on-surface mb-4">Add Funds</h3>
            <p className="text-on-surface-variant mb-4">Enter amount to deposit into this goal:</p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-bold">{symbol}</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-lg pl-8 pr-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-secondary/20"
                placeholder="0.00"
                type="number"
                min="0.01"
                step="0.01"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 border border-outline-variant rounded-lg font-label-bold text-on-surface-variant" onClick={() => setDepositGoalId(null)}>Cancel</button>
              <button
                className="flex-1 py-3 bg-secondary text-white rounded-lg font-label-bold hover:opacity-90 disabled:opacity-60"
                disabled={isDepositing || !depositAmount}
                onClick={handleDeposit}
              >
                {isDepositing ? 'Saving...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalsPage;