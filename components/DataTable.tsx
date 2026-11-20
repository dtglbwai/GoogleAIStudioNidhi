import React, { useState } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  actionButton?: React.ReactNode;
  itemsPerPage?: number;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  title,
  actionButton,
  itemsPerPage = 10,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = data.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleNextPage = () => {
    if (safePage < totalPages) {
      setCurrentPage(safePage + 1);
    }
  };

  const handlePrevPage = () => {
    if (safePage > 1) {
      setCurrentPage(safePage - 1);
    }
  };

  return (
    <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--df-border)] flex flex-wrap justify-between items-center gap-4">
        <h3 className="font-display text-base font-bold text-[var(--df-text)]">{title}</h3>
        {actionButton}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-[var(--df-muted)]">
          <thead className="bg-[var(--df-surface-subtle)] text-[var(--df-text)] border-b border-[var(--df-border)]">
            <tr>
              {columns.map(col => (
                <th key={String(col.accessor)} scope="col" className="px-5 py-3 font-semibold whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--df-border)]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-xs text-[var(--df-muted)]">
                  No records match the current view.
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.id} className="hover:bg-[var(--df-surface-subtle)]/60 transition-colors">
                  {columns.map(col => (
                    <td key={String(col.accessor)} className="px-5 py-3 text-[var(--df-text)] tabular-nums">
                      {col.render ? col.render(row) : String(row[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3.5 border-t border-[var(--df-border)] flex flex-wrap justify-between items-center gap-3 text-xs text-[var(--df-muted)]">
        <span className="tabular-nums">
          {data.length === 0 ? (
            '0 entries'
          ) : (
            <>
              Showing <span className="font-semibold text-[var(--df-text)]">{(safePage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-semibold text-[var(--df-text)]">{Math.min(safePage * itemsPerPage, data.length)}</span> of{' '}
              <span className="font-semibold text-[var(--df-text)]">{data.length}</span> entries
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={safePage === 1}
            className="px-3 py-1.5 text-xs font-medium text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
          >
            Previous
          </button>
          <span className="px-2 font-mono tabular-nums text-[var(--df-text)]">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 text-xs font-medium text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;