import { Component } from 'react'

/**
 * Guards the page against a failing scene: if one section throws, the rest of
 * the experience keeps rendering and the error is contained to a quiet strip.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Scene error:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[30vh] items-center justify-center px-6 py-24">
          <div className="max-w-md text-center">
            <p className="font-mono text-[10px] uppercase tracking-meta text-violet-400">
              A scene failed to render
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 font-mono text-[11px] uppercase tracking-meta text-white/70"
              style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              Retry
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}