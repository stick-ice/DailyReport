import { useState } from 'react';
import { PREDEFINED_CATEGORIES } from '../../constants/categories';

interface Props {
  customCategories: string[];
  onAdd: (category: string) => void;
  onEdit: (oldName: string, newName: string) => void;
  onDelete: (category: string) => void;
}

export function CategoryManager({ customCategories, onAdd, onEdit, onDelete }: Props) {
  const [newInput, setNewInput] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addError, setAddError] = useState('');

  const allCustom = customCategories.filter((c) => !PREDEFINED_CATEGORIES.includes(c));

  const handleAdd = () => {
    const trimmed = newInput.trim();
    if (!trimmed) return;
    if (PREDEFINED_CATEGORIES.includes(trimmed) || customCategories.includes(trimmed)) {
      setAddError('同じ名前のカテゴリがすでに存在します');
      return;
    }
    onAdd(trimmed);
    setNewInput('');
    setAddError('');
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditInput(name);
    setDeleteConfirm(null);
  };

  const handleEdit = (oldName: string) => {
    const trimmed = editInput.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingName(null);
      return;
    }
    if (PREDEFINED_CATEGORIES.includes(trimmed) || customCategories.includes(trimmed)) {
      return;
    }
    onEdit(oldName, trimmed);
    setEditingName(null);
  };

  const handleDelete = (name: string) => {
    onDelete(name);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* デフォルトカテゴリ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">デフォルトカテゴリ</h2>
        <ul className="space-y-2">
          {PREDEFINED_CATEGORIES.map((cat) => (
            <li key={cat} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">{cat}</span>
              <span className="text-xs text-gray-400">編集不可</span>
            </li>
          ))}
        </ul>
      </div>

      {/* カスタムカテゴリ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">カスタムカテゴリ</h2>

        {/* 追加フォーム */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newInput}
            onChange={(e) => { setNewInput(e.target.value); setAddError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="新しいカテゴリ名"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            追加
          </button>
        </div>
        {addError && <p className="mb-3 text-xs text-red-500">{addError}</p>}

        {/* カスタムカテゴリ一覧 */}
        {allCustom.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">カスタムカテゴリがありません</p>
        ) : (
          <ul className="space-y-2">
            {allCustom.map((cat) => (
              <li key={cat} className="rounded-lg border border-gray-200 px-3 py-2">
                {editingName === cat ? (
                  /* 編集モード */
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEdit(cat);
                        if (e.key === 'Escape') setEditingName(null);
                      }}
                      autoFocus
                      className="flex-1 rounded-md border border-blue-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleEdit(cat)}
                      className="rounded px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingName(null)}
                      className="rounded px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : deleteConfirm === cat ? (
                  /* 削除確認モード */
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">「{cat}」を削除しますか?</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(cat)}
                        className="rounded px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        削除
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 通常表示 */
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => { setDeleteConfirm(cat); setEditingName(null); }}
                        className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
