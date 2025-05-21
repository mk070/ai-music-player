import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-navy p-4">
          <div className="bg-navy-dark p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-content mb-4">Something went wrong</h2>
            <p className="text-text-light mb-6">We're having trouble loading this page. Please try refreshing.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-content rounded-lg hover:bg-accent-light transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
