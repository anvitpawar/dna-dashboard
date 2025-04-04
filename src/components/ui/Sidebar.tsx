"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, UploadCloud, Home, FileBarChart2 } from "lucide-react"
import clsx from "classnames"

const menuItems = [
  { name: "Model Selector", href: "/model-selector",label: "Model Selector", icon: <Home className="h-5 w-5" /> },
  { name: "Upload Dataset", href: "/upload", icon: <UploadCloud className="h-5 w-5" /> },
  { name: "Visualization", href: "/visualization", icon: <BarChart3 className="h-5 w-5" /> },
  { name: "Report", href: "/report", icon: <FileBarChart2 className="h-5 w-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-screen w-60 border-r bg-white shadow-lg p-4">
      <h1 className="text-2xl font-bold mb-6">DNA Dashboard</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-md text-sm font-medium transition hover:bg-primary/10",
              pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}