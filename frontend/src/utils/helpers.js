export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};
