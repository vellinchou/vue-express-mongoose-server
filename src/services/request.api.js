import axios from 'axios'

export default {
  getUsers (params) {
    return axios.get('/api/users', { params: params })
  },

  getGoods (params) {
    return axios.get('/api/goods', { params: params })
  },

  createGood (params) {
    return axios.post('/api/goods/add', params)
  },

  removeGood (id) {
    return axios.delete(`/api/goods/${id}`)
  },

  editGood (id, body) {
    return axios.put(`/api/goods/${id}`, body)
  }
}

