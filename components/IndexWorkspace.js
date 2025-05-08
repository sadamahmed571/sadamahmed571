"use client"

import React from "react"
import { createTranslator } from "next-intl"
import IndexItem from "./IndexItem"

// Component for the workspace where users can rearrange index items
function IndexWorkspace({ items, setItems, language, theme }) {
  const [draggedItemId, setDraggedItemId] = React.useState(null)
  const [dropTargetId, setDropTargetId] = React.useState(null)
  const [showToast, setShowToast] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState("")
  const [toastType, setToastType] = React.useState("success")

  // Create translator based on language prop
  const t = createTranslator(language || "en")

  // Handle drag start
  const handleDragStart = (id) => {
    setDraggedItemId(id)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDropTargetId(null)
  }

  // Handle drag over
  const handleDragOver = (id) => {
    if (id !== draggedItemId) {
      setDropTargetId(id)
    }
  }

  // Handle drop
  const handleDrop = (draggedId, targetId) => {
    if (draggedId === targetId) return

    const draggedIndex = items.findIndex((item) => item.id === draggedId)
    const targetIndex = items.findIndex((item) => item.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Create a copy of items array
      const newItems = [...items]
      // Remove the dragged item
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      // Insert the dragged item at target position
      newItems.splice(targetIndex, 0, draggedItem)

      // Update the items state
      setItems(newItems)
      showToastMessage("Item moved successfully", "success")
    }

    setDraggedItemId(null)
    setDropTargetId(null)
  }

  // Handle level change
  const handleLevelChange = (id, newLevel) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, level: newLevel } : item))

    setItems(newItems)
    showToastMessage("Level updated", "success")
  }

  // Handle item edit
  const handleItemEdit = (id, newContent) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, content: newContent } : item))

    setItems(newItems)
    showToastMessage("Item updated", "success")
  }

  // Handle item deletion
  const handleItemDelete = (id) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)
    showToastMessage("Item deleted", "success")
  }

  // Toggle collapse state for an item
  const handleToggleCollapse = (id) => {
    // Find the item that we want to toggle
    const itemIndex = items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return

    const item = items[itemIndex]
    const level = item.level
    const newCollapsed = !item.collapsed

    // Update the item's collapsed state
    const newItems = [...items]
    newItems[itemIndex] = { ...item, collapsed: newCollapsed }

    // If we're collapsing, we need to find all child items
    if (newCollapsed) {
      // Find all direct children that should be hidden
      // A direct child has a level one greater than the current item
      const childLevel = level + 1

      // We need to track which items at the child level are children of our target item
      // Start from the item's position and go forward
      let i = itemIndex + 1

      // Keep going until we reach an item with level <= current item's level
      while (i < newItems.length && newItems[i].level > level) {
        // Mark all descendants as collapsed
        newItems[i] = { ...newItems[i], collapsed: true }
        i++
      }
    } else {
      // If we're expanding, we need to uncollapse direct children
      // but keep the collapsed state of deeper descendants

      // Start from the item's position and go forward
      let i = itemIndex + 1

      // Keep track of the current level we're processing
      let currentLevel = null

      // Keep going until we reach an item with level <= current item's level
      while (i < newItems.length && newItems[i].level > level) {
        // If this is a direct child (one level deeper than the parent)
        if (newItems[i].level === level + 1) {
          // Uncollapse direct children
          newItems[i] = { ...newItems[i], collapsed: false }
          currentLevel = level + 1
        } else if (currentLevel !== null && newItems[i].level > currentLevel) {
          // Keep deeper descendants in their current collapsed state
          // (we don't modify them)
        } else {
          // Reset tracking when we move to a different branch
          currentLevel = null
        }
        i++
      }
    }

    setItems(newItems)
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

  // Get the appropriate prefix for an item based on its level
  const getPrefixForLevel = (level, index) => {
    switch (level) {
      case 0:
        return `S${index + 1}` // Main sections: S1, S2, etc.
      case 1:
        return String.fromCharCode(97 + (index % 26)) // Subsections: a, b, c, etc.
      case 2:
        return `${(index % 10) + 1}` // Branches: 1, 2, 3, etc.
      case 3:
        return "▣" // Elements: ▣
      default:
        return "•" // Deeper levels: •
    }
  }

  // If there are no items, show a placeholder
  if (items.length === 0) {
    return (
      <div
        className={`workspace empty-workspace ${theme === "dark" ? "empty-workspace-dark" : ""}`}
        data-id="nqtnqr1mp"
        data-path="components/IndexWorkspace.js"
      >
        <i
          className={`fas fa-book-open text-4xl mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          data-id="2sadqgexb"
          data-path="components/IndexWorkspace.js"
        ></i>
        <p
          className={`text-lg ${theme === "dark" ? "text-gray-300" : ""}`}
          data-id="9hwhrgso5"
          data-path="components/IndexWorkspace.js"
        >
          {language === "ar" ? "سيظهر الفهرس الخاص بك هنا" : "Your index will appear here"}
        </p>
        <p
          className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          data-id="rko74sc86"
          data-path="components/IndexWorkspace.js"
        >
          {language === "ar"
            ? "قم بتحميل ملف أو لصق نص الفهرس للبدء"
            : "Upload a file or paste your index text to get started"}
        </p>
      </div>
    )
  }

  // Render items in a hierarchical structure with collapsible sections
  const renderItems = () => {
    // Create a copy of items to work with
    const visibleItems = []
    const itemsWithCollapsedState = [...items]

    // First pass: determine which items should be visible based on collapsed state
    for (let i = 0; i < itemsWithCollapsedState.length; i++) {
      const item = itemsWithCollapsedState[i]

      // Check if any parent is collapsed
      let isHidden = false
      let currentLevel = item.level

      // Look backwards from the current item to find potential parents
      for (let j = i - 1; j >= 0; j--) {
        const potentialParent = itemsWithCollapsedState[j]

        // If we find an item with a lower level, it's a potential parent
        if (potentialParent.level < currentLevel) {
          // If this parent is collapsed, then the current item should be hidden
          if (potentialParent.collapsed) {
            isHidden = true
            break
          }
          // Update current level to continue checking higher-level parents
          currentLevel = potentialParent.level
        }
      }

      if (!isHidden) {
        visibleItems.push(item)
      }
    }

    // Second pass: render visible items with drag-and-drop functionality
    return visibleItems.map((item, index) => {
      // Find children for the current item (used to determine if collapse button should be shown)
      const children = visibleItems.filter(
        (child) =>
          child.level === item.level + 1 &&
          visibleItems.indexOf(child) > index &&
          visibleItems.findIndex(
            (p) =>
              p.level <= item.level &&
              visibleItems.indexOf(p) > index &&
              visibleItems.indexOf(p) < visibleItems.indexOf(child),
          ) === -1,
      )

      return (
        <React.Fragment key={item.id}>
          {dropTargetId === item.id && draggedItemId && (
            <div
              className={`drop-indicator ${theme === "dark" ? "drop-indicator-dark" : ""}`}
              data-id="125soipzd"
              data-path="components/IndexWorkspace.js"
            ></div>
          )}
          <IndexItem
            item={item}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onLevelChange={handleLevelChange}
            onEdit={handleItemEdit}
            onDelete={handleItemDelete}
            onToggleCollapse={handleToggleCollapse}
            language={language}
            theme={theme}
            children={children}
          />
        </React.Fragment>
      )
    })
  }

  return (
    <div
      className={`workspace ${theme === "dark" ? "workspace-dark" : ""}`}
      data-id="kas2v81ar"
      data-path="components/IndexWorkspace.js"
    >
      <div
        className={`instructions ${theme === "dark" ? "instructions-dark" : ""}`}
        data-id="g49cczu50"
        data-path="components/IndexWorkspace.js"
      >
        <p data-id="zsvy0wxvu" data-path="components/IndexWorkspace.js">
          <i className="fas fa-info-circle mr-2" data-id="7erpotdjp" data-path="components/IndexWorkspace.js"></i>
          {language === "ar"
            ? "اسحب العناصر لإعادة ترتيبها. استخدم أزرار التضمين/الإخراج لتغيير المستويات. اضغط على السهم لطي أو فتح الأقسام."
            : "Drag items to reorder them. Use indent/outdent buttons to change levels. Click the arrow to collapse or expand sections."}
        </p>
      </div>
      <div
        className="index-items-container w-full overflow-hidden"
        data-id="hk6s13dmp"
        data-path="components/IndexWorkspace.js"
      >
        {renderItems()}
      </div>
      {showToast && (
        <div
          className={`toast-message toast-${toastType}`}
          data-id="1dff3o792"
          data-path="components/IndexWorkspace.js"
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
