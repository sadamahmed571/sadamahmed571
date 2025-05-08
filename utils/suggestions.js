// Utility for generating smart index organization suggestions

// Check if top-level items should be alphabetized
function checkAlphabeticalOrder(items) {
  // Filter only top-level (level 0) items
  const topLevelItems = items.filter((item) => item.level === 0)

  if (topLevelItems.length < 3) return null // Not enough items to suggest ordering

  // Extract just the content of top-level items
  const contents = topLevelItems.map((item) => item.content.trim())

  // Create a sorted copy
  const sortedContents = [...contents].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  // Check if they're already in alphabetical order
  const isAlphabetical = contents.every(
    (content, index) => content.toLowerCase() === sortedContents[index].toLowerCase(),
  )

  if (!isAlphabetical) {
    return {
      type: "alphabetical",
      message: "Consider organizing top-level entries in alphabetical order for easier navigation",
      action: () => {
        // Logic to reorder items alphabetically would go here
        // This would be implemented when the suggestion is applied
        const reorderedItems = [...items]
        const topLevelIndices = reorderedItems
          .map((item, index) => (item.level === 0 ? index : null))
          .filter((index) => index !== null)

        // Sort the top-level items by content
        topLevelIndices.sort((a, b) =>
          reorderedItems[a].content.toLowerCase().localeCompare(reorderedItems[b].content.toLowerCase()),
        )

        // Create a new array with sorted top-level items, keeping sub-items with their parents
        const result = []
        topLevelIndices.forEach((topIdx) => {
          // Add the top-level item
          result.push(reorderedItems[topIdx])

          // Find and add all subsequent items that belong under this top-level item
          let nextTopIdx = topLevelIndices.find((idx) => idx > topIdx)
          if (!nextTopIdx) nextTopIdx = reorderedItems.length

          for (let i = topIdx + 1; i < nextTopIdx; i++) {
            if (reorderedItems[i].level > 0) {
              result.push(reorderedItems[i])
            }
          }
        })

        return result
      },
    }
  }

  return null
}

// Check for consistent hierarchy
function checkHierarchyConsistency(items) {
  if (items.length < 5) return null // Not enough items to suggest reorganization

  let issues = false

  // Check if there are level 2+ items directly after level 0 items (skipping level 1)
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].level === 0 && items[i + 1].level > 1) {
      issues = true
      break
    }
  }

  if (issues) {
    return {
      type: "hierarchy",
      message: "Consider adding intermediate categories to create a more consistent hierarchy",
      action: () => {
        // Simple fix to demonstrate - normalize levels so they never jump by more than 1
        const fixedItems = [...items]
        for (let i = 1; i < fixedItems.length; i++) {
          const prevLevel = fixedItems[i - 1].level
          if (fixedItems[i].level > prevLevel + 1) {
            fixedItems[i] = { ...fixedItems[i], level: prevLevel + 1 }
          }
        }
        return fixedItems
      },
    }
  }

  return null
}

// Check for overly long sections that might benefit from subdivision
function checkSectionLength(items) {
  // Group items by their level 0 parent
  const sections = []
  let currentSection = []

  for (let i = 0; i < items.length; i++) {
    if (items[i].level === 0) {
      if (currentSection.length > 0) {
        sections.push(currentSection)
      }
      currentSection = [items[i]]
    } else {
      currentSection.push(items[i])
    }
  }

  if (currentSection.length > 0) {
    sections.push(currentSection)
  }

  // Find very large sections
  const largeSections = sections.filter((section) => section.length > 10)

  if (largeSections.length > 0) {
    return {
      type: "section_length",
      message: "Some sections are very long. Consider breaking them into smaller subsections for better organization",
      action: () => items, // Would need a more advanced algorithm to implement this suggestion
    }
  }

  return null
}

// Generate all applicable suggestions for the current index
function generateSuggestions(items) {
  if (!items || items.length < 2) return []

  const suggestions = []

  const alphabetical = checkAlphabeticalOrder(items)
  if (alphabetical) suggestions.push(alphabetical)

  const hierarchy = checkHierarchyConsistency(items)
  if (hierarchy) suggestions.push(hierarchy)

  const sectionLength = checkSectionLength(items)
  if (sectionLength) suggestions.push(sectionLength)

  return suggestions
}
