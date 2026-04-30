import { useState } from 'react';
import { TabNav } from './components/layout/TabNav';
import { DailyView } from './components/daily/DailyView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CategoryManager } from './components/categories/CategoryManager';
import { useEntries } from './hooks/useEntries';

type Tab = 'daily' | 'analytics' | 'categories';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const {
    entries, plans, categories,
    addEntry, updateEntry, deleteEntry,
    addCategory, editCategory, deleteCategory,
    addPlan, updatePlan, deletePlan,
  } = useEntries();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-3">
            <h1 className="text-xl font-bold text-gray-900">業務日報</h1>
          </div>
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'daily' && (
          <DailyView
            entries={entries}
            plans={plans}
            categories={categories}
            onAddCategory={addCategory}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
            onAddPlan={addPlan}
            onUpdatePlan={updatePlan}
            onDeletePlan={deletePlan}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView entries={entries} />
        )}
        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onAdd={addCategory}
            onEdit={editCategory}
            onDelete={deleteCategory}
          />
        )}
      </main>
    </div>
  );
}
