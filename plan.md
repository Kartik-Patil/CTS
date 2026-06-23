# Parent Portal System

## Software Requirements & Feature Documentation

---

# 1. Introduction

## Purpose

The Parent Portal is a centralized web-based platform designed to bridge the communication gap between the institution and parents. It provides real-time access to student attendance, academic performance, examination details, hostel information, placement activities, and institutional communications.

The portal enables parents to actively participate in their child's academic journey while reducing dependency on manual processes and physical notices.

---

# 2. Authentication & Login System

## Purpose

The Authentication Module ensures secure access to the Parent Portal while maintaining simplicity for parents and students.

## Login Credentials

### Username

* Student Roll Number / USN

### Default Password

* Student Date of Birth in DDMMYYYY format

### Example

| Roll Number  | Date of Birth | Password |
| ------------ | ------------- | -------- |
| 01FE22BCS001 | 15-08-2004    | 15082004 |
| 01FE22BCS045 | 02-01-2005    | 02012005 |

## Login Workflow

1. User enters Roll Number / USN.
2. User enters Date of Birth.
3. System validates credentials.
4. User is redirected to Dashboard.

## Security Features

### First Login Password Change

Users must change their password after their first successful login.

### Password Requirements

* Minimum 8 characters
* One uppercase character
* One lowercase character
* One number
* One special character

### Forgot Password

Password reset through:

* Registered Email
* Registered Mobile OTP

### Account Protection

* Maximum 5 failed attempts
* Temporary account lock after multiple failures
* Session timeout after inactivity
* Login activity logging

---

# 3. Parent Dashboard

## Purpose

The Dashboard serves as the central landing page and provides a summarized view of all important student information.

## Features

### Student Information

* Student Name
* Photograph
* Roll Number / USN
* Branch
* Semester
* Section
* Academic Year

### Parent Information

* Parent Name
* Mobile Number
* Email Address

### Mentor Information

* Faculty Mentor Name
* Contact Details

### Quick Statistics

* Attendance Percentage
* Current SGPA
* Current CGPA
* Pending Notifications
* Active Leave Requests

### Quick Navigation

* Attendance
* Academics
* Examination
* Hostel
* Complaints
* Placement

---

# 4. Attendance Management Module

## Purpose

Provides detailed attendance information and enables parents to monitor student participation.

## Features

### Subject-wise Attendance

Displays:

* Subject Code
* Subject Name
* Classes Conducted
* Classes Attended
* Attendance Percentage

### Daily Attendance Records

* Lecture attendance
* Laboratory attendance
* Date-wise records

### Monthly Attendance Analysis

* Attendance trend graphs
* Monthly comparison reports

### Attendance Alerts

Automatic alerts when attendance falls below required limits.

### Attendance Reports

Download attendance reports in PDF format.

## Benefits

* Early intervention
* Better monitoring
* Reduced attendance shortages

---

# 5. Academic Performance Module

## Purpose

Provides complete academic performance tracking.

## Features

### Internal Assessment Marks

* IA-1
* IA-2
* IA-3
* Total Internal Marks

### Assignment Tracking

* Assignment Status
* Submission Dates
* Marks Obtained
* Faculty Remarks

### Laboratory Performance

* Practical Marks
* Experiment Completion Status
* Lab Attendance

### Semester Results

* Subject-wise Grades
* Credits Earned
* Result Status

### SGPA & CGPA Tracking

Visual performance tracking across semesters.

### Backlog Management

* Failed Subjects
* Reattempt Status
* Clearance Status

### Performance Analytics

* Semester Comparison
* Subject Strength Analysis
* Academic Growth Trends

---

# 6. Examination Management Module

## Purpose

Centralized examination information management.

## Features

### Examination Timetable

* Internal Examination Schedule
* Semester Examination Schedule
* Practical Examination Schedule

### Hall Ticket Management

* Hall Ticket Download
* Examination Instructions

### Results Portal

* Internal Results
* Semester Results
* Grade Cards

### Revaluation Tracking

* Revaluation Application Status
* Updated Marks

### Supplementary Examinations

* Registration Status
* Exam Schedule
* Result Publication

---

# 7. Leave & Permission Management

## Purpose

Digital management of leave and permission requests.

## Features

### Leave Application

Students can submit:

* Leave Dates
* Reason
* Supporting Documents

### Approval Workflow

* Faculty Approval
* Department Approval

### Leave History

View all previous leave applications.

### Outpass Requests

Applicable for hostel students.

### Permission Requests

* Late Arrival
* Event Participation
* Academic Activities

---

# 8. Communication Center

## Purpose

Official communication channel between institution and parents.

## Features

### Announcements

Institution-wide updates.

### Department Notices

Department-specific communications.

### Circulars

Official circulars and policy updates.

### Parent-Teacher Meetings

* Meeting Schedules
* Venue Information
* Attendance Tracking

### Mentor Communication

Direct communication with faculty mentors.

### Emergency Alerts

Critical announcements and notifications.

---

# 9. Placement & Internship Tracking

## Purpose

Monitor student career development activities.

## Features

### Placement Opportunities

* Company Name
* Job Role
* Eligibility Criteria

### Internship Opportunities

* Available Internships
* Application Status

### Eligibility Tracking

Displays student eligibility status.

### Interview Scheduling

* Interview Date
* Venue
* Interview Round Details

### Offer Tracking

* Selected Companies
* Offer Status
* Package Details

---

# 10. Hostel Management Module

## Purpose

Provides hostel-related information and support services.

## Features

### Room Allocation

* Hostel Name
* Room Number
* Block Information

### Mess Information

* Meal Timings
* Menu Updates

### Complaint Management

* Maintenance Requests
* Hygiene Issues
* Facility Issues

### Visitor Records

* Visitor Entry
* Exit Information

### Hostel Notifications

* Rules
* Events
* Maintenance Updates

---

# 11. Student Progress Analytics

## Purpose

Provides analytical insights based on student performance data.

## Features

### Attendance Analytics

* Attendance Trends
* Attendance Comparisons

### Academic Analytics

* Performance Progression
* Grade Distribution

### Semester Comparison

Compare academic performance across semesters.

### Interactive Dashboards

* Charts
* Graphs
* Performance Indicators

### Risk Identification System

Flags students based on:

* Low Attendance
* Poor Academic Performance
* Multiple Backlogs
* Missed Assessments

---

# 12. Complaint & Support System

## Purpose

Provides a structured issue resolution platform.

## Features

### Complaint Registration

Categories:

* Academic Issues
* Hostel Issues
* Technical Issues
* Administrative Issues
* Infrastructure Issues

### Ticket Tracking

Status Tracking:

* Submitted
* Under Review
* Assigned
* Resolved
* Closed

### Escalation System

Automatic escalation of unresolved complaints.

### Feedback System

Users can rate issue resolution quality.

---

# 13. Admin Management System

## Purpose

Provides complete control over portal operations.

## Features

### Student Management

* Student Registration
* Profile Updates
* Academic Record Management

### Faculty Management

* Faculty Profiles
* Department Assignment
* Mentor Assignment

### Attendance Management

* Attendance Upload
* Attendance Modification
* Bulk Import

### Marks Management

* Internal Marks Entry
* Result Publication

### Notification Management

* Notice Creation
* Circular Publication
* Announcement Scheduling

### Report Generation

Generate:

* Attendance Reports
* Academic Reports
* Placement Reports
* Hostel Reports

### Analytics Dashboard

Institution-wide insights and statistics.

### User Access Control

Role-Based Access:

#### Administrator

* Full System Access

#### Faculty

* Attendance Management
* Marks Management
* Student Monitoring

#### Parent

* View Student Information
* Track Attendance
* View Results

#### Student

* Submit Requests
* View Records
* Track Activities

---

# 14. Non-Functional Requirements

## Security

* Role-Based Access Control (RBAC)
* Secure Authentication
* Encrypted Password Storage
* Audit Logs
* Session Management

## Performance

* Fast Response Time
* High Availability
* Scalability Support

## Reliability

* Daily Database Backup
* Disaster Recovery
* Fault Tolerance

## Usability

* Responsive Design
* Mobile-Friendly Interface
* Easy Navigation
* Accessibility Compliance

---

# 15. Data Privacy & Compliance

## Legal Framework

The portal operates within the following Indian legal frameworks:

* **Information Technology Act, 2000 (IT Act)** — Governs electronic records, digital signatures, and cybercrimes.
* **IT (Amendment) Act, 2008** — Extends liability for data breaches and unauthorized data access.
* **IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)** — Mandates protection of sensitive personal data.
* **Digital Personal Data Protection Act, 2023 (DPDPA)** — India's primary data protection law governing collection, processing, and storage of personal data.

## Data Classification

### Personal Data Collected

* Student Name, Roll Number / USN, Date of Birth
* Parent Name, Mobile Number, Email Address
* Address and Contact Information
* Photograph

### Sensitive Personal Data (as per SPDI Rules)

* Passwords
* Academic Records and Performance Data
* Health-related information (if any, e.g., medical leave documents)
* Financial information (if fee-related data is included)

## Consent Management

* Explicit written or digital consent must be obtained from parents/guardians at the time of registration.
* Consent must clearly state the purpose of data collection and usage.
* Users have the right to withdraw consent, subject to institutional policies.
* A record of consent and its timestamp must be maintained.

## Data Minimization

* Only data necessary for portal functionality shall be collected.
* No third-party data sharing without explicit consent, except where legally required.
* Data used for analytics must be anonymized or aggregated wherever possible.

## Data Retention Policy

| Data Type | Retention Period |
| --------- | ---------------- |
| Student Academic Records | Duration of enrollment + 7 years |
| Attendance Records | Duration of enrollment + 5 years |
| Login & Session Logs | 1 year |
| Complaint Records | 3 years after closure |
| Placement Records | 5 years post graduation |
| Password Reset Logs | 6 months |

Data beyond retention period must be securely deleted or anonymized.

## Data Security Requirements

* All sensitive data must be encrypted at rest and in transit (TLS 1.2+).
* Passwords must be hashed using a strong algorithm (e.g., bcrypt).
* Access to sensitive data must be restricted via Role-Based Access Control (RBAC).
* Regular security audits and vulnerability assessments must be conducted.
* Multi-factor authentication recommended for Admin accounts.

## User Rights (as per DPDPA 2023)

All users have the following rights:

* **Right to Access** — Users can request a copy of their personal data held by the system.
* **Right to Correction** — Users can request correction of inaccurate or incomplete data.
* **Right to Erasure** — Users can request deletion of data no longer necessary, subject to legal obligations.
* **Right to Grievance Redressal** — Users can raise complaints regarding data handling.

## Data Breach Notification

* Any personal data breach must be identified, contained, and assessed immediately.
* Affected users must be notified within **72 hours** of breach discovery.
* The breach must be reported to the appropriate authority as mandated under DPDPA 2023.
* A post-breach incident report must be maintained.

## Audit & Accountability

* All data access and modification events must be logged with user ID, timestamp, and action.
* Audit logs must be tamper-proof and retained for a minimum of 1 year.
* A designated **Data Protection Officer (DPO)** or responsible authority must be assigned within the institution.
* Annual privacy compliance reviews must be conducted.

## Third-Party Services

* Any third-party service (e.g., cloud hosting, email/SMS providers) must comply with SPDI Rules and DPDPA 2023.
* Data Processing Agreements (DPAs) must be in place with all third-party processors.
* Data must not be transferred outside India unless compliant with cross-border transfer provisions of DPDPA 2023.

---

# 16. Technology Recommendations

## Frontend

* React.js
* Tailwind CSS
* Material UI

## Backend

* Node.js
* Express.js

## Database

* MongoDB

## Authentication

* JWT Authentication
* Bcrypt Password Encryption

## Deployment

* Vercel (Frontend)
* Railway / VPS (Backend)
* MongoDB Atlas

---

# 17. Conclusion

The Parent Portal provides a comprehensive digital ecosystem that enables parents, students, faculty, and administrators to collaborate effectively. Through centralized access to attendance, academics, examinations, hostel services, communication, and support systems, the platform improves transparency, accountability, and overall institutional efficiency.
