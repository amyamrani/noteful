import React, { Component } from 'react';
import APIContext from '../APIContext';
import './AddFolder.css';

class AddFolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folderName: '',
      error: null,
    }
  }

  static contextType = APIContext;

  updateFolder = (folderName) => {
    this.setState({folderName: folderName});
  }

  handleAddNewFolder = (event) => {
    event.preventDefault();
    
    this.setState({ error: null })

    fetch(`http://localhost:9090/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.folderName,
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
      this.setState({folderName: ''});
      this.context.addNewFolder(data);
    }) 
    .catch(error => {
      this.setState({ error })
    })
}

  render() {
    return (
      <form className='add-folder-form' onSubmit={event => this.handleAddNewFolder(event)}>
        <div>
          <div>
            <label htmlFor='name'>Folder name: </label>
          </div>
          <input 
            type='text' 
            className='add-folder-form__name'
            name='name' 
            id='name' 
            required='required'
            onChange={event => this.updateFolder(event.target.value)} 
            value={this.state.folderName}
          />
        </div>

        <div className='add-folder-form__button-group'>
          <button 
            type='submit' 
            className="add-folder-form__button"
          >
            Add Folder
          </button>
        </div> 
      </form>
    )
  }
}

export default AddFolder;