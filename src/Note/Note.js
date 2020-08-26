import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import config from '../config';
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
  fetch(`${config.API_BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
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
                Date modified on {this.formatDate(this.props.note.modified_date)}
              </div> 
              

              <div>
                <Link to={`/note/${this.props.note.id}/edit`} className='note__edit'>Edit Note</Link>

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
          </div>
        )}     
      </APIContext.Consumer>  
    )
  }
} 

Note.propTypes = {
  note: PropTypes.object.isRequired,
};

export default Note;

