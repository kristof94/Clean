module.exports = function (sequelize, Sequelize) {
	const Users = sequelize.define('Users', {
		firstname: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
			unique: 'compositeIndex',
			allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [6, 128],
                    msg: "Email address must be between 6 and 128 characters in length"
                },
                isEmail: {
                    msg: "Email address must be valid"
                }
            }
		}
	});
	return Users;
}