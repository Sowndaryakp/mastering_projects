// Utility functions for role management

export const roles = [
  'student',
  'class_teacher', // Use class_teacher instead of teacher
  'hod',
  'principal',
  'admin',
];

export function isValidRole(role) {
  return roles.includes(role);
} 