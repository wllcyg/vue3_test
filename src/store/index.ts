import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
      city: '',
  }),
  actions: {
    setCity(city: string) {
      this.city = city
    }
  }
})