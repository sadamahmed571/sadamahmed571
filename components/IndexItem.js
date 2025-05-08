"use client"

import React from "react"
import { createTranslator } from "next-intl"

// Component for individual index items in the workspace
function IndexItem({
  item,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onLevelChange,
  onEdit,
  onDelete,
  onToggleCollapse,
  language,
  theme,
  children,
}) {
  const { id, content, level, prefix, collapsed } = item
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedContent, setEditedContent] = React.useState(content)
  const hasChildren = Array.isArray(children) && children.length > 0

  // Create translator based on language prop
  const t = createTranslator(language || "en")

  // Reference for the draggable element
  const itemRef = React.useRef(null)
  const inputRef = React.useRef(null)

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Handle drag start
  const handleDragStart = (e) => {
    if (isEditing) return // Prevent dragging while editing

    e.dataTransfer.setData("text/plain", id)

    // Set a brief timeout to add dragging class for visual feedback
    setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.classList.add("dragging")
      }
    }, 0)

    // Call the parent component's drag start handler
    onDragStart(id)
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (itemRef.current) {
      itemRef.current.classList.remove("dragging")
    }
    onDragEnd()
  }

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    onDragOver(id)
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    const draggedItemId = e.dataTransfer.getData("text/plain")
    onDrop(draggedItemId, id)
  }

  // Increase level (indent)
  const increaseLevel = (e) => {
    e.stopPropagation()
    if (level < 3) {
      onLevelChange(id, level + 1)
    }
  }

  // Decrease level (outdent)
  const decreaseLevel = (e) => {
    e.stopPropagation()
    if (level > 0) {
      onLevelChange(id, level - 1)
    }
  }

  // Start editing the item
  const startEditing = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  // Save edited content
  const saveEdit = () => {
    if (editedContent.trim()) {
      onEdit(id, editedContent)
      setIsEditing(false)
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    setEditedContent(e.target.value)
  }

  // Handle keyboard events in the input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      setEditedContent(content)
      setIsEditing(false)
    }
  }

  // Handle item deletion
  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm(t("confirmDelete"))) {
      onDelete(id)
    }
  }

  // Handle collapse toggle
  const toggleCollapse = (e) => {
    e.stopPropagation()
    if (hasChildren) {
      // Allow collapsing for all levels with children
      onToggleCollapse(id)
    }
  }

  return (
    <div
      ref={itemRef}
      className={`index-item level-${level} ${theme === "dark" ? "index-item-dark" : ""}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-id="pwzq75zim"
      data-path="components/IndexItem.js"
    >
      <div className="flex items-center justify-between w-full" data-id="hws7b4531" data-path="components/IndexItem.js">
        <div
          className="flex items-center flex-grow overflow-hidden"
          data-id="0btnu5f2f"
          data-path="components/IndexItem.js"
        >
          <span
            className={`index-prefix ${level <= 1 ? "text-white" : "text-black"}`}
            data-id="wtw9izdys"
            data-path="components/IndexItem.js"
          >
            {prefix}
          </span>

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedContent}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              className={`index-item-input flex-grow ${theme === "dark" ? "dark-input" : ""}`}
              dir={language === "ar" ? "rtl" : "ltr"}
              data-id="ey9xiig47"
              data-path="components/IndexItem.js"
            />
          ) : (
            <span
              className="index-content flex-grow overflow-hidden text-ellipsis"
              onDoubleClick={startEditing}
              data-id="qbwlf9mhx"
              data-path="components/IndexItem.js"
            >
              {content}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2" data-id="rp3yx5zlc" data-path="components/IndexItem.js">
          {/* Collapse button for all levels with children */}
          <button
            className={level <= 1 ? "text-white hover:text-gray-200" : "text-black hover:text-gray-800"}
            onClick={toggleCollapse}
            title={collapsed ? t("expandSection") : t("collapseSection")}
            data-id="2o0l8gup1"
            data-path="components/IndexItem.js"
          >
            <i
              className={`fas ${collapsed ? "fa-angle-down" : "fa-angle-up"}`}
              data-id="h62868820"
              data-path="components/IndexItem.js"
            ></i>
          </button>

          {/* Edit button */}
          <button
            className={level <= 1 ? "text-white hover:text-gray-200" : "text-black hover:text-gray-800"}
            onClick={startEditing}
            title={t("editItem")}
            data-id="lrj63mpli"
            data-path="components/IndexItem.js"
          >
            <i className="fas fa-edit" data-id="taz5brnrt" data-path="components/IndexItem.js"></i>
          </button>

          {/* Decrease level button */}
          <button
            className={level <= 1 ? "text-white hover:text-gray-200" : "text-black hover:text-gray-800"}
            onClick={decreaseLevel}
            disabled={level === 0}
            title={t("decreaseLevel")}
            data-id="73rh5ephn"
            data-path="components/IndexItem.js"
          >
            <i className="fas fa-outdent" data-id="0oww733nj" data-path="components/IndexItem.js"></i>
          </button>

          {/* Increase level button */}
          <button
            className={level <= 1 ? "text-white hover:text-gray-200" : "text-black hover:text-gray-800"}
            onClick={increaseLevel}
            disabled={level === 6}
            title={t("increaseLevel")}
            data-id="6xoak8wri"
            data-path="components/IndexItem.js"
          >
            <i className="fas fa-indent" data-id="ayt3lh2ya" data-path="components/IndexItem.js"></i>
          </button>

          {/* Delete button */}
          <button
            className={level <= 1 ? "text-white hover:text-red-200" : "text-red-600 hover:text-red-800"}
            onClick={handleDelete}
            title={t("deleteItem")}
            data-id="qlrixy4gd"
            data-path="components/IndexItem.js"
          >
            <i className="fas fa-trash-alt" data-id="18iz2w090" data-path="components/IndexItem.js"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IndexItem
