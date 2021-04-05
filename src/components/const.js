/* eslint-disable spaced-comment */

///////////////// ENUMERATED VALUES //////////////////

const roles = {
  parent: 'PARENT',
  student: 'STUDENT',
  teacher: 'TEACHER',
  default: 'STUDENT',
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

const instruments = {
  musicianship: 'Musicianship',
  bassoon: 'Bassoon',
  cello: 'Cello',
  clarinet: 'Clarinet',
  bass: 'Bass',
  drumline: 'Drumline',
  drums: 'Drums',
  flute: 'Flute',
  frenchHorn: 'French Horn',
  guitar: 'Guitar',
  production: 'Music Production',
  oboe: 'Oboe',
  percussion: 'Percussion',
  keyboard: 'Piano/Keyboard',
  sax: 'Saxophone',
  trombone: 'Trombone',
  trumpet: 'Trumpet',
  tuba: 'Tuba',
  viola: 'Viola',
  violin: 'Violin',
};

//////////////////////////////////////////////////////

//////// INITIAL STATE OF FIRESTORE SCHEMAS /////////

const INITIAL_USER_STATE = {
  email: '',
  role: roles.default,
  createdAt: '',
  updatedAt: '',
  isVerified: false,
  hpID: '',
  firstName: '',
  lastName: '',
  displayName: '',
  dob: '',
  gradeLevel: 0, // 0 counts as kindergarten
  instruments: [],
};

const INITIAL_CLASSROOM_STATE = {
  teacherIDs: [],
  studentIDs: [],
  name: '',
  type: classTypes.default,
  meetDays: [],
  classLength: 0,
  startDate: '', // 'yyyy-mm-dd'
  endDate: '', // 'yyyy-mm-dd'
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
  roles, classTypes, classDays, instruments,
};
export {
  INITIAL_USER_STATE, INITIAL_CLASSROOM_STATE, INITIAL_MESSAGE_STATE, INITIAL_CHAT_STATE,
};
