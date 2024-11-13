// src/store/index.js
import { createStore } from 'vuex'
import { authService } from '@/services/api'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      state.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await authService.login(username, password)
        const { token, user } = response.data
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        return response
      } catch (error) {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        throw error
      }
    },
    async getUserInfo({ commit }) {
      try {
        const response = await authService.getUserInfo()
        commit('SET_USER', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    async logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      authService.logout()
    },
  },
})
