import "./globals.css"
import Sidebar from "@/components/ui/Sidebar"

export const metadata = {
  title: "DNA Sequence Analysis",
  description: "Analyze DNA sequences with ML models",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}