export function exportCSV<T extends Record<string, string | number>>(rows: T[], filename: string) {
  if (!rows.length) {
    return;
  }

  const header = Object.keys(rows[0]);
  const csv = [header.join(','), ...rows.map((row) => header.map((key) => JSON.stringify(row[key] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
