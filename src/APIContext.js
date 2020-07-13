import React from 'react'

const APIContext = React.createContext({
  notes: [],
  folders: [],
  addNewFolder: () => {},
  addNewNote: () => {},
  deleteNote: () => {},
})

export default APIContext;