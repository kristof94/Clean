const db = require('../config/db');
const User = db.users;

// Post a Customer
exports.create = (name,email) => {
    // Save to MySQL database
    return User.create({
        firstname: name,
        email: email,
    });
};

// FETCH all Customers
exports.findAll = (req, res) => {
    User.findAll().then(users => {
        // Send all customers to Client
        res.send(users);
    });
};

exports.listAll = (func) => {
    User.findAll().then(users => {
        users.forEach(item => {
            func(item.id);
        });
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

exports.remove = (id) => {
    User.destroy({
        where: {
            id: id
        }
    }).then(() => {
        console.log('deleted successfully a user with id = ' + id);
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