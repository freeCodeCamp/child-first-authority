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
  }, {
    _id      : '58bf5cc5563060d37fe5c840',
    name     : 'Chad Sheets',
    email    : 'cjsheets@gmail.com',
    provider : 'google',
    google   : {
      displayName : 'Chad Sheets',
      name        : {
        familyName : 'Sheets',
        givenName  : 'Chad'
      },
      url   : 'https://plus.google.com/+ChadSheets',
      image : {
        url       : 'https://lh5.googleusercontent.com/-uKvlbrkAhvI/AAAAAAAAAAI/AAAAAAAAAls/Qqp1pxNamj8/photo.jpg?sz=50',
        isDefault : false
      },
      isPlusUser : true,
      language   : 'en',
      verified   : false,
      cover      : {
        layout     : 'banner',
        coverPhoto : {
          url    : 'https://lh3.googleusercontent.com/Hl1_RYBHDMy-W1Qrc6NmppJLZwLEkbFZp0ux2H2gPfsN2bih8t9V9r8cfi95dkufeXdYQYEa=s630',
          height : 188,
          width  : 940
        },
        coverInfo : {
          topImageOffset  : -5,
          leftImageOffset : 0
        }
      }
    },
    __v  : 0,
    role : 'super'
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
  static getMe() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users[2]));
      }, delay);
    });
  }

/**
 * Get a single user
 */
  static show() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users[2]));
      }, delay);
    });
  }

/**
 * Get list of users
 * restriction: 'admin'
 */

  static index() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users));
      }, delay);
    });
  }


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
