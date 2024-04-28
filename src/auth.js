import Vue from 'vue';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && Vue.$jwt.decode(token).exp > Date.now() / 1000;
};

const login = (token) => {
    localStorage.setItem('token', token);
};

const logout = () => {
    localStorage.removeItem('token');
};

export { isAuthenticated, login, logout };