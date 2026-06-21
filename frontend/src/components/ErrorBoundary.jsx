// 1. React imports
import React from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports (none)

// 4. PropTypes object declaration
const errorBoundaryPropTypes = {
  children: PropTypes.node.isRequired
};

// 5. Component function
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1 className="error-fallback__title">Something went wrong</h1>
          <p className="error-fallback__msg">
            An unexpected error occurred in the application. Let's try resetting the state to continue.
          </p>
          <button className="btn btn--primary" onClick={this.handleReset}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = errorBoundaryPropTypes;

// 6. Default export
export default ErrorBoundary;
