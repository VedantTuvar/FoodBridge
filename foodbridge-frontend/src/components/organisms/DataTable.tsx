import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalsRow?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  totalsRow,
  emptyMessage = 'No records found.',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto border border-line rounded-sm shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse font-body text-sm">
        <thead>
          <tr className="bg-night text-paper font-mono text-xs uppercase tracking-wider border-b border-line">
            {columns.map((col, idx) => (
              <th key={idx} className={`p-3.5 font-semibold ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white dark:bg-night-soft">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-ink-soft dark:text-paper-alt">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-paper-alt/50 dark:hover:bg-night/50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-3.5 ${col.className || ''}`}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {totalsRow && (
          <tfoot>
            <tr className="bg-teal text-white font-semibold font-mono text-xs uppercase tracking-wider">
              {totalsRow}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
