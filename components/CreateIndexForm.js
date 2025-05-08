"use client"

import React from "react"

// Component for creating an index from scratch
function CreateIndexForm({ onIndexCreated, language, theme }) {
  const [numSections, setNumSections] = React.useState(3)
  const [numSubSections, setNumSubSections] = React.useState(2)
  const [numBranches, setNumBranches] = React.useState(2)
  const [numElements, setNumElements] = React.useState(1)
  const [totalBranchLevels, setTotalBranchLevels] = React.useState(5)
  const [selectedLevels, setSelectedLevels] = React.useState(3)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState("")
  const [preview, setPreview] = React.useState(null)

  // Create translator based on language prop
  const t = createTranslator(language || "en")

  // Update preview when form values change
  React.useEffect(() => {
    generatePreview()
  }, [numSections, numSubSections, numBranches, numElements])

  // Generate a preview of the structure
  const generatePreview = () => {
    let previewText = ""

    for (let i = 1; i <= Math.min(numSections, 3); i++) {
      previewText += `Section ${i}\n`

      if (numSubSections > 0) {
        for (let j = 1; j <= Math.min(numSubSections, 2); j++) {
          previewText += `  Sub-section ${i}.${j}\n`

          if (numBranches > 0) {
            for (let k = 1; k <= Math.min(numBranches, 2); k++) {
              previewText += `    Branch ${i}.${j}.${k}\n`

              if (numElements > 0) {
                for (let l = 1; l <= Math.min(numElements, 1); l++) {
                  previewText += `      Element ${i}.${j}.${k}.${l}\n`
                }
              }
            }
          }
        }
      }

      previewText += "\n"
    }

    setPreview(previewText)
  }

  // Validate input
  const validateInput = () => {
    if (numSections <= 0 || numSections > 20) {
      setError(t("invalidSectionsNumber"))
      return false
    }

    if (numSubSections < 0 || numSubSections > 10) {
      setError(t("invalidSubSectionsNumber"))
      return false
    }

    if (numBranches < 0 || numBranches > 10) {
      setError(t("invalidBranchesNumber"))
      return false
    }

    if (numElements < 0 || numElements > 10) {
      setError(t("invalidElementsNumber"))
      return false
    }

    setError("")
    return true
  }

  // Generate the index
  const generateIndex = () => {
    if (!validateInput()) return

    setIsGenerating(true)

    try {
      const items = []
      let itemId = 0

      // Generate sections (level 0)
      for (let i = 1; i <= numSections; i++) {
        items.push({
          id: `item-${itemId++}`,
          content: `Section ${i}`,
          level: 0,
          prefix: `S${i}`,
          collapsed: false,
        })

        // Generate sub-sections (level 1)
        for (let j = 1; j <= numSubSections; j++) {
          const letter = String.fromCharCode(96 + j) // a, b, c, etc.
          items.push({
            id: `item-${itemId++}`,
            content: `Sub-section ${i}.${j}`,
            level: 1,
            prefix: `${letter}`,
            collapsed: false,
          })

          // Generate branches (level 2)
          for (let k = 1; k <= numBranches; k++) {
            items.push({
              id: `item-${itemId++}`,
              content: `Branch ${i}.${j}.${k}`,
              level: 2,
              prefix: `${k}`,
              collapsed: false,
            })

            // Generate elements (level 3)
            for (let l = 1; l <= numElements; l++) {
              items.push({
                id: `item-${itemId++}`,
                content: `Element ${i}.${j}.${k}.${l}`,
                level: 3,
                prefix: `▣`,
                collapsed: false,
              })

              // Generate additional levels based on selectedLevels if needed
              if (selectedLevels > 4) {
                let currentLevel = 4
                let currentParent = `${i}.${j}.${k}.${l}`

                while (currentLevel < selectedLevels) {
                  items.push({
                    id: `item-${itemId++}`,
                    content: `Branch element ${currentParent}.1`,
                    level: currentLevel,
                    prefix: currentLevel === 4 ? "•" : "•",
                    collapsed: false,
                  })
                  currentParent = `${currentParent}.1`
                  currentLevel++
                }
              }
            }
          }
        }
      }

      // Call the callback with the generated index items
      onIndexCreated(items)
    } catch (err) {
      console.error("Error generating index:", err)
      setError(language === "ar" ? "حدث خطأ أثناء إنشاء الفهرس" : "An error occurred while creating the index")
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle input change
  const handleInputChange = (e, setter) => {
    const value = Number.parseInt(e.target.value, 10) || 0
    setter(value)
    setError("")
  }

  return (
    <div className="mt-6" data-id="pkk596r2l" data-path="components/CreateIndexForm.js">
      <div
        className={`create-index-form ${theme === "dark" ? "create-index-form-dark" : ""}`}
        data-id="qtk8a1jql"
        data-path="components/CreateIndexForm.js"
      >
        <h3
          className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          data-id="chlcnc8fv"
          data-path="components/CreateIndexForm.js"
        >
          {t("createIndex")}
        </h3>

        <div className="form-group" data-id="tscqxkcro" data-path="components/CreateIndexForm.js">
          <label
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            data-id="lqy49qx80"
            data-path="components/CreateIndexForm.js"
          >
            {language === "ar" ? "عدد المستويات" : "Number of Levels"}
          </label>
          <div className="mt-2" data-id="2ky9xws2b" data-path="components/CreateIndexForm.js">
            <div className="flex flex-wrap gap-2" data-id="cq4v8ex1r" data-path="components/CreateIndexForm.js">
              {[3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedLevels(num)}
                  className={`px-4 py-2 rounded-md ${
                    selectedLevels === num
                      ? "bg-gray-800 text-white"
                      : theme === "dark"
                        ? "bg-dark-surface text-dark-text"
                        : "bg-gray-100 text-gray-700"
                  }`}
                  data-id="8ycxw8gus"
                  data-path="components/CreateIndexForm.js"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="rz6mr9d64"
            data-path="components/CreateIndexForm.js"
          >
            {language === "ar" ? "اختر عدد المستويات في الفهرس" : "Select the number of levels in your index"}
          </p>
        </div>

        <div className="form-group" data-id="0ufla8lkq" data-path="components/CreateIndexForm.js">
          <label
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            data-id="h9a3w0it9"
            data-path="components/CreateIndexForm.js"
          >
            {t("numberOfSections")}
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={numSections}
            onChange={(e) => handleInputChange(e, setNumSections)}
            className={`${theme === "dark" ? "dark-input" : ""}`}
            data-id="977ssp27p"
            data-path="components/CreateIndexForm.js"
          />

          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="jkox7g6p2"
            data-path="components/CreateIndexForm.js"
          >
            {t("mainCategories")}
          </p>
        </div>

        <div className="form-group" data-id="byu0hi8ft" data-path="components/CreateIndexForm.js">
          <label
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            data-id="bt5v6lw3f"
            data-path="components/CreateIndexForm.js"
          >
            {t("numberOfSubSections")}
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={numSubSections}
            onChange={(e) => handleInputChange(e, setNumSubSections)}
            className={`${theme === "dark" ? "dark-input" : ""}`}
            data-id="nl4yqgmtn"
            data-path="components/CreateIndexForm.js"
          />

          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="3v0wsy5kt"
            data-path="components/CreateIndexForm.js"
          >
            {t("subCategoriesPerSection")}
          </p>
        </div>

        <div className="form-group" data-id="xhe9fcrkx" data-path="components/CreateIndexForm.js">
          <label
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            data-id="ivj5zcjnm"
            data-path="components/CreateIndexForm.js"
          >
            {t("numberOfBranches")}
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={numBranches}
            onChange={(e) => handleInputChange(e, setNumBranches)}
            className={`${theme === "dark" ? "dark-input" : ""}`}
            data-id="rp22d1a9x"
            data-path="components/CreateIndexForm.js"
          />

          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="vwe45uikq"
            data-path="components/CreateIndexForm.js"
          >
            {t("branchesPerSubSection")}
          </p>
        </div>

        <div className="form-group" data-id="vtl539sg3" data-path="components/CreateIndexForm.js">
          <label
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            data-id="4wx8fuxbi"
            data-path="components/CreateIndexForm.js"
          >
            {t("numberOfElements")}
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={numElements}
            onChange={(e) => handleInputChange(e, setNumElements)}
            className={`${theme === "dark" ? "dark-input" : ""}`}
            data-id="6a9awuxxe"
            data-path="components/CreateIndexForm.js"
          />

          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            data-id="c0jixi8ea"
            data-path="components/CreateIndexForm.js"
          >
            {t("elementsPerBranch")}
          </p>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600" data-id="rgwbn925u" data-path="components/CreateIndexForm.js">
            <i
              className="fas fa-exclamation-circle mr-1"
              data-id="cqlkpgzf2"
              data-path="components/CreateIndexForm.js"
            ></i>{" "}
            {error}
          </p>
        )}

        <div className="mt-4" data-id="hsyuauwez" data-path="components/CreateIndexForm.js">
          <button
            className={`btn ${theme === "dark" ? "btn-primary-dark" : "btn-primary"}`}
            onClick={generateIndex}
            disabled={isGenerating}
            data-id="nehmlcess"
            data-path="components/CreateIndexForm.js"
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin" data-id="7vzo3cqjx" data-path="components/CreateIndexForm.js"></i>{" "}
                {t("generating")}
              </>
            ) : (
              <>
                <i className="fas fa-magic" data-id="7si1y62cf" data-path="components/CreateIndexForm.js"></i>{" "}
                {t("createIndexButton")}
              </>
            )}
          </button>
        </div>

        {preview && (
          <div
            className={`preview-section mt-6 ${theme === "dark" ? "preview-section-dark" : ""}`}
            data-id="ct2v1eghf"
            data-path="components/CreateIndexForm.js"
          >
            <h4
              className={`font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              data-id="0l6n1pgi8"
              data-path="components/CreateIndexForm.js"
            >
              {t("preview")}
            </h4>
            <pre
              className={`text-xs whitespace-pre-wrap overflow-auto max-h-40 p-2 rounded ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              data-id="05ntjs0mo"
              data-path="components/CreateIndexForm.js"
            >
              {preview}
            </pre>
            <p
              className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              data-id="3zp2v5dwx"
              data-path="components/CreateIndexForm.js"
            >
              <i className="fas fa-info-circle mr-1" data-id="7qqf9lh07" data-path="components/CreateIndexForm.js"></i>{" "}
              {t("previewNote")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
