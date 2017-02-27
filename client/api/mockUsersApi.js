import delay from './delay';
/* eslint-disable */

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const users = [
  {
    _id      : '589bb5ad5d4c3d03304f49c0',
    provider : 'local',
    name     : 'Admin',
    email    : 'admin@admin.com',
    role     : 'admin',
    __v      : 0
  }, {
    _id      : '589bb5ac5d4c3d03304f49bf',
    provider : 'local',
    name     : 'Test User',
    email    : 'test@test.com',
    role     : 'guest',
    __v      : 0
  }
];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//This would be performed on the server in a real app. Just stubbing in.
const generateId = user => replaceAll(user.title, ' ', '-');

class UsersApi {
/**
 * Get my info
 */
static me(req, res) {
  User.findById(req.user.id)
    .populate('assignment')
    .exec(function(err, user) {
      if(err) return handleError(res, err);
      if(!user) return res.status(401).send('Unauthorized');
      return res.status(200).json(user);
    });
};

/**
 * Get a single user
 */
static show(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if(err) return handleError(res, err);
    if(!user) return res.status(401).send('Unauthorized');
    return res.status(200).json(user.profile);
  });
};

/**
 * Get list of users
 * restriction: 'admin'
 */
static index(req, res) {
  User.find()
    .populate('assignment', 'name')
    .sort({name: 1})
    .exec(function(err, users) {
      if(err) return handleError(res, err);
      return res.status(200).json(users);
    });
};


  static getAllUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users));
      }, delay);
    });
  }

  static saveUser(user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        const minUserTitleLength = 1;
        if(user.title.length < minUserTitleLength) {
          reject(`Title must be at least ${minUserTitleLength} characters.`);
        }

        if(user.id) {
          const existingUserIndex = users.findIndex(a => a.id == user.id);
          users.splice(existingUserIndex, 1, user);
        } else {
          //Just simulating creation here.
          //The server would generate ids and watchHref's for new users in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          user.id = generateId(user);
          user.watchHref = '';
          users.push(user);
        }

        resolve(Object.assign({}, user));
      }, delay);
    });
  }

  static deleteUser(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const indexOfUserToDelete = users.findIndex(user => {
          user.userId == userId;
        });
        users.splice(indexOfUserToDelete, 1);
        resolve();
      }, delay);
    });
  }
}

export default UsersApi;
