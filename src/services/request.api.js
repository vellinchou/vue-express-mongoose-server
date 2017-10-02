import axios from 'axios'

export default {
  getUsers (params) {
    return axios.get('/users', params)
  }
}
