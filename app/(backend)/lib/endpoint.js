// Academic Period
export const API_ACADEMIC_PERIOD = "/api/academic-period/";
export const API_ACADEMIC_PERIOD_BY_ID = (id) => `/api/academic-period/${id}`;
export const API_ACADEMIC_PERIOD_BY_CURRICULUM = (curriculumId) =>
  `/api/academic-period/by-curriculum-id/${curriculumId}`;

// Assistant


// Class
export const API_CLASS = "/api/class/";
export const API_CLASS_BY_ID = (id) => `/api/class/${id}`;
export const API_CLASS_BY_SUB_SUBJECT = (subSubjectId) =>
  `/api/class/by-subSubject-id/${subSubjectId}`;

// Class Lecturer
export const API_CLASS_LECTURER = "/api/class-lecturer/";
export const API_CLASS_LECTURER_BY_ID = (id) => `/api/class-lecturer/${id}`;
export const API_CLASS_LECTURER_BY_CLASS = (classId) =>
  `/api/class-lecturer/by-class-id/${classId}`;
export const API_CLASS_LECTURER_BY_LECTURER = (lecturerId) =>
  `/api/class-lecturer/by-lecturer-id/${lecturerId}`;
export const API_CLASS_LECTURER_BY_DEPARTMENT = (departmentId) =>
  `/api/class-lecturer/by-department-id?departmentId=${departmentId}`;
export const API_CLASS_LECTURER_BY_DEPARTMENT_BY_PERIOD = (
  departmentId,
  periodId
) =>
  `/api/class-lecturer/by-department-by-period?departmentId=${departmentId}&periodId=${periodId}`;
export const API_CLASS_LECTURER_BY_DEPARTMENT_BY_CURRICULUM = (
  departmentId,
  curriculumId,
  isTheory,
  isPracticum
) =>
  `/api/class-lecturer/by-department-by-curriculum?departmentId=${departmentId}&curriculumId=${curriculumId}&isTheory=${isTheory}&isPracticum=${isPracticum}`;

// Department
export const API_DEPARTMENT = "/api/department/";
export const API_DEPARTMENT_BY_ID = (id) => `/api/department/${id}`;
export const API_DEPARTMENT_BY_FACULTY = (facultyId) =>
  `/api/department/by-faculty-id/${facultyId}`;

// Faculty
export const API_FACULTY = "/api/faculty/";
export const API_FACULTY_BY_ID = (id) => `/api/faculty/${id}`;

// Lecturer
export const API_LECTURER = "/api/lecturer/";
export const API_LECTURER_BY_ID = (id) => `/api/lecturer/${id}`;
export const API_LECTURER_BY_DEPARTMENT = (departmentId) =>
  `/api/lecturer/by-department-id/${departmentId}`;

// Room
export const API_ROOM = "/api/room/";
export const API_ROOM_BY_ID = (id) => `/api/room/${id}`;
export const API_ROOM_BY_DEPARTMENT = (departmentId) =>
  `/api/room/by-department-id/${departmentId}`;
export const API_ROOM_BY_SUBJECT_TYPE = (subjectTypeId) =>
  `/api/room/by-subjectType-id/${subjectTypeId}`;

// Schedule
export const API_SCHEDULE = "/api/schedule/";
export const API_SCHEDULE_BY_ID = (id) => `/api/schedule/${id}`;
export const API_SCHEDULE_BY_CLASS_LECTURER = (classLecturerId) =>
  `/api/schedule/by-classLecturer-id/${classLecturerId}`;
export const API_SCHEDULE_BY_SCHEDULE_DAY = (dayId) =>
  `/api/schedule/by-scheduleDay-id/${dayId}`;
export const API_SCHEDULE_BY_SCHEDULE_SESSION = (scheduleSessionId) =>
  `/api/schedule/by-scheduleSession-id/${scheduleSessionId}`;
export const API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT = (
  dayId,
  departmentId
) =>
  `/api/schedule/by-day-by-department?dayId=${dayId}&departmentId=${departmentId}`;
export const API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT_BY_PERIOD = (
  dayId,
  departmentId,
  academicPeriodId,
  semesterTypeId,
) =>
  `/api/schedule/by-day-by-department-by-period?dayId=${dayId}&departmentId=${departmentId}&academicPeriodId=${academicPeriodId}&semesterTypeId=${semesterTypeId}`;
export const API_SCHEDULE_SWAP = (
  departmentId,
  academicPeriodId,
  semesterTypeId,
) =>
  `/api/schedule/swap?departmentId=${departmentId}&academicPeriodId=${academicPeriodId}&semesterTypeId=${semesterTypeId}`;
  export const API_SCHEDULE_SWAPDATA = "/api/schedule/swap/data";


// Schedule Day
export const API_SCHEDULE_DAY = "/api/schedule-day/";
export const API_SCHEDULE_DAY_BY_ID = (id) => `/api/schedule-day/${id}`;

// Schedule Session
export const API_SCHEDULE_SESSION = "/api/schedule-session/";
export const API_SCHEDULE_SESSION_BY_ID = (id) => `/api/schedule-session/${id}`;

// Semester Type
export const API_SEMESTER_TYPE = "/api/semester-type/";
export const API_SEMESTER_TYPE_BY_ID = (id) => `/api/semester-type/${id}`;

// Study Program
export const API_STUDY_PROGRAM = "/api/study-program/";
export const API_STUDY_PROGRAM_BY_ID = (id) => `/api/study-program/${id}`;
export const API_STUDY_PROGRAM_BY_DEPARTMENT = (departmentId) =>
  `/api/study-program/by-department-id/${departmentId}`;

// Sub Subject
export const API_SUB_SUBJECT = "/api/sub-subject/";
export const API_SUB_SUBJECT_BY_ID = (id) => `/api/sub-subject/${id}`;
export const API_SUB_SUBJECT_BY_SUBJECT = (subjectId) =>
  `/api/sub-subject/by-subject-id/${subjectId}`;
export const API_SUB_SUBJECT_BY_SUBJECT_TYPE = (subjectTypeId) =>
  `/api/sub-subject/by-subjectType-id/${subjectTypeId}`;

// Subject
export const API_SUBJECT = "/api/subject/";
export const API_SUBJECT_BY_ID = (id) => `/api/subject/${id}`;
export const API_SUBJECT_BY_ACADEMIC_PERIOD = (academicPeriodId) =>
  `/api/subject/by-academicPeriod-id/${academicPeriodId}`;
export const API_SUBJECT_BY_STUDY_PROGRAM = (studyProgramId) =>
  `/api/subject/by-studyProgram-id/${studyProgramId}`;

// Subject Type
export const API_SUBJECT_TYPE = "/api/subject-type/";
export const API_SUBJECT_TYPE_BY_ID = (id) => `/api/subject-type/${id}`;

// Curriculum
export const API_CURRICULUM = "/api/curriculum/";
export const API_CURRICULUM_BY_ID = (id) => `/api/curriculum/${id}`;

// Auto Generate Service
export const AUTO_GENERATE_SERVICE = (departmentId, curriculumId, semesterTypeId, academicPeriodId) => `${process.env.NEXT_PUBLIC_AUTO_GENERATE_SERVICE_URL}/api/generate-schedule?departmentId=${departmentId}&curriculumId=${curriculumId}&semesterTypeId=${semesterTypeId}&academicPeriodId=${academicPeriodId}`