import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import APIContext from '../APIContext';
import Sidebar from '../Sidebar/Sidebar';
import FolderList from '../FolderList/FolderList';
import Note from '../Note/Note';
import NotesList from '../NotesList/NotesList';
import './App.css';


class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     store: store,
  //   }
  // }
  state = {
    notes: [],
    folders: [],
  }

  deleteNote = noteId => {
    const newNotes = this.state.notes.filter(note => 
      note.id !== noteId
    )
    this.setState({
      notes: newNotes
    })
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
      deleteNote: this.deleteNote
    }

    return (
      <APIContext.Provider value={contextValue}>
        <div className='App'>
          <header className='app-header'>
            <h1><Link to='/' className='app-header__link'>Noteful</Link></h1>
          </header>

          <div className="app-grid">
            <Sidebar>
              <Route
                exact path='/'
                // render={() => (
                //   <FolderList folders={this.state.store.folders} />
                // )}
                component={FolderList}
              />
              <Route
                path='/folder/:folderId'
                // render={() => (
                //   <FolderList folders={this.state.store.folders} />
                // )}
                component={FolderList}
              />
              <Route
                path='/note/:noteId'
                render={(routerProps) => {
                  const noteId = routerProps.match.params.noteId;
                  const note = contextValue.notes.find(note => note.id === noteId)

                  // If we cannot find the note on the note page then we deleted it 
                  // so redirect back to the home page.
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
            </Sidebar>

            <main className="app-grid__content">
              <Route
                exact path='/'
                // render={() => (
                //   <NotesList notes={this.state.store.notes} />
                // )}
                component={NotesList}
              />
              <Route
                path='/folder/:folderId'
                render={(routerProps) => {
                  return <NotesList folderId={routerProps.match.params.folderId} />
                }}
                
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
            </main>
          </div>        
          </div> 
      </APIContext.Provider>
    );
  }
}  

export default App;