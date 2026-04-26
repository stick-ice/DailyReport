import { useState } from 'react';
import { TimeInput } from './TimeInput';
import { DateInput } from './DateInput';
import { CategorySelect } from './CategorySelect';
import { isValidTime, todayString } from '../../utils/time';
import type { NewEntryInput } from '../../hooks/useEntries';
import type { TaskEntry } from '../../types';

interface Props {
  categories: string[];
  onAddCategory: (cat: string) => void;
  onSubmit: (input: NewEntryInput) => void;
  editTarget?: TaskEntry | null;
  onCancelEdit?: () => void;
}

interface FormErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  description?: string;
}

const emptyForm = (): NewEntryInput => ({
  date: todayString(),
  startTime: '',
  endTime: '',
  category: '',
  description: '',
});

export function EntryForm({ categories, onAddCategory, onSubmit, editTarget, onCancelEdit }: Props) {
  const [form, setForm] = useState<NewEntryInput>(() =>
    editTarget
      ? {
          date: editTarget.date,
          startTime: editTarget.startTime,
          endTime: editTarget.endTime,
          category: editTarget.category,
          description: editTarget.description,
        }
      : emptyForm()
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof NewEntryInput>(key: K, value: NewEntryInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.date) errs.date = '日付を入力してください';
    if (!form.startTime) {
      errs.startTime = '開始時刻を入力してください';
    } else if (!isValidTime(form.startTime)) {
      errs.startTime = 'HH:MM 形式で入力してください';
    }
    if (!form.endTime) {
      errs.endTime = '終了時刻を入力してください';
    } else if (!isValidTime(form.endTime)) {
      errs.endTime = 'HH:MM 形式で入力してください';
    }
    if (!form.category) errs.category = 'カテゴリを選択してください';
    if (!form.description.trim()) errs.description = '業務概要を入力してください';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
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
        {isEditing ? '日報を編集' : '日報を入力'}
      </h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 日付 */}
        <DateInput
          value={form.date}
          onChange={(v) => set('date', v)}
          error={errors.date}
        />

        {/* 時刻 */}
        <div className="flex gap-4 flex-wrap">
          <TimeInput
            label="開始時刻"
            value={form.startTime}
            onChange={(v) => set('startTime', v)}
            error={errors.startTime}
          />
          <TimeInput
            label="終了時刻"
            value={form.endTime}
            onChange={(v) => set('endTime', v)}
            error={errors.endTime}
          />
        </div>

        {/* カテゴリ */}
        <CategorySelect
          value={form.category}
          categories={categories}
          onChange={(v) => set('category', v)}
          onAddCategory={onAddCategory}
          error={errors.category}
        />

        {/* 業務概要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">業務概要</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="実施した業務の内容を入力してください"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* ボタン */}
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
