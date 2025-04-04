// components/ui/modal.tsx
"use client"
import React from "react"
import { X } from "lucide-react"

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl relative p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  )
}