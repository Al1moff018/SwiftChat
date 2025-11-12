import { io } from 'socket.io-client'

let socket = null

export const initSocket = (url = 'http://localhost:5000') => {
  socket = io(url, {
    transports: ['websocket']
  })
  return socket
}

export const getSocket = () => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}