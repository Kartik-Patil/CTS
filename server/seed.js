const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Attendance = require('./models/Attendance');
const Marks = require('./models/Marks');
const Notification = require('./models/Notification');
const Examination = require('./models/Examination');
const Hostel = require('./models/Hostel');
const Placement = require('./models/Placement');

const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Student.deleteMany({});
  await Faculty.deleteMany({});
  await Attendance.deleteMany({});
  await Marks.deleteMany({});
  await Notification.deleteMany({});
  await Examination.deleteMany({});
  await Hostel.deleteMany({});
  await Placement.deleteMany({});

  // ── Admin ───────────────────────────────────────────────────────────────────
  await User.create({ username: 'ADMIN001', password: 'Admin@1234', role: 'admin', isFirstLogin: false });

  // ── Faculty ──────────────────────────────────────────────────────────────────
  const facultyUser = await User.create({
    username: 'FAC001',
    password: 'Faculty@1234',
    role: 'faculty',
    email: 'dr.priya@college.edu',
    mobile: '9876543210',
    isFirstLogin: false,
  });

  const faculty = await Faculty.create({
    user: facultyUser._id,
    employeeId: 'FAC001',
    name: 'Dr. Priya Sharma',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    email: 'dr.priya@college.edu',
    mobile: '9876543210',
    subjects: ['CS301', 'CS302', 'CS303'],
  });

  // ── Student 1 ────────────────────────────────────────────────────────────────
  const student1User = await User.create({
    username: '01FE22BCS001',
    password: '15082004', // DOB: 15-08-2004
    role: 'student',
    email: 'rajan.kumar.parent@gmail.com',
    mobile: '9876543211',
    isFirstLogin: false,
  });

  const student1 = await Student.create({
    user: student1User._id,
    rollNumber: '01FE22BCS001',
    name: 'Rajan Kumar',
    dateOfBirth: new Date('2004-08-15'),
    branch: 'B.E. Computer Science',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    academicYear: '2024-25',
    admissionYear: 2022,
    batch: '2022-2026',
    hostelResident: true,
    cgpa: 8.2,
    currentSgpa: 8.5,
    backlogs: 0,
    parent: {
      fatherName: 'Suresh Kumar',
      motherName: 'Meena Kumar',
      mobile: '9876543211',
      alternateMobile: '9876543212',
      email: 'rajan.kumar.parent@gmail.com',
      address: '123, MG Road, Bangalore - 560001',
      occupation: 'Business',
    },
    mentor: faculty._id,
  });

  // ── Student 2 ────────────────────────────────────────────────────────────────
  const student2User = await User.create({
    username: '01FE22BCS045',
    password: '02012005', // DOB: 02-01-2005
    role: 'student',
    email: 'ananya.parent@gmail.com',
    mobile: '9876543220',
    isFirstLogin: false,
  });

  const student2 = await Student.create({
    user: student2User._id,
    rollNumber: '01FE22BCS045',
    name: 'Ananya Reddy',
    dateOfBirth: new Date('2005-01-02'),
    branch: 'B.E. Computer Science',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'B',
    academicYear: '2024-25',
    admissionYear: 2022,
    batch: '2022-2026',
    hostelResident: false,
    cgpa: 9.1,
    currentSgpa: 9.3,
    backlogs: 0,
    parent: {
      fatherName: 'Venkat Reddy',
      motherName: 'Laxmi Reddy',
      mobile: '9876543220',
      email: 'ananya.parent@gmail.com',
      address: '45, Indiranagar, Bangalore - 560038',
      occupation: 'Software Engineer',
    },
    mentor: faculty._id,
  });

  // ── Attendance for Student 1 ─────────────────────────────────────────────────
  await Attendance.create({
    student: student1._id,
    semester: 5,
    academicYear: '2024-25',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', totalClasses: 52, attendedClasses: 48, percentage: 92 },
      { subjectCode: 'CS302', subjectName: 'Operating Systems', totalClasses: 48, attendedClasses: 36, percentage: 75 },
      { subjectCode: 'CS303', subjectName: 'Database Management Systems', totalClasses: 50, attendedClasses: 32, percentage: 64 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', totalClasses: 46, attendedClasses: 42, percentage: 91 },
      { subjectCode: 'CS305L', subjectName: 'DBMS Lab', totalClasses: 24, attendedClasses: 22, percentage: 92 },
    ],
    overallPercentage: 83,
  });

  // ── Marks for Student 1 ────────────────────────────────────────────────────
  await Marks.create({
    student: student1._id,
    semester: 5,
    academicYear: '2024-25',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', credits: 4, ia1: 28, ia2: 26, ia3: 29, totalInternal: 30, grade: 'A+', gradePoints: 10, result: 'pass' },
      { subjectCode: 'CS302', subjectName: 'Operating Systems', credits: 4, ia1: 22, ia2: 20, ia3: 24, totalInternal: 25, grade: 'B+', gradePoints: 8, result: 'pass' },
      { subjectCode: 'CS303', subjectName: 'Database Management Systems', credits: 4, ia1: 18, ia2: 17, ia3: 20, totalInternal: 22, grade: 'B', gradePoints: 7, result: 'pass' },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, ia1: 27, ia2: 25, ia3: 28, totalInternal: 28, grade: 'A', gradePoints: 9, result: 'pass' },
      { subjectCode: 'CS305L', subjectName: 'DBMS Lab', credits: 2, labMarks: 38, grade: 'A+', gradePoints: 10, result: 'pass' },
    ],
    sgpa: 8.5,
    cgpa: 8.2,
    totalCredits: 17,
    earnedCredits: 17,
    backlogs: 0,
    resultPublished: true,
  });

  // ── Attendance history for CGPA chart (sems 3 & 4) ──────────────────────────
  await Attendance.create({ student: student1._id, semester: 3, academicYear: '2023-24', subjects: [
    { subjectCode: 'CS201', subjectName: 'Data Structures', totalClasses: 50, attendedClasses: 44, percentage: 88 },
    { subjectCode: 'CS202', subjectName: 'Digital Electronics', totalClasses: 46, attendedClasses: 38, percentage: 83 },
    { subjectCode: 'CS203', subjectName: 'Engineering Mathematics', totalClasses: 52, attendedClasses: 45, percentage: 87 },
  ], overallPercentage: 86 });
  await Attendance.create({ student: student1._id, semester: 4, academicYear: '2023-24', subjects: [
    { subjectCode: 'CS205', subjectName: 'Object Oriented Programming', totalClasses: 50, attendedClasses: 47, percentage: 94 },
    { subjectCode: 'CS206', subjectName: 'Design & Analysis of Algorithms', totalClasses: 48, attendedClasses: 40, percentage: 83 },
    { subjectCode: 'CS207', subjectName: 'Microprocessors', totalClasses: 44, attendedClasses: 37, percentage: 84 },
  ], overallPercentage: 87 });

  await Marks.create({ student: student1._id, semester: 3, academicYear: '2023-24', subjects: [], sgpa: 7.9, cgpa: 7.8, totalCredits: 20, earnedCredits: 20, resultPublished: true });
  await Marks.create({ student: student1._id, semester: 4, academicYear: '2023-24', subjects: [], sgpa: 8.1, cgpa: 8.0, totalCredits: 20, earnedCredits: 20, resultPublished: true });

  // ── Notifications ──────────────────────────────────────────────────────────
  const adminUser = await User.findOne({ role: 'admin' });
  await Notification.create([
    {
      title: 'Semester Examinations — Time Table Released',
      body: 'The timetable for 5th Semester examinations has been released. Students are advised to check the examination portal.',
      type: 'announcement',
      priority: 'high',
      targetAudience: 'all',
      createdBy: adminUser._id,
    },
    {
      title: 'Parent-Teacher Meeting — 28th June 2026',
      body: 'A PTM is scheduled for Saturday, 28th June 2026 at 10:00 AM in the Main Auditorium. All parents are requested to attend.',
      type: 'ptm',
      priority: 'high',
      targetAudience: 'all',
      createdBy: adminUser._id,
    },
    {
      title: 'Attendance Shortage Warning',
      body: 'Students in CSE 5th Semester with attendance below 75% in DBMS are required to meet their mentor immediately.',
      type: 'department',
      priority: 'urgent',
      targetAudience: 'department',
      department: 'Computer Science & Engineering',
      createdBy: adminUser._id,
    },
    {
      title: 'College Holiday — Eid Al-Adha',
      body: 'The college will remain closed on 7th July 2026 on account of Eid Al-Adha.',
      type: 'circular',
      priority: 'normal',
      targetAudience: 'all',
      createdBy: adminUser._id,
    },
    {
      title: 'TCS Campus Drive — Registrations Open',
      body: 'TCS is conducting a campus drive for 2026 batch. Eligible students (CGPA >= 7.0, no active backlogs) can register through the Placement Portal.',
      type: 'announcement',
      priority: 'high',
      targetAudience: 'all',
      createdBy: adminUser._id,
    },
  ]);

  // ── Examination Data ───────────────────────────────────────────────────────
  await Examination.create({
    student: student1._id,
    semester: 5,
    academicYear: '2024-25',
    examType: 'semester',
    hallTicketIssued: true,
    timetable: [
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', date: new Date('2026-07-05'), time: '10:00 AM', venue: 'Block A — Hall 1', duration: '3 Hours' },
      { subjectCode: 'CS302', subjectName: 'Operating Systems',            date: new Date('2026-07-08'), time: '10:00 AM', venue: 'Block A — Hall 1', duration: '3 Hours' },
      { subjectCode: 'CS303', subjectName: 'Database Management Systems',  date: new Date('2026-07-10'), time: '10:00 AM', venue: 'Block B — Hall 2', duration: '3 Hours' },
      { subjectCode: 'CS304', subjectName: 'Computer Networks',            date: new Date('2026-07-12'), time: '10:00 AM', venue: 'Block B — Hall 2', duration: '3 Hours' },
    ],
    revaluation: [
      { subjectCode: 'CS303', applicationDate: new Date('2026-02-10'), status: 'completed', originalMarks: 58, revisedMarks: 62 },
    ],
  });

  await Examination.create({
    student: student1._id,
    semester: 5,
    academicYear: '2024-25',
    examType: 'internal',
    hallTicketIssued: true,
    timetable: [
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', date: new Date('2026-04-10'), time: '11:00 AM', venue: 'Department Lab', duration: '1.5 Hours' },
      { subjectCode: 'CS302', subjectName: 'Operating Systems',            date: new Date('2026-04-12'), time: '11:00 AM', venue: 'Department Lab', duration: '1.5 Hours' },
      { subjectCode: 'CS303', subjectName: 'Database Management Systems',  date: new Date('2026-04-14'), time: '11:00 AM', venue: 'Department Lab', duration: '1.5 Hours' },
    ],
  });

  await Examination.create({
    student: student1._id,
    semester: 5,
    academicYear: '2024-25',
    examType: 'practical',
    hallTicketIssued: true,
    timetable: [
      { subjectCode: 'CS305L', subjectName: 'DBMS Lab', date: new Date('2026-07-15'), time: '09:00 AM', venue: 'Computer Lab 3', duration: '3 Hours' },
    ],
  });

  // ── Hostel Data ────────────────────────────────────────────────────────────
  await Hostel.create({
    student: student1._id,
    hostelName: 'Visvesvaraya Boys Hostel',
    blockName: 'Block C',
    roomNumber: 'C-214',
    bedNumber: 'Bed 2',
    messPlan: 'veg',
    wardenName: 'Mr. Ravi Shankar',
    wardenMobile: '9988776655',
    allottedFrom: new Date('2022-08-01'),
    allottedTo: new Date('2026-05-31'),
    isActive: true,
  });

  // ── Placement Data ─────────────────────────────────────────────────────────
  await Placement.create([
    {
      student: student1._id,
      company: 'Tata Consultancy Services',
      role: 'Systems Engineer',
      type: 'placement',
      package: '7.0 LPA',
      applicationStatus: 'selected',
      interviewDate: new Date('2026-03-15'),
      interviewVenue: 'TCS Campus, Whitefield, Bangalore',
      interviewRound: 'Final HR Round',
      joiningDate: new Date('2026-07-01'),
      notes: 'Selected after 3 rounds — Aptitude, Technical, HR',
    },
    {
      student: student1._id,
      company: 'Infosys',
      role: 'Software Engineer Trainee',
      type: 'placement',
      package: '6.5 LPA',
      applicationStatus: 'rejected',
      interviewDate: new Date('2026-02-10'),
      interviewVenue: 'Infosys Campus, Electronic City',
      interviewRound: 'Technical Round 2',
      notes: 'Rejected at Technical Round 2',
    },
    {
      student: student1._id,
      company: 'Amazon',
      role: 'SDE Intern',
      type: 'internship',
      package: '₹60,000/month',
      applicationStatus: 'interview_scheduled',
      interviewDate: new Date('2026-07-20'),
      interviewVenue: 'Online — Zoom',
      interviewRound: 'Round 1 — Data Structures & Algorithms',
      notes: 'Interview scheduled — prepare DSA thoroughly',
    },
    {
      student: student1._id,
      company: 'Microsoft',
      role: 'Software Engineer',
      type: 'placement',
      package: '21.0 LPA',
      applicationStatus: 'shortlisted',
      notes: 'Shortlisted for aptitude test on 5th August',
    },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('  Admin:      ADMIN001 / Admin@1234');
  console.log('  Faculty:    FAC001 / Faculty@1234');
  console.log('  Student 1:  01FE22BCS001 / 15082004  (first login — must change password)');
  console.log('  Student 2:  01FE22BCS045 / 02012005  (first login — must change password)');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
