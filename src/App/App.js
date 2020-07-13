import React, { Component } from 'react';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import APIContext from '../APIContext';
import Sidebar from '../Sidebar/Sidebar';
import FolderList from '../FolderList/FolderList';
import Note from '../Note/Note';
import NotesList from '../NotesList/NotesList';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import AppError from '../AppError';
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
      note.id !== noteId
    )
    this.setState({
      notes: newNotes
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

  componentDidMount() {
    Promise.all([
      fetch(`http://localhost:9090/notes`),
      fetch(`http://localhost:9090/folders`)
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
        this.setState({notes, folders});
      })
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.deleteNote,
      addNewFolder: this.addNewFolder,
      addNewNote: this.addNewNote,
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
                      const note = contextValue.notes.find(note => note.id === noteId)

                      if (!note) {
                        return <Redirect to="/" />
                      }

                      const folder = contextValue.folders.find(folder => folder.id === note.folderId)
                      
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
                    path='/folder/:folderId'
                    render={(routerProps) => {
                      return <NotesList folderId={routerProps.match.params.folderId} />
                    }}
                  />
                  <Route
                    path='/note/new'
                    component={AddNote}
                  />   
                  <Route
                    path='/note/:noteId'
                    render={(routerProps) => {
                      const noteId = routerProps.match.params.noteId;
                      const note = contextValue.notes.find(note => note.id === noteId)
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