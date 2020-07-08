import React, { Component } from 'react';
import Note from '../Note/Note';
import APIContext from '../APIContext';

class NotesList extends Component {
  static defaultProps = {
    notes: []
  };

  static contextType = APIContext;

  render() {
    let notes = [];

    if (this.props.folderId) {
      notes = this.context.notes.filter(note => note.folderId === this.props.folderId)
    } else {
      notes = this.context.notes;
    }
    
    return (
      <div className='note-list'>
        {notes.map(note => (
          <Note 
            key={note.id}
            note={note} 
          />
        ))}
      </div>  
    )
  }
}

export default NotesList;

