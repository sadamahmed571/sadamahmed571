"use client"

import React from "react"

// Component for direct text input of index
function TextInput({ onIndexExtracted, language, theme }) {
  const [text, setText] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // Create translator based on language prop
  const t = createTranslator(language || "en")

  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value)
    setError("")
  }

  // Process the text and extract index
  const processText = () => {
    if (!text.trim()) {
      setError(language === "ar" ? "الرجاء إدخال بعض النص" : "Please enter some text")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Parse the text input
      const indexItems = parseTextInput(text)

      if (indexItems.length === 0) {
        setError(
          language === "ar"
            ? "لا يمكن استخراج عناصر الفهرس من النص"
            : "No index items could be extracted from the text",
        )
        setLoading(false)
        return
      }

      // Call the callback with the extracted index items
      onIndexExtracted(indexItems)

      // Clear the text input
      setText("")
    } catch (err) {
      console.error("Error parsing text input:", err)
      setError(
        language === "ar"
          ? "فشل في تحليل النص. يرجى التحقق من التنسيق."
          : "Failed to parse the text. Please check the format.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6" data-id="dy89c8zys" data-path="components/TextInput.js">
      <div className="flex items-center justify-between mb-2" data-id="ykv7kxtu3" data-path="components/TextInput.js">
        <label
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          data-id="bl6q6167s"
          data-path="components/TextInput.js"
        >
          {t("pasteText")}
        </label>
        <button
          className={`text-xs ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setText("")}
          disabled={!text}
          data-id="6pdb4fsfj"
          data-path="components/TextInput.js"
        >
          {t("clear")}
        </button>
      </div>

      <textarea
        value={text}
        onChange={handleTextChange}
        rows="10"
        placeholder={language === "ar" ? "الصق نص الفهرس هنا..." : "Paste your index text here..."}
        className={`w-full p-3 ${
          theme === "dark"
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            : "border-gray-300 text-gray-900"
        } rounded-md shadow-sm`}
        dir={language === "ar" ? "rtl" : "ltr"}
        data-id="fcowp5gbs"
        data-path="components/TextInput.js"
      ></textarea>

      {error && (
        <p className="mt-2 text-sm text-red-600" data-id="mqtxvxnz7" data-path="components/TextInput.js">
          <i className="fas fa-exclamation-circle mr-1" data-id="qmhpxzp5e" data-path="components/TextInput.js"></i>{" "}
          {error}
        </p>
      )}

      <div className="mt-4" data-id="8bf6ay20v" data-path="components/TextInput.js">
        <button
          className={`btn ${theme === "dark" ? "btn-primary-dark" : "btn-primary"}`}
          onClick={processText}
          disabled={loading || !text.trim()}
          data-id="ro1m76b8z"
          data-path="components/TextInput.js"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin" data-id="u8as13i1m" data-path="components/TextInput.js"></i>{" "}
              {t("processing")}
            </>
          ) : (
            <>
              <i className="fas fa-magic" data-id="pwmd6761f" data-path="components/TextInput.js"></i> {t("extract")}
            </>
          )}
        </button>

        <p
          className={`mt-3 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          data-id="llrb9jqfr"
          data-path="components/TextInput.js"
        >
          <i className="fas fa-info-circle mr-1" data-id="guyohe46f" data-path="components/TextInput.js"></i>
          {language === "ar"
            ? "سيحاول النظام اكتشاف التسلسل الهرمي بناءً على الترقيم والمسافات البادئة وأنماط التنسيق."
            : "The system will attempt to detect hierarchy based on numbering, indentation, and formatting patterns."}
        </p>
      </div>
    </div>
  )
}
