import yup from 'yup';

export default (app, db) => {

  app.get('/courses', { name: 'courses' }, (req, res) => {
    const { term, description } = req.query;
    db.all(`
      SELECT * FROM courses
      WHERE LOWER(coursename) LIKE LOWER('%${term ?? ''}%')
        AND LOWER(description) LIKE LOWER('%${description ?? ''}%')`, (err, data) => {
      if (err) return res.send('Ошибка сервера');
      const templateDatadata = { term, description, courses: data };

      res.view('courses/index', templateDatadata);
    })
  });

  app.get('/courses/new', { name: 'newCourse' }, (req, res) => {
    res.view('courses/new');
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

      res.view('courses/new', data);
      return;
    }

    const course = { id: null, coursename, description };

    const stmt = db.prepare('INSERT INTO courses(id, coursename, description) VALUES (?, ?, ?)');
    stmt.run([course.id, course.coursename, course.description], function (err) {
      if (err) {
        const templateData = { err, course };
        res.view('courses/new', templateData);
        return
      }
      res.redirect(app.reverse('courses'));
    })
  });
}