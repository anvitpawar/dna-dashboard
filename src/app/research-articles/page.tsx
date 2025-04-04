// app/research-articles/page.tsx
"use client"

import React, { useState } from "react"
import { Download, FileText, Presentation } from "lucide-react"
import Modal from "../../components/ui/modal"

const articles = [
  { id: 1, name: "Publication 1", file: "/public/paper1.pdf", type: "pdf" },
  { id: 2, name: "Paper 2", file: "/public/paper2.pdf", type: "pdf" },
  { id: 3, name: "PPT 3rd ", file: "/public/ppt3.pptx", type: "pptx" },
]

export default function ResearchArticlesPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Research Articles & Presentations</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((doc) => (
          <div key={doc.id} className="border p-4 rounded-xl shadow hover:shadow-md transition">
            <div className="flex flex-col items-center space-y-3">
              {doc.type === "pdf" ? (
                <FileText className="w-10 h-10 text-primary" />
              ) : (
                <Presentation className="w-10 h-10 text-orange-600" />
              )}
              <p className="font-semibold text-center">{doc.name}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedFile(doc.file)}
                  className="text-sm text-primary hover:underline"
                >
                  Preview
                </button>
                <a
                  href={doc.file}
                  download
                  className="text-sm text-green-600 hover:underline flex items-center gap-1"
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
        <Modal onClose={() => setSelectedFile(null)}>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Preview</h3>
            {selectedFile.endsWith(".pdf") ? (
              <iframe
                src={selectedFile}
                className="w-full h-[600px] border"
                title="PDF Preview"
              />
            ) : (
              <p className="text-gray-600">PPT preview is limited. Download to view the full presentation.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}