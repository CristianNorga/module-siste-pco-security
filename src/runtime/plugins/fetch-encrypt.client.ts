import CryptoJS from 'crypto-js'
import { defineNuxtPlugin } from '#imports'

function encryptData(data: unknown, SECRET_KEY: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

function decryptData(encryptedText: string, SECRET_KEY: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export default defineNuxtPlugin(() => {
  const originalFetch = window.fetch

  // llamar endpoint 'api/auth/getKeyShared' para obtener la clave compartida
  const securityKeyShared = '123'

  window.fetch = async (input, init = {}) => {
    if (init.body && typeof init.body === 'object') {
      init.body = JSON.stringify({ encrypted: encryptData(init.body, securityKeyShared) })
      init.headers = { ...init.headers, 'Content-Type': 'application/json' }
    }
    const response = await originalFetch(input, init)

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      if (data.encrypted) {
        return decryptData(data.encrypted, securityKeyShared)
      }
    }
    return response
  }
})
