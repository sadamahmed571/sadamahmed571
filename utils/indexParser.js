// Utility functions for parsing index content from different sources

// Function to parse text input and extract index structure
function parseTextInput(text) {
  if (!text || text.trim() === "") return []

  const lines = text.split("\n").filter((line) => line.trim() !== "")

  // Analyze indentation or numbering pattern to determine levels
  return lines.map((line, index) => {
    // Determine level based on indentation and numbering patterns
    const level = determineLevel(line, index, lines)

    return {
      id: `item-${index}`,
      content: line.trim(),
      level: level,
      children: [],
    }
  })
}

// Determine the level of an index item based on indentation or numbering patterns
function determineLevel(line, index, allLines) {
  // Detect level based on leading spaces/tabs
  const leadingSpaces = line.length - line.trimStart().length

  // Detect level based on common numbering patterns
  const hasRomanNumeral = /^[IVXLCDM]+\.?\s/.test(line.trimStart())
  const hasNumber = /^\d+(\.\d+)*\.?\s/.test(line.trimStart())
  const hasLetter = /^[a-zA-Z]\.?\s/.test(line.trimStart())
  const hasBullet = /^[•\-*]\s/.test(line.trimStart())

  // Count the dots for hierarchical numbering like "1.2.3"
  const dotMatches = line.match(/\d+\./g)
  const dotCount = dotMatches ? dotMatches.length : 0

  // Default level is 0, adjust based on patterns
  let level = 0

  // Adjust level based on space indentation (relative to other lines)
  if (index > 0) {
    const prevLine = allLines[index - 1]
    const prevLeadingSpaces = prevLine.length - prevLine.trimStart().length

    if (leadingSpaces > prevLeadingSpaces) {
      // Indented more than previous line, increase level
      level = Math.min(3, Math.floor((leadingSpaces - prevLeadingSpaces) / 2) + getBaseLevel(prevLine))
    } else if (leadingSpaces === prevLeadingSpaces) {
      // Same indentation, maintain level
      level = getBaseLevel(prevLine)
    }
  }

  // Adjust based on numbering patterns
  if (hasRomanNumeral) level = Math.max(level, 0)
  else if (hasNumber && dotCount === 0) level = Math.max(level, 0)
  else if (dotCount === 1) level = Math.max(level, 1)
  else if (dotCount === 2) level = Math.max(level, 2)
  else if (dotCount >= 3) level = Math.max(level, 3)
  else if (hasLetter) level = Math.max(level, 1)
  else if (hasBullet) level = Math.max(level, 2)

  return Math.min(level, 3) // Cap at level 3
}

// Helper function to get base level from a line based on numbering
function getBaseLevel(line) {
  const trimmedLine = line.trimStart()
  const hasRomanNumeral = /^[IVXLCDM]+\.?\s/.test(trimmedLine)
  const hasNumber = /^\d+(\.\d+)*\.?\s/.test(trimmedLine)
  const hasLetter = /^[a-zA-Z]\.?\s/.test(trimmedLine)
  const hasBullet = /^[•\-*]\s/.test(trimmedLine)

  const dotMatches = line.match(/\d+\./g)
  const dotCount = dotMatches ? dotMatches.length : 0

  if (hasRomanNumeral) return 0
  if (hasNumber && dotCount === 0) return 0
  if (dotCount === 1) return 1
  if (dotCount === 2) return 2
  if (dotCount >= 3) return 3
  if (hasLetter) return 1
  if (hasBullet) return 2

  return 0 // Default level
}

// Function to parse PDF content
async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let textContent = ""

    // Iterate through each page to extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map((item) => item.str)
      textContent += strings.join("\n") + "\n"
    }

    // Parse the extracted text
    return parseTextInput(textContent)
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error("Failed to parse PDF file")
  }
}

// Function to parse Word document
async function parseWord(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    const textContent = result.value

    // Parse the extracted text
    return parseTextInput(textContent)
  } catch (error) {
    console.error("Error parsing Word document:", error)
    throw new Error("Failed to parse Word document")
  }
}

// Convert index items to a formatted string
function indexItemsToText(items) {
  return items
    .map((item) => {
      const indentation = "  ".repeat(item.level)
      return `${indentation}${item.content}`
    })
    .join("\n")
}
