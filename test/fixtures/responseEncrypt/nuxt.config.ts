import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  vite: {
    test: {
      logHeapUsage: true,
    },
  },
})
