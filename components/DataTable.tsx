import React, { useState } from 'react';

interface Column<T> {
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

const DataTable = <T extends { id: string }>(
  { columns, data, title, actionButton, itemsPerPage = 10 }: DataTableProps<T>
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            {actionButton}
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor)} scope="col" className="px-6 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-6 py-4">
                    {col.render ? col.render(row) : String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700">
            Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-semibold">{data.length}</span> Entries
          </span>
        <div className="flex items-center">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="mx-3 text-sm">{currentPage} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;