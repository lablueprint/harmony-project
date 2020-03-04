/* eslint-disable spaced-comment */

///////////////// ENUMERATED VALUES //////////////////

const roles = {
  parent: 'PARENT',
  student: 'STUDENT',
  teacher: 'TEACHER',
  default: 'STUDENT',
};

const terms = {
  fall: 'FALL',
  spring: 'SPRING',
  summer: 'SUMMER',
  winter: 'WINTER',
  default: 'FALL',

};

//////////////////////////////////////////////////////

//////// INITIAL STATE OF FIRESTORE SCHEMAS /////////

const INITIAL_USER_STATE = {
  address: '',
  associatedId: [],
  classroomIds: [],
  createdAt: '',
  email: '',
  name: '',
  role: roles.default,
  updatedAt: '',
};

const INITIAL_CLASSROOM_STATE = {
  year: '',
  term: terms.default,
  description: '',
  createdAt: '',
};

//////////////////////////////////////////////////////

export { roles, terms };
export { INITIAL_USER_STATE, INITIAL_CLASSROOM_STATE };
