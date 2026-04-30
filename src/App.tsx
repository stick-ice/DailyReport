import { useState } from 'react';
import { TabNav } from './components/layout/TabNav';
import { EntryForm } from './components/form/EntryForm';
import { EntryList } from './components/list/EntryList';
import { PlanForm } from './components/plan/PlanForm';
import { PlanList } from './components/plan/PlanList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CategoryManager } from './components/categories/CategoryManager';
import { useEntries } from './hooks/useEntries';

type Tab = 'form' | 'list' | 'plan' | 'analytics' | 'categories';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const { entries, plans, categories, addEntry, updateEntry, deleteEntry, addCategory, editCategory, deleteCategory, addPlan, updatePlan, deletePlan } = useEntries();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="py-3">
            <h1 className="text-xl font-bold text-gray-900">業務日報</h1>
          </div>
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'form' && (
          <EntryForm
            categories={categories}
            onAddCategory={addCategory}
            onSubmit={addEntry}
          />
        )}
        {activeTab === 'list' && (
          <EntryList
            entries={entries}
            categories={categories}
            onAddCategory={addCategory}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />
        )}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <PlanForm
              categories={categories}
              onAddCategory={addCategory}
              onSubmit={addPlan}
            />
            <PlanList
              plans={plans}
              categories={categories}
              onAddCategory={addCategory}
              onUpdate={updatePlan}
              onDelete={deletePlan}
            />
          </div>
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
