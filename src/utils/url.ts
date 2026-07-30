export const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/** URLの末尾パスからファイル名を抽出してリンク表示名にする（取得できなければホスト名、それも無理ならURLそのもの） */
export function extractLinkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      return decodeURIComponent(lastSegment);
    }
    return parsed.hostname;
  } catch {
    return url;
  }
}
