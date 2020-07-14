import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AppError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2>Sorry something went wrong. Please try again later.</h2>
      );
    }
    return this.props.children;
  }
}

AppError.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppError;