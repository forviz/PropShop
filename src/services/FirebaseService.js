import React, { Component } from 'react';

class FirebaseService extends Component {

  constructor(apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId) {
    super();
    
    const config = {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId,
    };

    firebase.initializeApp(config);

    this.GoogleProvider = new firebase.auth.GoogleAuthProvider();
    this.GoogleProvider.addScope('https://www.googleapis.com/auth/plus.login'); // ageRange, languages
    this.GoogleProvider.addScope('profile');
    // this.GoogleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');

    this.facebookProvider = new firebase.auth.FacebookAuthProvider();
    this.facebookProvider.addScope('public_profile');
    // this.facebookProvider.addScope('user_birthday');

    // Add Event Listener to Auth service
    const _self = this;


  }
  
}

export default FirebaseService;