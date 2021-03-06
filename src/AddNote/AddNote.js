import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import APIContext from '../APIContext';
import './AddNote.css';
import routerProps from '../helpers/routerProps';
import config from '../config';

class AddNote extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false,
      },
      content: {
        value: '',
        touched: false,
      },
      folderId: '',
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

  handleNewNote = (event) => {
    event.preventDefault();

    if (!this.state.name.value || !this.state.content.value) {
      return;
    }
    
    this.setState({ error: null });

    fetch(`${config.API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name.value,
        content: this.state.content.value,
        folder_id: this.state.folderId,
        modified_date: new Date(),
      })
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
      this.setState({submitted: true});
      this.context.addNewNote(data);
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
      <form className='add-note-form' onSubmit={event => this.handleNewNote(event)}>
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
            Add Note
          </button>
        </div> 
      </form>
    )
  }
}

AddNote.propTypes = routerProps;

export default AddNote;