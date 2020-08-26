import React, { Component } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import AddFolder from '../AddFolder/AddFolder';
import EditFolder from '../EditFolder/EditFolder';
import AddNote from '../AddNote/AddNote';
import EditNote from '../EditNote/EditNote';
import APIContext from '../APIContext';
import AppError from '../AppError';
import config from '../config';
import FolderList from '../FolderList/FolderList';
import Note from '../Note/Note';
import NotesList from '../NotesList/NotesList';
import Sidebar from '../Sidebar/Sidebar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      folders: [],
    }
  }

  deleteNote = noteId => {
    const newNotes = this.state.notes.filter(note =>
      note.id !== Number(noteId)
    )
    this.setState({
      notes: newNotes
    })
  }
  
  deleteFolder = folderId => {
    const newFolders = this.state.folders.filter(folder =>
      folder.id !== Number(folderId)
    )
    this.setState({
      folders: newFolders
    })
  }

  updateFolder = updatedFolder => {
    const newFolders = this.state.folders.map(folder => {
      if (folder.id === Number(updatedFolder.id)) {
        return { ...folder, name: updatedFolder.name };
      } else {
        return folder;
      }
    });

    this.setState({
      folders: newFolders
    })
  }

  addNewFolder = newFolder => {
    const newFolders = [...this.state.folders, newFolder];
    this.setState({
      folders: newFolders
    })
  }

  addNewNote = newNote => {
    const newNotes = [...this.state.notes, newNote];
    this.setState({
      notes: newNotes,
      newNote: {
        hasError: false,
        touched: true,
      }
    });
  }

  updateNote = (id, updatedNote) => {
    const newNotes = this.state.notes.map(note => {
      if (note.id === Number(id)) {
        return { ...note, ...updatedNote };
      } else {
        return note;
      }
    });

    this.setState({
      notes: newNotes
    })
  }

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_BASE_URL}/notes`),
      fetch(`${config.API_BASE_URL}/folders`)
    ])

      .then(([resNotes, resFolders]) => {
        if (!resNotes.ok) {
          throw new Error(resNotes.status)
        }
        if (!resFolders.ok) {
          throw new Error(resFolders.status)
        }
        return Promise.all([resNotes.json(), resFolders.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders });
      })
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.deleteNote,
      deleteFolder: this.deleteFolder,
      updateFolder: this.updateFolder,
      addNewFolder: this.addNewFolder,
      addNewNote: this.addNewNote,
      updateNote: this.updateNote,
    }

    return (
      <APIContext.Provider value={contextValue}>
        <AppError>
          <div className='App'>
            <header className='app-header'>
              <h1><Link to='/' className='app-header__link'>Noteful</Link></h1>
            </header>

            <div className="app-grid">
              <Sidebar>
                <Switch>
                  <Route
                    exact path='/'
                    component={FolderList}
                  />
                  <Route
                    path='/folder/:folderId'
                    component={FolderList}
                  />

                  <Route
                    path='/note/new'
                    component={FolderList}
                  />

                  <Route
                    path='/note/:noteId'
                    render={(routerProps) => {
                      const noteId = routerProps.match.params.noteId;
                      const note = contextValue.notes.find(note => note.id === Number(noteId))

                      if (!note) {
                        return <Redirect to="/" />
                      }

                      const folder = contextValue.folders.find(folder => folder.id === Number(note.folder_id))

                      return (
                        note && (
                          <div>
                            <button onClick={routerProps.history.goBack} className='back-button'>Go back</button>
                            <div className='note-folder-name'>{folder.name}</div>
                          </div>
                        )
                      )
                    }}
                  />
                </Switch>
              </Sidebar>

              <main className="app-grid__content">
                <Switch>
                  <Route
                    exact
                    path='/'
                    component={NotesList}
                  />
                  <Route
                    path='/folder/new'
                    component={AddFolder}
                  />
                  <Route
                    exact
                    path='/folder/:folderId'
                    render={(routerProps) => {
                      return <NotesList folderId={routerProps.match.params.folderId} />
                    }}
                  />
                  <Route
                    exact
                    path='/folder/:folderId/edit'
                    render={(routerProps) => {
                      const folderId = routerProps.match.params.folderId;
                      const folder = contextValue.folders.find(folder => folder.id === Number(folderId));

                      return <EditFolder folder={folder} />
                    }}
                  />
                  <Route
                    exact
                    path='/note/new'
                    component={AddNote}
                  />
                  <Route
                    exact
                    path='/note/:noteId/edit'
                    render={(routerProps) => {
                      const noteId = routerProps.match.params.noteId;
                      const note = contextValue.notes.find(note => note.id === Number(noteId));

                      return <EditNote note={note} />
                    }}
                  />
                  <Route
                    path='/note/:noteId'
                    render={(routerProps) => {
                      const noteId = routerProps.match.params.noteId;
                      const note = contextValue.notes.find(note => note.id === Number(noteId));

                      return (
                        note && (
                          <div>
                            <Note note={note} />
                            <p className='note-content'>{note.content}</p>
                          </div>
                        )
                      )
                    }}
                  />
                </Switch>
              </main>
            </div>
          </div>
        </AppError>
      </APIContext.Provider>
    );
  }
}

export default App;