// Academic Period
export const API_ACADEMIC_PERIOD = "/api/academic-period/";
export const API_ACADEMIC_PERIOD_BY_ID = (id) => `/api/academic-period/${id}`;

// Class
export const API_CLASS = "/api/class/";
export const API_CLASS_BY_ID = (id) => `/api/class/${id}`;
export const API_CLASS_BY_SUB_SUBJECT = (subSubjectId) => `/api/class/by-subSubject-id/${subSubjectId}`;

// Class Lecturer
export const API_CLASS_LECTURER = "/api/class-lecturer/";
export const API_CLASS_LECTURER_BY_ID = (id) => `/api/class-lecturer/${id}`;
export const API_CLASS_LECTURER_BY_CLASS = (classId) => `/api/class-lecturer/by-class-id/${classId}`;
export const API_CLASS_LECTURER_BY_LECTURER = (lecturerId) => `/api/class-lecturer/by-lecturer-id/${lecturerId}`;

// Department
export const API_DEPARTMENT = "/api/department/";
export const API_DEPARTMENT_BY_ID = (id) => `/api/department/${id}`;
export const API_DEPARTMENT_BY_FACULTY = (facultyId) => `/api/department/by-faculty-id/${facultyId}`;

// Faculty
export const API_FACULTY = "/api/faculty/";
export const API_FACULTY_BY_ID = (id) => `/api/faculty/${id}`;

// Lecturer
export const API_LECTURER = "/api/lecturer/";
export const API_LECTURER_BY_ID = (id) => `/api/lecturer/${id}`;
export const API_LECTURER_BY_DEPARTMENT = (departmentId) => `/api/lecturer/by-department-id/${departmentId}`;

// Room
export const API_ROOM = "/api/room/";
export const API_ROOM_BY_ID = (id) => `/api/room/${id}`;
export const API_ROOM_BY_DEPARTMENT = (departmentId) => `/api/room/by-department-id/${departmentId}`;
export const API_ROOM_BY_SUBJECT_TYPE = (subjectTypeId) => `/api/room/by-subjectType-id/${subjectTypeId}`;

// Schedule
export const API_SCHEDULE = "/api/schedule/";
export const API_SCHEDULE_BY_ID = (id) => `/api/schedule/${id}`;
export const API_SCHEDULE_BY_CLASS_LECTURER = (classLecturerId) => `/api/schedule/by-classLecturer-id/${classLecturerId}`;
export const API_SCHEDULE_BY_SCHEDULE_DAY = (dayId) => `/api/schedule/by-scheduleDay-id/${dayId}`;
export const API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT = (dayId, departmentId) => `/api/schedule/by-day-by-department?dayId=${dayId}&departmentId=${departmentId}`;
export const API_SCHEDULE_BY_SCHEDULE_SESSION = (scheduleSessionId) => `/api/schedule/by-scheduleSession-id/${scheduleSessionId}`;

// Schedule Day
export const API_SCHEDULE_DAY = "/api/schedule-day/";
export const API_SCHEDULE_DAY_BY_ID = (id) => `/api/schedule-day/${id}`;

// Schedule Room
// export const API_SCHEDULE_ROOM = "/api/schedule-room/";
// export const API_SCHEDULE_ROOM_BY_ID = (id) => `/api/schedule-room/${id}`;
// export const API_SCHEDULE_ROOM_BY_ROOM = (roomId) => `/api/schedule-room/by-room-id/${roomId}`;
// export const API_SCHEDULE_ROOM_BY_SCHEDULE = (scheduleId) => `/api/schedule-room/by-schedule-id/${scheduleId}`;

// Schedule Session
export const API_SCHEDULE_SESSION = "/api/schedule-session/";
export const API_SCHEDULE_SESSION_BY_ID = (id) => `/api/schedule-session/${id}`;

// Study Program
export const API_STUDY_PROGRAM = "/api/study-program/";
export const API_STUDY_PROGRAM_BY_ID = (id) => `/api/study-program/${id}`;
export const API_STUDY_PROGRAM_BY_DEPARTMENT = (departmentId) => `/api/study-program/by-department-id/${departmentId}`;

// Sub Subject
export const API_SUB_SUBJECT = "/api/sub-subject/";
export const API_SUB_SUBJECT_BY_ID = (id) => `/api/sub-subject/${id}`;
export const API_SUB_SUBJECT_BY_SUBJECT = (subjectId) => `/api/sub-subject/by-subject-id/${subjectId}`;
export const API_SUB_SUBJECT_BY_SUBJECT_TYPE = (subjectTypeId) => `/api/sub-subject/by-subjectType-id/${subjectTypeId}`;

// Subject
export const API_SUBJECT = "/api/subject/";
export const API_SUBJECT_BY_ID = (id) => `/api/subject/${id}`;
export const API_SUBJECT_BY_ACADEMIC_PERIOD = (academicPeriodId) => `/api/subject/by-academicPeriod-id/${academicPeriodId}`;
export const API_SUBJECT_BY_STUDY_PROGRAM = (studyProgramId) => `/api/subject/by-studyProgram-id/${studyProgramId}`;

// Subject Type
export const API_SUBJECT_TYPE = "/api/subject-type/";
export const API_SUBJECT_TYPE_BY_ID = (id) => `/api/subject-type/${id}`;
