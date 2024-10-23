import getCourses from './src/utils.js'

const cor = getCourses();
const filter = cor.filter((elem) => {
  return elem.coursename.toLocaleLowerCase().includes('rec') &&
  elem.description.toLocaleLowerCase().includes('dele')
});

console.log(filter)