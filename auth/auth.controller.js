const auth = require('./auth.service');

async function register(req, res) {
  try {
    const {
      firstName = '',
      lastName = '',
      email = '',
      password = ''
    } = req.body || {};

    const { code, message, data } = await auth.register({
      firstName,
      lastName,
      email,
      password
    });

    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}

async function login(req, res) {
  try {
    const { email = '', password = '' } = req.body || {};

    const { code, message, data } = await auth.login(email, password);

    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}

async function logout(req, res) {
  try {
    const { authorization = '' } = req.headers || {};

    const { code, message, data } = await auth.logout(authorization);

    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  register,
  login,
  logout
}