"use client"

import React, { useState, useEffect } from "react"
import { Download, FileText, Presentation, AlertCircle } from "lucide-react"
import Modal from "../../components/ui/modal"

const articles = [
  { id: 1, name: "DNA Dataset (CSV)", file: "/dna_dataset.csv", type: "csv", description: "Raw DNA sequence dataset with disease predictions and parameters" },
  { id: 2, name: "DNA Visualization Guide", file: "/visualization-guide.pdf", type: "pdf", description: "Comprehensive guide for DNA analysis visualizations and metrics" },
  { id: 3, name: "DNA Dataset Fusion Methodology", file: "/DNA_Dataset_Fusion_Methodology.pdf", type: "pdf", description: "Technical documentation detailing how sequences, parameters, and cities were merged to create the final DNA dataset" },
  { id: 4, name: "DNA Dataset Documentation", file: "/dna-dataset.pdf", type: "pdf", description: "Technical documentation of the DNA sequence dataset and analysis parameters" },
  { id: 5, name: "Publication 1", file: "/paper1.pdf", type: "pdf", description: "Research findings on DNA sequence analysis" },
  { id: 6, name: "Paper 2", file: "/paper2.pdf", type: "pdf", description: "Model performance analysis" },
  { id: 7, name: "Research Presentation", file: "/ppt3.pptx", type: "pptx", description: "Overview of the DNA analysis dashboard" },
]

export default function ResearchArticlesPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewContent(null);
      setPreviewError(null);
      return;
    }

    setIsLoading(true);
    setPreviewError(null);

    if (selectedFile.endsWith('.csv')) {
      fetch(selectedFile)
        .then(response => {
          if (!response.ok) throw new Error('Failed to load file');
          return response.text();
        })
        .then(text => {
          const lines = text.split('\n').slice(0, 50);
          setPreviewContent(lines.join('\n') + (lines.length === 50 ? '\n...' : ''));
          setPreviewError(null);
        })
        .catch(error => {
          console.error('Error loading CSV:', error);
          setPreviewError('Failed to load CSV file');
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedFile]);

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (previewError) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{previewError}</p>
        </div>
      );
    }

if (selectedFile?.endsWith('.pdf')) {
  return (
    <div className="relative">
      <iframe
        src={`https://docs.google.com/gview?url=${window.location.origin}${selectedFile}&embedded=true`}
        className="w-full h-[80vh] border rounded-lg"
        title="PDF Preview"
      />
      <div className="absolute top-2 right-2">
        <a
          href={selectedFile}
          download
          className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>
    </div>
  );
}

    if (selectedFile?.endsWith('.csv') && previewContent) {
      return (
        <div className="relative">
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner overflow-auto max-h-[80vh] font-mono text-sm">
            <table className="w-full">
              <tbody>
                {previewContent.split('\n').map((line, index) => (
                  <tr key={index} className={index === 0 ? 'bg-gray-100 font-semibold' : ''}>
                    <td className="p-1 whitespace-nowrap border-b border-gray-200">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute top-2 right-2">
            <a
              href={selectedFile}
              download
              className="px-4 py-2 bg-white text-green-600 rounded-lg shadow-lg hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </a>
          </div>
        </div>
      );
    }

    if (selectedFile?.endsWith('.pptx')) {
      return (
        <div className="text-center py-12">
          <Presentation className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">PowerPoint preview is not available.</p>
          <a
            href={selectedFile}
            download
            className="px-6 py-3 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Presentation
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Research Articles & Documentation</h2>
      <p className="text-gray-600 mb-8">Access comprehensive documentation, research articles, and presentations about our DNA analysis system.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((doc) => (
          <div key={doc.id} className="border p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center h-16">
                {doc.type === "pdf" ? (
                  <FileText className="w-12 h-12 text-blue-600" />
                ) : doc.type === "csv" ? (
                  <FileText className="w-12 h-12 text-green-600" />
                ) : (
                  <Presentation className="w-12 h-12 text-orange-600" />
                )}
              </div>
              <h3 className="font-bold text-lg text-center text-gray-800">{doc.name}</h3>
              <p className="text-gray-600 text-sm text-center">{doc.description}</p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setSelectedFile(doc.file)}
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Preview
                </button>
                <a
                  href={doc.file}
                  download
                  className="px-4 py-2 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <Modal onClose={() => {
          setSelectedFile(null);
          setPreviewContent(null);
          setPreviewError(null);
        }}>
          <div className="p-6">
            <h3 className="font-bold text-xl mb-4">Document Preview</h3>
            {renderPreview()}
          </div>
        </Modal>
      )}
    </div>
  );
}