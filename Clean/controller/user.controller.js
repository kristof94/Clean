const db = require('../config/db');
const User = db.users;

// Post a Customer
exports.create = (req, res) => {
    // Save to MySQL database
    User.create({
        firstname: req.body.user.name,
        email: req.body.user.email,
    }).then(user => {
        // Send created customer to client
        res.send(user);
    }).catch((error)=>{
        res.status(401).end();
    });
};

// FETCH all Customers
exports.findAll = (req, res) => {
    User.findAll().then(users => {
        // Send all customers to Client
        res.send(users);
    });
};

// Find a Customer by Id
exports.findById = (req, res) => {
    User.findById(req.params.customerId).then(user => {
        res.send(user);
    })
};

// Update a Customer
exports.update = (req, res) => {
    const id = req.params.userId;
    User.update({
        firstname: req.body.firstname,
        email: req.body.email
    }, {
        where: {
            id: req.params.userId
        }
    }).then(() => {
        res.status(200).send("updated successfully a user with id = " + id);
    });
};

// Delete a Customer by Id
exports.delete = (req, res) => {
    const id = req.params.userId;
    User.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).send('deleted successfully a user with id = ' + id);
    });
};