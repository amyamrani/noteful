import React, { Component } from 'react';
import Note from '../Note/Note';

class NotesList extends Component {
  render() {
    return (
      <div className='note-list'>
        {this.props.notes.map(note => (
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

