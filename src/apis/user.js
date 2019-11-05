import axios from 'axios';
import Config from '../config';

export default axios.create({
  // eslint-disable-next-line spaced-comment
  baseURL: Config.server
  //baseURL: 'http://localhost:3001'
});
