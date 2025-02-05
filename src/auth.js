// Hardcoded user credentials
const users = [
  { username: 'admin', password: 'Enrote@1122' },
  { username: 'Staff1', password: 'Enroute@123' },
  { username: 'Staff2', password: 'Enroute@456' },
  { username: 'Staff3', password: 'Enroute@789' },
  { username: 'Staff4', password: 'Enroute@101' }
];

// Authentication functions
export const authenticateUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem('user', JSON.stringify({ username: user.username }));
    return true;
  }
  return false;
};

export const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};