import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './FolderList.css';

class FolderList extends Component {
  render() {
    return (
    <div className='folder-list'>
      {this.props.folders.map(folder => (
        <NavLink 
          className='folder-list__item'
          to={`/folder/${folder.id}`}
          key={folder.id}
        >
          {folder.name}
        </NavLink>
      ))}
    </div>
    )
  }
}

export default FolderList;