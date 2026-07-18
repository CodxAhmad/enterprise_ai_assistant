"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")
      
      setUploadStatus("success")
      setFile(null)
    } catch (error) {
      console.error(error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-6 font-semibold">
        Document Management
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Knowledge</CardTitle>
              <CardDescription>
                Upload PDFs, Word documents, or text files to add to the AI's knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                <div className="rounded-full bg-blue-50 p-3 mb-4">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</h3>
                <p className="text-xs text-gray-500 mb-4">PDF, DOCX, TXT, or CSV (max. 10MB)</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,.csv"
                />
                <Button variant="outline" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                  Select File
                </Button>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                  <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Processing..." : "Upload & Process"}
                  </Button>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully processed and ingested into vector database.
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  Failed to process document. Check backend logs.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
