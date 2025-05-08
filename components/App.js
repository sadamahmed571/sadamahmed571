"use client"

import React from "react"

// Main application component
function App() {
  const [indexItems, setIndexItems] = React.useState([])
  const [activeTab, setActiveTab] = React.useState("text") // 'text', 'file', 'create'
  const [showToast, setShowToast] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState("")
  const [toastType, setToastType] = React.useState("success")

  // Project name and auto-save state variables
  const [projectName, setProjectName] = React.useState("")
  const [lastSaved, setLastSaved] = React.useState(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true)
  const [saveTimeout, setSaveTimeout] = React.useState(null)

  // New state variables for enhanced features
  const [language, setLanguage] = React.useState("en") // 'en', 'ar'
  const [theme, setTheme] = React.useState("light") // 'light', 'dark', 'custom'
  const [fontSize, setFontSize] = React.useState("medium") // 'small', 'medium', 'large'
  const [showGuide, setShowGuide] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const [showCollaboration, setShowCollaboration] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  // History for undo/redo functionality
  const [history, setHistory] = React.useState([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)

  // Create translator function for current language
  const t = createTranslator(language)

  // Get document direction based on language
  const getDirection = () => (language === "ar" ? "rtl" : "ltr")

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", lang)
  }

  // Load saved data from localStorage on component mount
  React.useEffect(() => {
    const savedProject = localStorage.getItem("indexProject")
    if (savedProject) {
      try {
        const parsed = JSON.parse(savedProject)
        if (parsed.projectName) setProjectName(parsed.projectName)
        if (parsed.indexItems && parsed.indexItems.length) {
          setIndexItems(parsed.indexItems)
          setHistory([parsed.indexItems])
          setHistoryIndex(0)
        }
        if (parsed.lastSaved) setLastSaved(new Date(parsed.lastSaved))
      } catch (error) {
        console.error("Error loading saved project:", error)
      }
    }
  }, [])

  // Auto-save function
  const saveProject = React.useCallback(() => {
    const projectData = {
      projectName,
      indexItems,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem("indexProject", JSON.stringify(projectData))
    setLastSaved(new Date())
  }, [projectName, indexItems])

  // Handle manual save
  const handleSaveNow = () => {
    saveProject()
    showToastMessage(t("autoSaved"), "success")
  }

  // Setup auto-save on changes
  React.useEffect(() => {
    if (autoSaveEnabled && indexItems.length > 0) {
      if (saveTimeout) clearTimeout(saveTimeout)
      const timeout = setTimeout(() => {
        saveProject()
      }, 5000) // Save after 5 seconds of inactivity

      setSaveTimeout(timeout)
    }

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout)
    }
  }, [indexItems, projectName, autoSaveEnabled, saveProject, saveTimeout])

  // Add to history when items change
  React.useEffect(() => {
    if (indexItems.length > 0) {
      // Only add to history if we're not currently navigating through history
      // and if the items are different from the last entry
      if (historyIndex === history.length - 1 || historyIndex === -1) {
        // If we're not at the end of history, truncate it
        const newHistory = historyIndex === -1 ? [] : history.slice(0, historyIndex + 1)
        setHistory([...newHistory, [...indexItems]])
        setHistoryIndex(newHistory.length)

        // Generate suggestions for the updated index
        const newSuggestions = generateSuggestions(indexItems)
        setSuggestions(newSuggestions)
      }
    }
  }, [indexItems])

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setIndexItems([...history[newIndex]])
    }
  }

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setIndexItems([...history[newIndex]])
    }
  }

  // Apply suggestion
  const applySuggestion = (suggestion) => {
    if (suggestion && typeof suggestion.action === "function") {
      const updatedItems = suggestion.action()
      setIndexItems(updatedItems)
      showToastMessage(suggestion.message, "success")
      setShowSuggestions(false)
    }
  }

  // Handle extracted index data
  const handleIndexExtracted = (items) => {
    setIndexItems(items)
    // Reset history when loading new items
    setHistory([[...items]])
    setHistoryIndex(0)

    // Generate suggestions for the new index
    const newSuggestions = generateSuggestions(items)
    setSuggestions(newSuggestions)

    showToastMessage(t("indexExtracted"), "success")
  }

  // Handle index creation from the form
  const handleIndexCreated = (items) => {
    setIndexItems(items)
    // Reset history when creating new items
    setHistory([[...items]])
    setHistoryIndex(0)

    // Generate suggestions for the new index
    const newSuggestions = generateSuggestions(items)
    setSuggestions(newSuggestions)

    showToastMessage(t("indexCreated"), "success")
  }

  // Show toast message
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Handle export to text clipboard
  const handleCopyToClipboard = async () => {
    if (indexItems.length === 0) {
      showToastMessage(t("noIndex"), "error")
      return
    }

    try {
      const formattedText = formatIndexText(indexItems)
      await copyToClipboard(formattedText)
      showToastMessage(t("copied"), "success")
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      showToastMessage("Failed to copy to clipboard", "error")
    }
  }

  // Handle export to Word
  const handleExportToWord = () => {
    if (indexItems.length === 0) {
      showToastMessage(t("noIndex"), "error")
      return
    }

    try {
      exportToWord(indexItems)
      showToastMessage(t("exported"), "success")
    } catch (error) {
      console.error("Error exporting to Word:", error)
      showToastMessage("Failed to export to Word", "error")
    }
  }

  // Handle export to PDF
  const handleExportToPDF = () => {
    if (indexItems.length === 0) {
      showToastMessage(t("noIndex"), "error")
      return
    }

    try {
      exportToPDF(indexItems)
      showToastMessage(t("exported"), "success")
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      showToastMessage("Failed to export to PDF", "error")
    }
  }

  // Clear the workspace
  const handleClearWorkspace = () => {
    if (indexItems.length === 0) return

    if (confirm(t("confirmClear"))) {
      setIndexItems([])
      setHistory([])
      setHistoryIndex(-1)
      setSuggestions([])
      showToastMessage(t("cleared"), "success")
    }
  }

  // Add new index item
  const handleAddNewItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      content: "New entry",
      level: 0,
    }

    setIndexItems([...indexItems, newItem])
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"}`}
      dir={getDirection()}
      data-id="wgb406e83"
      data-path="components/App.js"
    >
      <header
        className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
        data-id="7ttjeanz6"
        data-path="components/App.js"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8" data-id="knio2pc86" data-path="components/App.js">
          <div className="flex justify-between items-center" data-id="si8udo538" data-path="components/App.js">
            <div className="flex items-center" data-id="0b68chaih" data-path="components/App.js">
              <i
                className={`fas fa-book ${theme === "dark" ? "text-blue-400" : "text-blue-600"} text-2xl mr-2`}
                data-id="llbg7vwgo"
                data-path="components/App.js"
              ></i>
              <h1
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                data-id="hyf7gzym7"
                data-path="components/App.js"
              >
                {t("appTitle")}
              </h1>
            </div>

            {/* Project Name Input */}
            <div className="flex-1 mx-4" data-id="syp7dmopd" data-path="components/App.js">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={t("projectName")}
                className={`px-3 py-1 rounded border ${theme === "dark" ? "dark-input" : ""} w-full max-w-md`}
                data-id="vh7exapez"
                data-path="components/App.js"
              />

              {lastSaved && (
                <div
                  className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  data-id="qi5w2bbce"
                  data-path="components/App.js"
                >
                  {t("autoSaved")}: {lastSaved.toLocaleTimeString()}
                  <button
                    onClick={handleSaveNow}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    data-id="3brskc0xb"
                    data-path="components/App.js"
                  >
                    {t("saveNow")}
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-3" data-id="df5itvxgr" data-path="components/App.js">
              {/* Language Switcher */}
              <div className="flex items-center mr-4" data-id="vqm3x9czs" data-path="components/App.js">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2 py-1 rounded ${language === "en" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
                  data-id="bylutc23z"
                  data-path="components/App.js"
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className={`px-2 py-1 rounded ${language === "ar" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
                  data-id="bsktlke1g"
                  data-path="components/App.js"
                >
                  AR
                </button>
              </div>

              {/* Settings Button */}
              <button
                className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                onClick={() => setShowSettings(!showSettings)}
                data-id="1d8mzjs60"
                data-path="components/App.js"
              >
                <i className="fas fa-cog" data-id="9mvs2lzun" data-path="components/App.js"></i> {t("settings")}
              </button>

              {/* Guide Button */}
              <button
                className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                onClick={() => setShowGuide(!showGuide)}
                data-id="dv0uo9wxk"
                data-path="components/App.js"
              >
                <i className="fas fa-question-circle" data-id="xxo347202" data-path="components/App.js"></i>{" "}
                {t("guide")}
              </button>

              {/* Collaboration Button */}
              <button
                className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                onClick={() => setShowCollaboration(!showCollaboration)}
                data-id="s2k714y0f"
                data-path="components/App.js"
              >
                <i className="fas fa-users" data-id="6krppmps0" data-path="components/App.js"></i> {t("collaborate")}
              </button>

              {indexItems.length > 0 && (
                <button
                  className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                  onClick={handleClearWorkspace}
                  data-id="79o9v8lra"
                  data-path="components/App.js"
                >
                  <i className="fas fa-trash-alt" data-id="0ph2nlnh0" data-path="components/App.js"></i>{" "}
                  {t("clearWorkspace")}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main
        className={`max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8 ${fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : "text-base"} w-full overflow-x-hidden`}
        data-id="ylhdia9qm"
        data-path="components/App.js"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full overflow-x-hidden"
          data-id="key6kmx8k"
          data-path="components/App.js"
        >
          {/* Input Section */}
          <div
            className={`md:col-span-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-6`}
            data-id="swu25g8k3"
            data-path="components/App.js"
          >
            <h2
              className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-4`}
              data-id="en1wg676q"
              data-path="components/App.js"
            >
              {t("importIndex")}
            </h2>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-4" data-id="yxadoqumi" data-path="components/App.js">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "text"
                    ? `${theme === "dark" ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
                    : `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
                }`}
                onClick={() => setActiveTab("text")}
                data-id="z18qh5l3n"
                data-path="components/App.js"
              >
                <i className="fas fa-keyboard mr-2" data-id="zydi82cjg" data-path="components/App.js"></i>{" "}
                {t("textInput")}
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "file"
                    ? `${theme === "dark" ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
                    : `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
                }`}
                onClick={() => setActiveTab("file")}
                data-id="42zmhaidj"
                data-path="components/App.js"
              >
                <i className="fas fa-file mr-2" data-id="qkq6jrp8m" data-path="components/App.js"></i> {t("fileUpload")}
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "create"
                    ? `${theme === "dark" ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
                    : `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
                }`}
                onClick={() => setActiveTab("create")}
                data-id="0se084ay9"
                data-path="components/App.js"
              >
                <i className="fas fa-plus-circle mr-2" data-id="2nby3048e" data-path="components/App.js"></i>{" "}
                {t("createNew")}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "text" ? (
              <TextInput onIndexExtracted={handleIndexExtracted} language={language} theme={theme} />
            ) : activeTab === "file" ? (
              <FileUpload onIndexExtracted={handleIndexExtracted} language={language} theme={theme} />
            ) : (
              <CreateIndexForm onIndexCreated={handleIndexCreated} language={language} theme={theme} />
            )}
          </div>

          {/* Workspace Section */}
          <div className="md:col-span-2" data-id="f7xs8eso9" data-path="components/App.js">
            <div className="flex justify-between items-center mb-4" data-id="vxuh347bg" data-path="components/App.js">
              <h2
                className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                data-id="q4vnr3vek"
                data-path="components/App.js"
              >
                {t("visualWorkspace")}
                {indexItems.length > 0 && (
                  <span
                    className={`ml-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    data-id="tgkzlcxkz"
                    data-path="components/App.js"
                  >
                    ({indexItems.length} {t("items")})
                  </span>
                )}
              </h2>

              <div className="flex space-x-2" data-id="qqy1j693s" data-path="components/App.js">
                {indexItems.length > 0 && (
                  <>
                    {/* Undo/Redo Buttons are moved to fixed position */}

                    {/* Suggestions Button */}
                    {suggestions.length > 0 && (
                      <button
                        className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        data-id="8t98luosw"
                        data-path="components/App.js"
                      >
                        <i className="fas fa-lightbulb" data-id="9is87jtkc" data-path="components/App.js"></i>{" "}
                        {t("suggestions")}
                        <span
                          className="ml-1 bg-yellow-400 text-xs text-black rounded-full px-1"
                          data-id="pf3864lf4"
                          data-path="components/App.js"
                        >
                          {suggestions.length}
                        </span>
                      </button>
                    )}

                    {/* Add Item Button */}
                    <button
                      className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                      onClick={handleAddNewItem}
                      data-id="qgannnkfa"
                      data-path="components/App.js"
                    >
                      <i className="fas fa-plus" data-id="62lvrubqk" data-path="components/App.js"></i> {t("addItem")}
                    </button>

                    {/* Export Buttons */}
                    <button
                      className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                      onClick={handleCopyToClipboard}
                      title={t("copyClipboard")}
                      data-id="pa1wh8pyq"
                      data-path="components/App.js"
                    >
                      <i className="fas fa-clipboard" data-id="ccgp8wlk3" data-path="components/App.js"></i> {t("copy")}
                    </button>
                    <button
                      className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                      onClick={handleExportToWord}
                      title={t("exportWord")}
                      data-id="3yo6qou5p"
                      data-path="components/App.js"
                    >
                      <i className="fas fa-file-word" data-id="tvgwrp16b" data-path="components/App.js"></i> {t("word")}
                    </button>
                    <button
                      className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
                      onClick={handleExportToPDF}
                      title={t("exportPDF")}
                      data-id="qd4m22imm"
                      data-path="components/App.js"
                    >
                      <i className="fas fa-file-pdf" data-id="y2l3npn1o" data-path="components/App.js"></i> {t("pdf")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Suggestions Panel */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className={`mb-4 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-yellow-50 border border-yellow-200"}`}
                data-id="cqsuuwqsl"
                data-path="components/App.js"
              >
                <h3 className="font-medium mb-2" data-id="t19v6q8d6" data-path="components/App.js">
                  {t("suggestionsTitle")}
                </h3>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`suggestion-${index}`}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                    data-id="3yyr305da"
                    data-path="components/App.js"
                  >
                    <p data-id="ss36wk2ie" data-path="components/App.js">
                      {suggestion.message}
                    </p>
                    <div data-id="71yzm5721" data-path="components/App.js">
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => applySuggestion(suggestion)}
                        data-id="2a73xq8np"
                        data-path="components/App.js"
                      >
                        {t("applySuggestion")}
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setSuggestions(suggestions.filter((_, i) => i !== index))
                          if (suggestions.length === 1) setShowSuggestions(false)
                        }}
                        data-id="fdnfck8aa"
                        data-path="components/App.js"
                      >
                        {t("ignoreSuggestion")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <IndexWorkspace items={indexItems} setItems={setIndexItems} language={language} theme={theme} />
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className={`settings-panel ${theme === "dark" ? "settings-panel-dark" : ""}`}
          data-id="n0fzj8ffh"
          data-path="components/App.js"
        >
          <div className="settings-header" data-id="8p1vzk00e" data-path="components/App.js">
            <h2 data-id="19j9vlw20" data-path="components/App.js">
              {t("uiSettings")}
            </h2>
            <button
              className="close-btn"
              onClick={() => setShowSettings(false)}
              data-id="9hlvmopbx"
              data-path="components/App.js"
            >
              <i className="fas fa-times" data-id="gnqji1t4x" data-path="components/App.js"></i>
            </button>
          </div>
          <div className="settings-content" data-id="kofbvlz3c" data-path="components/App.js">
            <div className="setting-group" data-id="ng83vpmex" data-path="components/App.js">
              <label data-id="3myi25rro" data-path="components/App.js">
                {t("theme")}
              </label>
              <div className="theme-options" data-id="eb8ii8tir" data-path="components/App.js">
                <button
                  className={`theme-option ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                  data-id="llxob5fpl"
                  data-path="components/App.js"
                >
                  <i className="fas fa-sun" data-id="i7nd2uj8j" data-path="components/App.js"></i> Light
                </button>
                <button
                  className={`theme-option ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                  data-id="nyx1118ri"
                  data-path="components/App.js"
                >
                  <i className="fas fa-moon" data-id="6d1lr539x" data-path="components/App.js"></i> Dark
                </button>
              </div>
            </div>

            <div className="setting-group" data-id="izd5p24p5" data-path="components/App.js">
              <label data-id="p6ft6qprs" data-path="components/App.js">
                {t("fontSize")}
              </label>
              <div className="font-size-options" data-id="djyvy0w9k" data-path="components/App.js">
                <button
                  className={`font-size-option ${fontSize === "small" ? "active" : ""}`}
                  onClick={() => setFontSize("small")}
                  data-id="veyuksfvc"
                  data-path="components/App.js"
                >
                  Small
                </button>
                <button
                  className={`font-size-option ${fontSize === "medium" ? "active" : ""}`}
                  onClick={() => setFontSize("medium")}
                  data-id="ndfk5xwtq"
                  data-path="components/App.js"
                >
                  Medium
                </button>
                <button
                  className={`font-size-option ${fontSize === "large" ? "active" : ""}`}
                  onClick={() => setFontSize("large")}
                  data-id="0cjynb61u"
                  data-path="components/App.js"
                >
                  Large
                </button>
              </div>
            </div>

            <div className="setting-group" data-id="n62ddm5yg" data-path="components/App.js">
              <label data-id="6t94t8ii5" data-path="components/App.js">
                {t("language")}
              </label>
              <div className="language-options" data-id="h6cs94qdh" data-path="components/App.js">
                <button
                  className={`language-option ${language === "en" ? "active" : ""}`}
                  onClick={() => handleLanguageChange("en")}
                  data-id="ipfij9j7j"
                  data-path="components/App.js"
                >
                  English
                </button>
                <button
                  className={`language-option ${language === "ar" ? "active" : ""}`}
                  onClick={() => handleLanguageChange("ar")}
                  data-id="xovoppxle"
                  data-path="components/App.js"
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <div
          className={`collaboration-panel ${theme === "dark" ? "collaboration-panel-dark" : ""}`}
          data-id="qz03b42c3"
          data-path="components/App.js"
        >
          <div className="collab-header" data-id="5f20t8dza" data-path="components/App.js">
            <h2 data-id="bjkzttx8r" data-path="components/App.js">
              {t("collaborationTitle")}
            </h2>
            <button
              className="close-btn"
              onClick={() => setShowCollaboration(false)}
              data-id="5x85cpcbx"
              data-path="components/App.js"
            >
              <i className="fas fa-times" data-id="4n6zv1j23" data-path="components/App.js"></i>
            </button>
          </div>
          <div className="collab-content" data-id="0zisqe9h0" data-path="components/App.js">
            <div className="collab-share" data-id="4zbu4tzqv" data-path="components/App.js">
              <h3 data-id="faijrdtzh" data-path="components/App.js">
                {t("share")}
              </h3>
              <div className="share-link-container" data-id="7psb552ob" data-path="components/App.js">
                <input
                  type="text"
                  readOnly
                  value="https://indexforme.com/shared/abcdef123456"
                  className="share-link-input"
                  data-id="m6vk3h8ho"
                  data-path="components/App.js"
                />
                <button className="btn btn-sm btn-primary" data-id="7hodintd4" data-path="components/App.js">
                  <i className="fas fa-copy" data-id="036i6i605" data-path="components/App.js"></i> Copy
                </button>
              </div>
            </div>

            <div className="collab-invite" data-id="x41ft93cr" data-path="components/App.js">
              <h3 data-id="z8dzgb3fq" data-path="components/App.js">
                {t("inviteMembers")}
              </h3>
              <div className="invite-input-container" data-id="oxpu57wsy" data-path="components/App.js">
                <input
                  type="email"
                  placeholder="Email address"
                  className="invite-input"
                  data-id="ur62ajx5r"
                  data-path="components/App.js"
                />
                <button className="btn btn-sm btn-primary" data-id="60srjvpoc" data-path="components/App.js">
                  <i className="fas fa-paper-plane" data-id="0cuk663oc" data-path="components/App.js"></i> Invite
                </button>
              </div>

              <div className="invited-members" data-id="pmjxuhnmu" data-path="components/App.js">
                <div className="member" data-id="i6ndd0edi" data-path="components/App.js">
                  <div className="member-avatar" data-id="lix6v0thq" data-path="components/App.js">
                    JS
                  </div>
                  <div className="member-info" data-id="yljqu8bq3" data-path="components/App.js">
                    <div className="member-name" data-id="0dta9z9hp" data-path="components/App.js">
                      John Smith
                    </div>
                    <div className="member-status" data-id="ckkv313hm" data-path="components/App.js">
                      Viewer
                    </div>
                  </div>
                  <button className="member-action" data-id="9vr38ipfs" data-path="components/App.js">
                    <i className="fas fa-ellipsis-v" data-id="x2a2980ig" data-path="components/App.js"></i>
                  </button>
                </div>

                <div className="member" data-id="w50tb6e8m" data-path="components/App.js">
                  <div className="member-avatar" data-id="6q49c4002" data-path="components/App.js">
                    AM
                  </div>
                  <div className="member-info" data-id="p1ujyau0j" data-path="components/App.js">
                    <div className="member-name" data-id="4zlcgqmgy" data-path="components/App.js">
                      Alice Miller
                    </div>
                    <div className="member-status" data-id="aufmvpsg5" data-path="components/App.js">
                      Editor
                    </div>
                  </div>
                  <button className="member-action" data-id="ylf8e0ozh" data-path="components/App.js">
                    <i className="fas fa-ellipsis-v" data-id="lo086lfgu" data-path="components/App.js"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="collab-comments" data-id="1m3dlj8tw" data-path="components/App.js">
              <h3 data-id="hlc15axu5" data-path="components/App.js">
                {t("comments")}
              </h3>
              <div className="comments-container" data-id="dcng0h73s" data-path="components/App.js">
                <div className="comment" data-id="rwtoykk8e" data-path="components/App.js">
                  <div className="comment-avatar" data-id="9uey8dnvx" data-path="components/App.js">
                    AM
                  </div>
                  <div className="comment-content" data-id="mxr2gamev" data-path="components/App.js">
                    <div className="comment-header" data-id="9ovdvrkkv" data-path="components/App.js">
                      <span className="comment-author" data-id="74x4basoq" data-path="components/App.js">
                        Alice Miller
                      </span>
                      <span className="comment-time" data-id="lplq2r4rx" data-path="components/App.js">
                        2 hours ago
                      </span>
                    </div>
                    <div className="comment-text" data-id="l4p6zh5ba" data-path="components/App.js">
                      I think we should reorganize the Technology section alphabetically.
                    </div>
                  </div>
                </div>

                <div className="comment" data-id="hjspsz2h6" data-path="components/App.js">
                  <div className="comment-avatar" data-id="w9ptizomo" data-path="components/App.js">
                    JS
                  </div>
                  <div className="comment-content" data-id="ujkv4xosn" data-path="components/App.js">
                    <div className="comment-header" data-id="jexxemsrl" data-path="components/App.js">
                      <span className="comment-author" data-id="s1cr48f7z" data-path="components/App.js">
                        John Smith
                      </span>
                      <span className="comment-time" data-id="0iz7027h9" data-path="components/App.js">
                        30 minutes ago
                      </span>
                    </div>
                    <div className="comment-text" data-id="hxiyj46lo" data-path="components/App.js">
                      Good idea. I'll work on that section next.
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment-input-container" data-id="fm888nnya" data-path="components/App.js">
                <textarea
                  placeholder="Add a comment..."
                  className="comment-input"
                  data-id="8fxanlm3g"
                  data-path="components/App.js"
                ></textarea>
                <button className="btn btn-sm btn-primary" data-id="jbdifo189" data-path="components/App.js">
                  <i className="fas fa-paper-plane" data-id="tm28kogdm" data-path="components/App.js"></i> Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Guide Panel */}
      {showGuide && <GuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} language={language} />}

      <footer
        className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t mt-12`}
        data-id="n0uucvere"
        data-path="components/App.js"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" data-id="j2fak4z9v" data-path="components/App.js">
          <p
            className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="0o04b832r"
            data-path="components/App.js"
          >
            &copy; {new Date().getFullYear()} Index for Me. All rights reserved.
          </p>
        </div>
      </footer>

      {showToast && (
        <div className={`toast-message toast-${toastType}`} data-id="dfoes0pv2" data-path="components/App.js">
          {toastMessage}
        </div>
      )}

      {/* Fixed position Undo/Redo buttons */}
      {indexItems.length > 0 && (
        <div className="fixed-action-buttons" data-id="a8hygl6ta" data-path="components/App.js">
          <button
            className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm`}
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            data-id="2gtc88ee1"
            data-path="components/App.js"
          >
            <i className="fas fa-undo" data-id="yfgypeu2r" data-path="components/App.js"></i> {t("undo")}
          </button>
          <button
            className={`btn ${theme === "dark" ? "btn-dark" : "btn-secondary"} text-sm ml-2`}
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            data-id="8anzqs6kt"
            data-path="components/App.js"
          >
            <i className="fas fa-redo" data-id="yxsal0pu0" data-path="components/App.js"></i> {t("redo")}
          </button>
        </div>
      )}
    </div>
  )
}
