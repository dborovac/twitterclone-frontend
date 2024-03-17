const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
};

const login = (token) => {
    localStorage.setItem('token', token);
};

const logout = () => {
    localStorage.removeItem('token');
};

export { isAuthenticated, login, logout };