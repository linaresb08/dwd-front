// * Email Regex
// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// * API global url
const globalUrl = 'http://localhost:3900/api/'

// * Working hours
const workingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]


export {
  emailRegex,
  globalUrl,
  workingHours
}