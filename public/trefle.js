/*
{"expiration":1592202021,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6WzQ4LDQ2LDQ4LDQ2LDQ4LDQ2LDQ4XSwiaXNzdWVyX2lkIjo1MDcxLCJvcmlnaW4iOiJsb2NhbGhvc3QiLCJhdWQiOiJKb2tlbiIsImV4cCI6MTU5MjIwMjAyMSwiaWF0IjoxNTkyMTk0ODIxLCJpc3MiOiJKb2tlbiIsImp0aSI6IjJvYzlwZzhhMXQ4cGVocWhsODAwMDNjaCIsIm5iZiI6MTU5MjE5NDgyMX0.crinkgIvnJR0XEyZpAZVPjJIroUV37-_a4sSmZ8lcpY"}
*/

let localhostJWT = null
const refreshToken = () => fetch('/token')
  .then(response => response.text())
  .then(token => localhostJWT = token)
refreshToken()

const api = (q) => `https://trefle.io/api/plants?token=${localhostJWT}&q=${q}`

export const getPlants = async (q, retry = 3) => fetch(api(q))
  .then(response => response.json())
  .then(data => data.map(plant => plant.common_name || plant.scientific_name))
  .catch(() => retry > 0 ? refreshToken().then(getPlants(q, retry - 1)) : Promise.reject())
