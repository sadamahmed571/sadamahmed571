"use client"

import React from "react"

// Component for file upload (PDF and Word)
function FileUpload({ onIndexExtracted, language, theme }) {
  const [file, setFile] = React.useState(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const fileInputRef = React.useRef(null)

  // Create translator based on language prop
  const t = createTranslator(language || "en")

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  // Validate file type
  const validateAndSetFile = (selectedFile) => {
    setError("")

    // Check file type
    const fileType = selectedFile.type
    const fileName = selectedFile.name.toLowerCase()

    if (
      fileType === "application/pdf" ||
      fileName.endsWith(".pdf") ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx") ||
      fileType === "application/msword" ||
      fileName.endsWith(".doc")
    ) {
      setFile(selectedFile)
    } else {
      setError(language === "ar" ? "يرجى تحميل مستند PDF أو Word" : "Please upload a PDF or Word document")
    }
  }

  // Process the uploaded file
  const processFile = async () => {
    if (!file) return

    setLoading(true)
    setError("")

    try {
      let indexItems = []

      // Process based on file type
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        indexItems = await parsePDF(file)
      } else {
        indexItems = await parseWord(file)
      }

      if (indexItems.length === 0) {
        setError(
          language === "ar"
            ? "لا يمكن استخراج عناصر الفهرس من الملف"
            : "No index items could be extracted from the file",
        )
        setLoading(false)
        return
      }

      // Call the callback with the extracted index items
      onIndexExtracted(indexItems)

      // Clear the file
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Error processing file:", err)
      setError(language === "ar" ? `فشل في معالجة الملف: ${err.message}` : `Failed to process the file: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="mt-6" data-id="3ywih3n8y" data-path="components/FileUpload.js">
      <div
        className={`file-drop-area ${dragActive ? "active" : ""} ${theme === "dark" ? "file-drop-area-dark" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        data-id="hht487fnh"
        data-path="components/FileUpload.js"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          data-id="dj87zup0c"
          data-path="components/FileUpload.js"
        />

        <div className="text-center" data-id="v185tzahv" data-path="components/FileUpload.js">
          <i
            className={`fas fa-file-upload text-3xl ${theme === "dark" ? "text-gray-400" : "text-gray-400"} mb-3`}
            data-id="bolhzhvdr"
            data-path="components/FileUpload.js"
          ></i>
          <p
            className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : ""}`}
            data-id="2rusa6rn0"
            data-path="components/FileUpload.js"
          >
            {file ? file.name : t("dragDrop")}
          </p>
          <p
            className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1`}
            data-id="jriweyv6t"
            data-path="components/FileUpload.js"
          >
            {t("supportedFormats")}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" data-id="tecao32lf" data-path="components/FileUpload.js">
          <i className="fas fa-exclamation-circle mr-1" data-id="2abezhviw" data-path="components/FileUpload.js"></i>{" "}
          {error}
        </p>
      )}

      {file && (
        <div className="mt-4" data-id="zvbi094aq" data-path="components/FileUpload.js">
          <button
            className={`btn ${theme === "dark" ? "btn-primary-dark" : "btn-primary"}`}
            onClick={processFile}
            disabled={loading}
            data-id="jy93d81qb"
            data-path="components/FileUpload.js"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" data-id="785fpyvjc" data-path="components/FileUpload.js"></i>{" "}
                {t("processing")}
              </>
            ) : (
              <>
                <i className="fas fa-file-import" data-id="ksaefhzdh" data-path="components/FileUpload.js"></i>{" "}
                {t("extract")}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
