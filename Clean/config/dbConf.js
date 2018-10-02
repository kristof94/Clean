const env = {
    database: 'API',
    username: 'api',
    password: 'direct11',
    host: '192.168.0.17',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  };
   
  module.exports = env;