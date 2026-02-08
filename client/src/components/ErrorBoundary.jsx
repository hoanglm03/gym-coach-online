import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#111',
          color: '#eee',
          padding: 24,
          fontFamily: 'sans-serif',
        }}>
          <h2 style={{ color: '#f87171' }}>Lỗi hiển thị</h2>
          <pre style={{ background: '#333', padding: 12, overflow: 'auto', fontSize: 12 }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
