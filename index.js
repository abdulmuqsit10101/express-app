const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const { string } = require('joi');
const app = express();


// console.log(`NODE_ENV ${process.env.NODE_ENV}`);
// console.log(`app : ${app.get('env')}`);

// console.log(` >>>>>> `);

// console.log('Application name: ', config.get('name'))
// console.log('Application mail server: ', config.get('mail.host'))

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //:TODO 
app.use(express.static('public'))
app.use(helmet())
app.set('view engine', 'pug');
app.set('views', './views'); 

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    console.log('Morgan Enabled!');
}

app.use(function(req, res, next) { //:TODO
    console.log('Loggin!');
    next();
})

app.use(function(req, res, next) { //:TODO 
    console.log('Authentication!');
    next();
})

const courses = [
    {id: 1, name : 'English'},
    {id: 2, name : 'Computer'},
    {id: 3, name : 'Pak Studies'},
]

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'My Express App', heading: 'I am Ali', description: "I am learning Node Js ;)" })
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The Course with this Id cannot be found!')
    else res.send(course);
 });

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(res.body);
    if(error) return res.status(400).send(error.details[0].message);

    const validateCourseName = courses.find(course => course.name === req.body.name);
    if(validateCourseName) return res.status(404).send('This course already exists!');

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
 });

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Could Not find a course of this Id.');

    const { error } = validateCourse(res.body);
    if(error) res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course)
 });

app.delete('/api/courses/:id', (req, res) => {

    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Could Not find a course of this Id.');

    const Index = courses.indexOf(course);
    courses.splice(Index, 1);

    res.send(course);
 });

const validateCourse = (course) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))