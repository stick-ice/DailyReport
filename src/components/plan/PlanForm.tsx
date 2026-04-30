import { useState } from 'react';
import { DateInput } from '../form/DateInput';
import { CategorySelect } from '../form/CategorySelect';
import { todayString } from '../../utils/time';
import type { NewPlanInput } from '../../hooks/useEntries';
import type { PlanEntry } from '../../types';

interface Props {
  categories: string[];
  onAddCategory: (cat: string) => void;
  onSubmit: (input: NewPlanInput) => void;
  editTarget?: PlanEntry | null;
  onCancelEdit?: () => void;
}

interface FormErrors {
  date?: string;
  category?: string;
  description?: string;
  estimatedMinutes?: string;
}

const emptyForm = (): Omit<NewPlanInput, 'estimatedMinutes'> & { hours: string; minutes: string } => ({
  date: todayString(),
  category: '',
  description: '',
  hours: '',
  minutes: '',
});

function splitMinutes(total: number): { hours: string; minutes: string } {
  return {
    hours: String(Math.floor(total / 60)),
    minutes: String(total % 60),
  };
}

export function PlanForm({ categories, onAddCategory, onSubmit, editTarget, onCancelEdit }: Props) {
  const [form, setForm] = useState(() =>
    editTarget
      ? {
          date: editTarget.date,
          category: editTarget.category,
          description: editTarget.description,
          ...splitMinutes(editTarget.estimatedMinutes),
        }
      : emptyForm()
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.date) errs.date = '日付を入力してください';
    if (!form.category) errs.category = 'カテゴリを選択してください';
    if (!form.description.trim()) errs.description = '業務概要を入力してください';

    const h = form.hours === '' ? 0 : parseInt(form.hours, 10);
    const m = form.minutes === '' ? 0 : parseInt(form.minutes, 10);
    if (isNaN(h) || isNaN(m) || h < 0 || m < 0 || m > 59 || (h === 0 && m === 0)) {
      errs.estimatedMinutes = '予定時間を正しく入力してください（0分より大きい値）';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const h = form.hours === '' ? 0 : parseInt(form.hours, 10);
    const m = form.minutes === '' ? 0 : parseInt(form.minutes, 10);
    onSubmit({
      date: form.date,
      category: form.category,
      description: form.description,
      estimatedMinutes: h * 60 + m,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    if (!editTarget) {
      setForm((prev) => ({ ...emptyForm(), date: prev.date }));
    }
    setErrors({});
  };

  const isEditing = !!editTarget;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        {isEditing ? '作業計画を編集' : '作業計画を入力'}
      </h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <DateInput
          value={form.date}
          onChange={(v) => set('date', v)}
          error={errors.date}
        />

        <CategorySelect
          value={form.category}
          categories={categories}
          onChange={(v) => set('category', v)}
          onAddCategory={onAddCategory}
          error={errors.category}
        />

        {/* 予定時間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">予定時間</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="23"
              value={form.hours}
              onChange={(e) => set('hours', e.target.value)}
              placeholder="0"
              className={`w-20 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.estimatedMinutes ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600">時間</span>
            <input
              type="number"
              min="0"
              max="59"
              value={form.minutes}
              onChange={(e) => set('minutes', e.target.value)}
              placeholder="0"
              className={`w-20 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.estimatedMinutes ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600">分</span>
          </div>
          {errors.estimatedMinutes && (
            <p className="mt-1 text-xs text-red-500">{errors.estimatedMinutes}</p>
          )}
        </div>

        {/* 業務概要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">業務概要</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="予定している業務の内容を入力してください"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {isEditing ? '更新する' : '登録する'}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
          )}
          {submitted && !isEditing && (
            <span className="text-sm text-green-600 font-medium">登録しました</span>
          )}
        </div>
      </form>
    </div>
  );
}
