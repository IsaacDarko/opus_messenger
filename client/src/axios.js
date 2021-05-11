import axios from 'axios';

const instance = axios.create({
    base: "http://localhost:5000",
});

export default instance