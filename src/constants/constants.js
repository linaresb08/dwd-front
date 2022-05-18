// * Email Regex
// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// * API global url
const globalUrl = 'http://localhost:3900/api/'

// * Working hours
const workingHours = ['9hrs', '10hrs', '11hrs', '12hrs', '13hrs', '14hrs', '15hrs', '16hrs', '17hrs']


export {
  emailRegex,
  globalUrl,
  workingHours
}