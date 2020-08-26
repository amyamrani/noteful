import React, { Component } from 'react';
import PropTypes from 'prop-types';
import APIContext from '../APIContext';
import './EditFolder.css';
import { Redirect } from 'react-router-dom';
import config from '../config';

class EditFolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folderName: props.folder.name,
      error: null,
      submitted: false,
    }
  }

  static contextType = APIContext;

  updateFolder = (folderName) => {
    this.setState({folderName: folderName});
  }

  handleUpdateFolder = (event) => {
    event.preventDefault();
    
    this.setState({ error: null })

    fetch(`${config.API_BASE_URL}/folders/${this.props.folder.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.folderName,
      })
    })
    .then(() => {
      this.setState({submitted: true});
      this.context.updateFolder({id: this.props.folder.id, name: this.state.folderName});
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
      <form className='add-folder-form' onSubmit={event => this.handleUpdateFolder(event)}>
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
            Save Folder
          </button>
        </div> 
      </form>
    )
  }
}

EditFolder.propTypes = {
  folder: PropTypes.object,
}

EditFolder.defaultProps = {
  folder: {},
}

export default EditFolder;