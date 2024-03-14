const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

let events = [];

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Render events list
app.get('/', (req, res) => {
    res.render('index', { events });
});

// Render form to add new event
app.get('/events/new', (req, res) => {
    res.render('create');
});

// Add new event
app.post('/events', (req, res) => {
    const { name, location, datetime, description } = req.body;
    events.push({ name, location, datetime, description });
    res.redirect('/');
});

// Render form to edit event
app.get('/events/edit/:index', (req, res) => {
    const index = req.params.index;
    const event = events[index];
    if (!event) {
        res.status(404).send('Event not found');
    } else {
        res.render('edit', { event, index });
    }
});

// Update event
app.post('/events/update/:index', (req, res) => {
    const index = req.params.index;
    const { name, location, datetime, description } = req.body;
    events[index] = { name, location, datetime, description };
    res.redirect('/');
});

// Delete event
app.post('/events/delete/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < events.length) {
        events.splice(index, 1);
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});