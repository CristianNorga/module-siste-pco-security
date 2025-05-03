export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-03-11',
  security: {
    responseEncrypt: {
      enabled: false,
      key: 'lEVlTfTFNy43IUaih3cJqCyKLuJwM1rekj-goDVU_f0',
    },
    authorization: {
      enabled: true,
      type: 'basic',
    },
  },
})
