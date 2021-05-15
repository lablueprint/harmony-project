import React from 'react';

const classroomContext = React.createContext({
  classroom: '',
  setClassroom: () => {},
});

export default classroomContext;
