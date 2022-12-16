const express = require('express');
const app = express();
const  cors = require('cors');
const mongoose = require('./database/mongoose');
app.use(cors());
const List = require('./database/models/list');
const Task = require('./database/models/task');
const error = require('mongoose/lib/error');
app.use(express.json());

app.get('/lists', (req, res) => {
    List.find()
        .then(lists => res.send(lists))
        .catch(error => console.log(error))
});
app.get('/lists/:listId', (req, res) => {
    List.find({_id:req.params.listId})
        .then(list => res.send(list))
        .catch(error => console.log(error))
});
app.patch('/lists/:listId', (req, res) => {
    List.findOneAndUpdate({_id:req.params.listId}, {$set: req.body})
        .then(list => res.send(list))
        .catch(error => console.log(error))
});
app.delete('/lists/:listId', (req, res) => {
    const deleteTasks = (list) => {
        Task.deleteMany({
            _listId: list._id
        }).then(() => list)
            .catch(err => console.log(error));
    }
    List.findByIdAndDelete(req.params.listId)
        .then(list => res.send(deleteTasks(list)))
        .catch(error => console.log(error));
});
app.post('/', (req, res) => {
    (new List({'title':req.body.title})).save()
        .then(lists => res.send(lists))
        .catch(error => console.log(error))
});

/// task assosiated with list.
app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({_listId: req.params.listId})
        .then(tasks => res.send(tasks))
        .catch(error => console.log(error))
});

app.get('/lists/:listId/task/:taskId', (req, res) => {
    Task.findOne({_listId: req.params.listId, _id:req.params.taskId})
        .then(task => res.send(task))
        .catch(error => console.log(error))
});

app.patch('/lists/:listId/task/:taskId', (req, res) => {
    Task.findOneAndUpdate({_listId: req.params.listId, _id:req.params.taskId}, {$set: req.body})
        .then(task => res.send(task))
        .catch(error => console.log(error))
});
app.delete('/lists/:listId/task/:taskId', (req, res) => {
    Task.findByIdAndDelete({_listId: req.params.listId, _id:req.params.taskId})
        .then(task => res.send(task))
        .catch(error => console.log(error))
});
app.post('/lists/:listId/task', (req, res) => {
    (new Task({'title': req.body.title, '_listId': req.params.listId})).save().then(lists => res.send(lists))
    .catch(error => console.log(error))
  
});

app.listen(3000, () => {
    console.log(`server conneted on port 3000`)
})