'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-8 text-center">
            <p className="text-3xl mb-4">⚠️</p>
            <p className="text-red-400 font-medium mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
