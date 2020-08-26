import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import APIContext from '../APIContext';
import PropTypes from 'prop-types';
import config from '../config';

class EditNote extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: props.note.name,
        touched: false,
      },
      content: {
        value: props.note.content,
        touched: false,
      },
      folderId: props.note.folder_id,
      error: null,
      submitted: false,
    }
  }

  static contextType = APIContext;

  updateName = (name) => {
    this.setState({name: { value: name, touched: true }});
  }

  updateFolderId = (folderId) => {
    this.setState({folderId: folderId});
  }

  updateContent = (content) => {
    this.setState({content: { value: content, touched: true }});
  }

  validateName = () => {
    if (this.state.name.value.length === 0) {
      return 'Name is required'
    }
  }

  validateContent = () => {
    if (this.state.content.value.length === 0) {
      return 'Content is required'
    }
  }

  handleUpdateNote = (event) => {
    event.preventDefault();

    if (!this.state.name.value || !this.state.content.value) {
      return;
    }
    
    this.setState({ error: null });

    const newNote = {
      name: this.state.name.value,
      content: this.state.content.value,
      folder_id: this.state.folderId,
      modified_date: new Date(),
    };

    fetch(`${config.API_BASE_URL}/notes/${this.props.note.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
    .then(data => {
      this.setState({submitted: true});
      this.context.updateNote(this.props.note.id, newNote);
    }) 
    .catch(error => {
      this.setState({ error })
    })
}

  render() {
    if (this.state.submitted) {
      return <Redirect to="/" />;
    }

    return (
      <form className='add-note-form' onSubmit={event => this.handleUpdateNote(event)}>
        <div>
          <div className="error-label">
            {this.state.error}
          </div>

          <div>
            <label htmlFor='folder'>Folder: </label>
          </div>

          <select
            name='folder'
            className='add-note-form__folder-dropdown'
            value={this.state.folderId}
            onChange={(event) => this.updateFolderId(event.target.value)}
          >
            <option value=''>Select Folder</option>
            {this.context.folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>

          <div>
            <label htmlFor='name'>
              Note name*: 
              <span className="error-label">
                {this.state.name.touched && this.validateName()}
              </span>
            </label>
          </div>
          
          <input 
            type='text'
            className='add-note-form__note-name'
            name='note'
            id='name'
            onChange={event => this.updateName(event.target.value)} 
            value={this.state.name.value}
          />

          <div>
            <label htmlFor='content'>Content*: 
              <span className="error-label">
                {this.state.content.touched && this.validateContent()}
              </span>
            </label>
          </div>
          
          <textarea
            type='text'
            className='add-note-form__content'
            name='content'
            id='content'
            onChange={event => this.updateContent(event.target.value)} 
            value={this.state.content.value}
          />
        </div>

        <div className='add-note-form__button-group'>
          <button 
            type='submit'
            className='add-note-form__button'
          >
            Save Note
          </button>
        </div> 
      </form>
    )
  }
}

EditNote.propTypes = {
  note: PropTypes.object,
}

EditNote.defaultProps = {
  note: {},
};

export default EditNote;