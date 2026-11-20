import React, { useState, useEffect } from 'react';
import type { Document } from '../views/types';
import DocumentIcon from './icons/DocumentIcon';

interface DocumentPreviewModalProps {
  entity: { name: string; documents: Document[] } | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ entity, onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    if (entity && entity.documents.length > 0) {
      setSelectedDoc(entity.documents[0]);
    } else {
      setSelectedDoc(null);
    }
  }, [entity]);

  if (!entity) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Documents for {entity.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close document preview">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          <aside className="w-full md:w-1/3 lg:w-1/4 border-r overflow-y-auto p-2 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase p-2">Uploaded Documents</h3>
            <ul>
              {entity.documents.length > 0 ? entity.documents.map(doc => (
                <li key={doc.id}>
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 my-1 rounded-lg transition-colors ${selectedDoc?.id === doc.id ? 'bg-primary-light text-primary-dark' : 'hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold text-sm">{doc.type}</p>
                    <p className="text-xs text-gray-500">Uploaded: {doc.uploadedAt}</p>
                  </button>
                </li>
              )) : (
                <li className="p-3 text-sm text-gray-500">No documents found.</li>
              )}
            </ul>
          </aside>
          
          <main className="flex-1 bg-gray-50 p-6 flex items-center justify-center overflow-auto">
            {selectedDoc ? (
              <div className="text-center">
                <DocumentIcon className="w-24 h-24 text-gray-300 mx-auto" />
                <h4 className="text-lg font-bold mt-4 text-gray-700">{selectedDoc.name}</h4>
                <p className="text-gray-500 mt-1">This is a placeholder for the document preview.</p>
                <a 
                   href={selectedDoc.url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="mt-4 inline-block px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Open Original Document
                </a>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                 <DocumentIcon className="w-24 h-24 text-gray-300 mx-auto" />
                 {entity.documents.length === 0 
                    ? <p className="mt-4">No documents available for this entity.</p> 
                    : <p className="mt-4">Select a document to view its preview.</p>
                 }
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;