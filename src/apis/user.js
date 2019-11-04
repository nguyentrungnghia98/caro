import axios from 'axios';

export default axios.create({
  // eslint-disable-next-line spaced-comment
  baseURL: 'https://caro-server.herokuapp.com/'
  //baseURL: 'http://localhost:3001'
});
