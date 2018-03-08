import React from 'react';
import ReactDOM from 'react-dom';
// import FontAwesome from 'react-fontawesome';
import { GoogleAuthorize } from '../src/index';

// import GoogleAuthorize, { GoogleLogout } from '../dist/google-authorize'

const success = response => {
  console.log(response);
};

const error = response => {
  console.error(response);
};

const loading = () => {
  console.log('loading');
};

const logout = () => {
  console.log('logout');
};

ReactDOM.render(
  <div>
    <GoogleAuthorize
      clientId="815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com"
      scope="https://www.googleapis.com/auth/analytics"
      onSuccess={success}
      onFailure={error}
      onRequest={loading}
      offline
      responseType="code"
      isSignedIn
      // disabled
      prompt="select_account"
      // className='button'
      // style={{ color: 'red' }}
    >
      <span>Analytics</span>
    </GoogleAuthorize>

    <GoogleAuthorize
      clientId="815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com"
      scope="https://www.googleapis.com/auth/adwords"
      onSuccess={success}
      onFailure={error}
      onRequest={loading}
      offline
      responseType="code"
      // uxMode="redirect"
      // redirectUri="http://google.com"
      // disabled
      prompt="select_account"
      // className='button'
      // style={{ color: 'red' }}
    >
      <span>Adwords</span>
    </GoogleAuthorize>

    <GoogleAuthorize
      clientId="815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com"
      scope="https://www.googleapis.com/auth/adsense.readonly"
      onSuccess={success}
      onFailure={error}
      onRequest={loading}
      offline
      responseType="code"
          // uxMode="redirect"
          // redirectUri="http://google.com"
          // disabled
      prompt="select_account"
    >
      <span>Adsense</span>
    </GoogleAuthorize>

  </div>,
  document.getElementById('google-authorize')
);
