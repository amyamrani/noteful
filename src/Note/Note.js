import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Note.css';

function getNumberWithOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
      v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class Note extends Component {  
  formatDate(modified) {
    const date = new Date(modified);
    return `${getNumberWithOrdinal(date.getDate())} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } 
  
  render() {
    return (
      <div className='note'>
        <Link className='note__name' to={`/note/${this.props.note.id}`}>{this.props.note.name}</Link>
        <div className='note__date'>
          Date modified on {this.formatDate(this.props.note.modified)}
        </div> 
      </div>
    )
  }
} 

export default Note;

