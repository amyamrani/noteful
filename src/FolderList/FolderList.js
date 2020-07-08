import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import APIContext from '../APIContext';
import './FolderList.css';

class FolderList extends Component {
  static defaultProps = {
    folders: []
  };

  static contextType = APIContext;

  render() {
    return (
      <div className='folder-list'>
        {this.context.folders.map(folder => (
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