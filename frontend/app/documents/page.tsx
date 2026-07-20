"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react"

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selected: File) => {
    setFile(selected)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")
    setErrorMessage("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/documents/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Upload and processing failed")
      }

      setUploadStatus("success")
      setFile(null)
    } catch (error: any) {
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to process document.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--main-bg)",
        color: "var(--main-text)",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--main-border)",
          fontSize: "15px",
          fontWeight: 500,
          color: "var(--main-text)",
          flexShrink: 0,
        }}
      >
        Document Management
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--main-text)" : "var(--main-border)"}`,
              borderRadius: "16px",
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: "pointer",
              background: isDragging ? "var(--ai-bubble)" : "transparent",
              transition: "all 0.15s",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "var(--main-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={24} color="var(--main-text)" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--main-text)",
                  margin: "0 0 4px",
                }}
              >
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: "13px", color: "var(--main-text-muted)", margin: 0 }}>
                PDF, DOCX, TXT, or CSV · max 10MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.csv"
            />
          </div>

          {/* Selected file */}
          {file && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                border: "1px solid var(--main-border)",
                borderRadius: "12px",
                background: "var(--card-bg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--main-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={16} color="var(--main-text)" />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--main-text)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--main-text-muted)", margin: 0 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    background: "var(--button-primary)",
                    color: "var(--button-primary-text)",
                    fontSize: "13px",
                    fontWeight: 500,
                    opacity: isUploading ? 0.6 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {isUploading ? "Processing…" : "Upload & Process"}
                </button>
                <button
                  onClick={() => { setFile(null); setUploadStatus("idle") }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--main-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Status messages */}
          {uploadStatus === "success" && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(34, 197, 94, 0.1)",
                color: "#16a34a",
                fontSize: "14px",
              }}
            >
              <CheckCircle2 size={16} />
              Document successfully processed and added to your knowledge base.
            </div>
          )}

          {uploadStatus === "error" && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#dc2626",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
              }}
            >
              <AlertCircle size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Info box */}
          <div
            style={{
              marginTop: "32px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid var(--main-border)",
              background: "var(--card-bg)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--main-text)",
                margin: "0 0 8px",
              }}
            >
              How it works
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: "var(--main-text-muted)",
                margin: 0,
                paddingLeft: "18px",
                lineHeight: "1.8",
              }}
            >
              <li>Upload a document (PDF, DOCX, TXT, CSV)</li>
              <li>It gets automatically chunked and embedded into the knowledge base</li>
              <li>Go to <strong style={{ color: "var(--main-text)" }}>Chat</strong> and ask any question — the AI will search your documents automatically</li>
              <li>You can also ask general questions without uploading anything</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
