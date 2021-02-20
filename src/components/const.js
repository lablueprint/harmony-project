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
  winter: 'WINTER',
  spring: 'SPRING',
  summer: 'SUMMER',
  default: 'FALL',
};

const classTypes = {
  group: 'group',
  ensemble: 'ensemble',
  musicianship: 'musicianship',
  mentorship: 'mentorship',
  private_lessons: 'private lessons',
  default: 'group',
};

const classDays = {
  monday: 'MONDAY',
  tuesday: 'TUESDAY',
  wednesday: 'WEDNESDAY',
  thursday: 'THURSDAY',
  friday: 'FRIDAY',
  default: 'MONDAY',
};

//////////////////////////////////////////////////////

//////// INITIAL STATE OF FIRESTORE SCHEMAS /////////

const INITIAL_USER_STATE = {
  email: '',
  name: '',
  role: roles.default,
  createdAt: '',
  updatedAt: '',
  address: '',
};

const INITIAL_CLASSROOM_STATE = {
  teacherIDs: [],
  studentIDs: [],
  name: '',
  type: classTypes.default,
  term: [],
  year: 2021,
  meetDays: [],
  classLength: 0,
  startDate: '',
  endDate: '',
  description: '',
  createdAt: '',
};

const INITIAL_MESSAGE_STATE = {
  senderId: '',
  text: '',
  sentAt: '',
};

const INITIAL_CHAT_STATE = {
  users: [],
  names: {},
  createdAt: '',
  updatedAt: '',
};
//////////////////////////////////////////////////////

export {
  roles, terms, classTypes, classDays,
};
export {
  INITIAL_USER_STATE, INITIAL_CLASSROOM_STATE, INITIAL_MESSAGE_STATE, INITIAL_CHAT_STATE,
};
