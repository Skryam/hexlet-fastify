import getCourses from './src/utils.js'

const cor = getCourses();
const pa = [{one: 1}]
pa.push(...cor)
console.log(pa)