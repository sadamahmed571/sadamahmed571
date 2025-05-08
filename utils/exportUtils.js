// Utility functions for exporting the reorganized index

// Convert index items to a formatted text string
function formatIndexText(items) {
  return items
    .map((item) => {
      const indentation = "  ".repeat(item.level)
      return `${indentation}${item.content}`
    })
    .join("\n")
}

// Copy the formatted index text to clipboard
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    try {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch((err) => {
          console.error("Clipboard API failed:", err)

          // Fallback method using textarea element
          const textArea = document.createElement("textarea")
          textArea.value = text
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          textArea.style.top = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          const success = document.execCommand("copy")
          document.body.removeChild(textArea)

          if (success) {
            resolve(true)
          } else {
            reject(new Error("Failed to copy text to clipboard"))
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

// Export index to a Word document (.docx)
function exportToWord(items, filename = "index.docx") {
  try {
    // Create HTML content for Word document
    const text = formatIndexText(items)
    const formattedHtml = `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Calibri', Arial, sans-serif; }
            p { margin: 0; padding: 0; }
            .level-0 { font-weight: bold; }
            .level-1 { margin-left: 20px; }
            .level-2 { margin-left: 40px; }
            .level-3 { margin-left: 60px; }
          </style>
        </head>
        <body>
          ${items.map((item) => `<p class="level-${item.level}">${item.content}</p>`).join("\n")}
        </body>
      </html>`

    // Create a Blob from the HTML content
    const blob = new Blob([formattedHtml], { type: "application/msword" })

    // Create a download link
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error("Error exporting to Word:", error)
    throw new Error("Failed to export to Word document")
  }
}

// Export index to a PDF document
function exportToPDF(items, filename = "index.pdf") {
  try {
    // Create PDF formatted HTML content
    const formattedHtml = `<!DOCTYPE html>
      <html>
        <head>
          <title>Index Export</title>
          <style>
            body { font-family: 'Arial', sans-serif; font-size: 12pt; }
            p { margin: 0; padding: 0; margin-bottom: 8px; }
            .level-0 { font-weight: bold; }
            .level-1 { margin-left: 20px; }
            .level-2 { margin-left: 40px; }
            .level-3 { margin-left: 60px; }
            .level-4 { margin-left: 80px; }
            .level-5 { margin-left: 100px; }
            .level-6 { margin-left: 120px; }
          </style>
        </head>
        <body>
          <h1>Document Index</h1>
          ${items.map((item) => `<p class="level-${item.level}">${item.content}</p>`).join("\n")}
        </body>
      </html>`

    // Create a Blob from the HTML content
    const blob = new Blob([formattedHtml], { type: "application/pdf" })

    // Create a download link
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    throw new Error("Failed to export to PDF document")
  }
}
