import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import store from '../store';
import Sidebar from '../Sidebar/Sidebar';
import FolderList from '../FolderList/FolderList';
import Note from '../Note/Note';
import NotesList from '../NotesList/NotesList';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: store,
    }
  }

  render() {
    return (
      <div className='App'>
        <header className='app-header'>
          <h1><Link to='/' className='app-header__link'>Noteful</Link></h1>
        </header>

        <div className="app-grid">
          <Sidebar>
            <Route
              exact path='/'
              render={() => (
                <FolderList folders={this.state.store.folders} />
              )}
            />
            <Route
              path='/folder/:folderId'
              render={() => (
                <FolderList folders={this.state.store.folders} />
              )}
            />
            <Route
              path='/note/:noteId'
              render={(routerProps) => {
                const noteId = routerProps.match.params.noteId;
                const note = this.state.store.notes.find(note => note.id === noteId)
                const folder = this.state.store.folders.find(folder => folder.id === note.folderId)
                
                return (
                  <div>
                    <button onClick={routerProps.history.goBack} className='back-button'>Go back</button>
                    <div className='note-folder-name'>{folder.name}</div>
                  </div>
                )
              }}
            />          
          </Sidebar>

          <main className="app-grid__content">
            <Route
              exact path='/'
              render={() => (
                <NotesList notes={this.state.store.notes} />
              )}
            />
            <Route
              path='/folder/:folderId'
              render={(routerProps) => {
                const filteredNotes = this.state.store.notes.filter(note => note.folderId === routerProps.match.params.folderId)

                return <NotesList notes={filteredNotes} />
              }}
              
            />
            <Route
              path='/note/:noteId'
              render={(routerProps) => {
                const noteId = routerProps.match.params.noteId;
                const note = this.state.store.notes.find(note => note.id === noteId)
                return (
                  <div>
                    <Note note={note} />
                    <p className='note-content'>{note.content}</p>
                  </div>
                )  
              }}
            />
          </main>
        </div>
      </div>        
    );
  }
}  

export default App;