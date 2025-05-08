"use client"

import React from "react"

// Initialize the React application
const rootElement = document.getElementById("root")
const root = ReactDOM.createRoot(rootElement)

// Configure Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-6 bg-red-50 rounded-lg border border-red-200 mt-4 max-w-4xl mx-auto"
          data-id="smxoq1v7m"
          data-path="index.js"
        >
          <h2 className="text-xl font-bold text-red-700 mb-2" data-id="h4uarbwqt" data-path="index.js">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4" data-id="duwbezck4" data-path="index.js">
            The application encountered an error. Please try refreshing the page.
          </p>
          <details className="bg-white p-4 rounded border border-red-200" data-id="n9zov4xm4" data-path="index.js">
            <summary className="cursor-pointer font-medium mb-2" data-id="19pwl9f44" data-path="index.js">
              Technical Details
            </summary>
            <pre
              className="text-xs whitespace-pre-wrap text-red-800 overflow-auto max-h-48"
              data-id="tj5jxwcj9"
              data-path="index.js"
            >
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
            data-id="lvd8d8tyj"
            data-path="index.js"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Render the App component wrapped in an ErrorBoundary
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
