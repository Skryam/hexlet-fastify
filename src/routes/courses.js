import getCourses from '../utils.js';
import yup from 'yup';

export default (app) => {
  const courses = getCourses();

  app.get('/courses', { name: 'courses' }, (req, res) => {
    const { term, description } = req.query;
    let currentCourses = courses;

    if(term || description) {
      currentCourses = courses.filter((elem) => {
        return elem.coursename.toLocaleLowerCase().includes(term.toLocaleLowerCase()) &&
        elem.description.toLocaleLowerCase().includes(description.toLocaleLowerCase())
      })
    }
    const data = { term, description, courses: currentCourses };

    res.view('src/views/courses/index', data);
  });

  app.get('/courses/new', { name: 'newCourse' }, (req, res) => {
    res.view('src/views/courses/new');
  });

  app.post('/courses', {
    attachValidation: true,
    schema: {
      body: yup.object({
        coursename: yup.string().min(2).required(),
        description: yup.string().min(10).required(),
      }),
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
      try {
        const result = schema.validateSync(data);
        return { value: result };
      } catch (e) {
        return { error: e };
      }
    },
  }, (req, res) => {
    const { coursename, description } = req.body;

    if (req.validationError) {
      const data = { coursename, description, error: req.validationError };

      res.view('src/views/courses/new', data);
      return;
    }

    const course = { coursename, description };

    courses.push(course);

    res.redirect('/courses');
  });
}