import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css'

class Sidebar extends Component {
  render() {
    return (
      <div className='app-sidebar'>
        {this.props.children}
      </div>
    )
  }
}

Sidebar.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Sidebar;