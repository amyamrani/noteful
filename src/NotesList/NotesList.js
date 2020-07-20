import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Note from '../Note/Note';
import APIContext from '../APIContext';
import { Link } from 'react-router-dom';
import './NotesList.css';

class NotesList extends Component {
  static contextType = APIContext;

  render() {
    let notes = [];

    if (this.props.folderId) {
      notes = this.context.notes.filter(note => note.folderId === this.props.folderId)
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