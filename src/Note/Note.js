import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './Note.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getNumberWithOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
      v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function handleDeleteNote(noteId, callback) {

  fetch(`http://localhost:9090/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
          throw error
        })
      }
      return res.json()
    })
    .then(data => {
      callback(noteId)
    }) 
    .catch(error => {
      console.error(error)
    })
}

class Note extends Component {  
  formatDate(modified) {
    const date = new Date(modified);
    return `${getNumberWithOrdinal(date.getDate())} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } 
  
  render() {
    return (
      <APIContext.Consumer>
        {(context) => (
          <div className='note'>
            <div>
              <Link  
                to={`/note/${this.props.note.id}`}
                className='note__title'
              >
                {this.props.note.name}
              </Link>
            </div>

            <div className='note__flex'>
              <div className='note__date'>
                Date modified on {this.formatDate(this.props.note.modified)}
              </div> 
              
                <button
                  className='note__delete'
                  type='button'
                  onClick={() => {
                    handleDeleteNote(
                      this.props.note.id,
                      context.deleteNote,
                    )
                  }}
                >
                  Delete Note 
                </button>  
              </div>
          </div>
        )}     
      </APIContext.Consumer>  
    )
  }
} 

export default Note;

