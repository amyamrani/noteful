import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Note from '../Note/Note';
import APIContext from '../APIContext';
import { Link } from 'react-router-dom';
import config from '../config';
import { Redirect } from 'react-router-dom';
import './NotesList.css';

class NotesList extends Component {
  static contextType = APIContext;

  handleDeleteFolder = (folderId, callback) => {
    fetch(`${config.API_BASE_URL}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(data => {
        callback(folderId)
      }) 
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    let notes = [];

    if (this.props.folderId) {
      notes = this.context.notes.filter(note => note.folder_id === Number(this.props.folderId))
      const folder = this.context.folders.find(folder => folder.id === Number(this.props.folderId));

      if (!folder) {
        return <Redirect to="/" />
      }
    } else {
      notes = this.context.notes;
    }
    
    return (
      <div>
        <div className='note-list'>
          {notes.map(note => (
            <Note 
              key={note.id}
              note={note} 
            />
          ))}
        </div>

        <div className='add-note'>
          <Link to='/note/new' className='add-note__button'>Add Note</Link>
        </div>

        {this.props.folderId && (
          <div>
            <div className='add-note'>
              <Link to={`/folder/${this.props.folderId}/edit`} className='folder-edit__button'>Edit Folder</Link>
            </div>

            <div className='folder-delete'>
            
              <button
                className='folder-delete__button'
                type='button'
                onClick={() => {
                  this.handleDeleteFolder(
                    this.props.folderId,
                    this.context.deleteFolder,
                  )
                }}
              >
                Delete Folder 
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

NotesList.defaultProps = {
  folderId: '',
};

NotesList.propTypes = {
  folderId: PropTypes.string,
}

export default NotesList;