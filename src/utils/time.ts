/** "HH:MM" を分数に変換 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** 分数を "HH:MM" に変換 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 開始・終了時刻から所要分数を計算（日跨ぎ考慮） */
export function computeDurationMinutes(start: string, end: string): number {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  if (endMin >= startMin) {
    return endMin - startMin;
  }
  // 日跨ぎ: 翌日として計算
  return 24 * 60 - startMin + endMin;
}

/** 分数を "X時間Y分" 形式に変換 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

/** 分数を小数時間に変換 (グラフ用) */
export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

/** 現在時刻を "HH:MM" で返す */
export function currentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** 今日の日付を "YYYY-MM-DD" で返す */
export function todayString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" を日本語表示 "YYYY年M月D日 (曜)" に変換 */
export function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 (${days[d.getDay()]})`;
}

/** "YYYY-MM" を "YYYY年M月" に変換 */
export function formatYearMonthJa(yearMonth: string): string {
  const [y, m] = yearMonth.split('-');
  return `${y}年${Number(m)}月`;
}

/** "YYYY-MM-DD" から "YYYY-MM" を取得 */
export function getYearMonth(date: string): string {
  return date.slice(0, 7);
}

/** 今月の "YYYY-MM" を返す */
export function currentYearMonth(): string {
  return todayString().slice(0, 7);
}

/** "HH:MM" 形式バリデーション */
export function isValidTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [h, m] = value.split(':').map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}
