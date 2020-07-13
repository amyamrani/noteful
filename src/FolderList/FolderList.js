import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './FolderList.css';

class FolderList extends Component {
  static contextType = APIContext;

  render() {
    return (
      <div>
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

        <div className='add-folder'>
          <Link to='/folder/new' className='add-folder__button'>Add Folder</Link>
        </div>
      </div>
    )
  }
}

export default FolderList;