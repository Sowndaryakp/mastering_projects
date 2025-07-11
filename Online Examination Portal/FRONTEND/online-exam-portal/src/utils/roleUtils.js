// Utility functions for role management

export const roles = [
  'student',
  'teacher',
  'hod',
  'principal',
  'admin',
];

export function isValidRole(role) {
  return roles.includes(role);
} 