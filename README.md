# react-google-authorize [![NPM version](https://img.shields.io/npm/v/react-google-authorize.svg?style=flat)](https://www.npmjs.com/package/react-google-authorize) [![NPM downloads](https://img.shields.io/npm/dm/react-google-authorize.svg?style=flat)](https://npmjs.org/package/react-google-authorize)

> A Google OAuth Component for React that supports multiple instances

Developed in [Selectom](https://www.selectom.com).

## Install

```
yarn add react-google-authorize
```

**Why yet another React Google oauth component?**

All existing React Google oauth components (e.g. [react-google-login](https://github.com/anthonyjgrove/react-google-login), which is the basis of this library, and also [react-google-login-component](https://github.com/kennetpostigo/react-google-login-component), [react-google-oauth](https://github.com/CyrilSiman/react-google-oauth) and [react-social-login](https://github.com/deepakaggarwal7/react-social-login)) use the [gapi.auth2.init](https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams) method for handling the authentication and authorization process, which has the limitation of only supporting one button in the document at a time.

We needed to support multiple authorization buttons, potentially for different Google user accounts, so we implemented this control to use the [gapi.auth2.authorize](https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorizeparams-callback) method instead.
This means that you don't get a GoogleUser object to play with, but you can request authorization from different users at the same time.


## How to use
```js
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleAuthorize from 'react-google-authorize';
// or
import { GoogleAuthorize } from 'react-google-authorize';


const responseGoogle = (response) => {
  console.log(response);
}

ReactDOM.render(
  <GoogleAuthorize
    clientId="815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com"
    buttonText="Authorize"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />,
  document.getElementById('googleButton')
);
```
## Parameters

|    params    |   value  |             default value            |   description    |
|:------------:|:--------:|:------------------------------------:|:----------------:|
|    clientId  |  string  |               REQUIRED               |                  |
| hostedDomain |  string  |                   -                  |                  |
|     scope    |  string  |             profile email            |                  |
| responseType |  string  |              permission              | Can be either space-delimited 'id_token', to retrieve an ID Token + 'permission' (or 'token'), to retrieve an Access Token, or 'code', to retrieve an Authorization Code.
|   onSuccess  | function |               REQUIRED               |                  |
|   onFailure  | function |               REQUIRED               |                  |
|   onRequest  | function |                   -                  |                  |
|   buttonText |  string  |             Login with Google        |                  |
|   className  |  string  |                   -                  |                  |
|    style     |  object  |                   -                  |                  |
| disabledStyle|  object  |                   -                  |                  |
|   loginHint  |  string  |                   -                  |                  |
|    prompt    |  string  |                   -                  |                  |
|     tag      |  string  |                button                |  sets element tag (div, a, span, etc     |
|     type      |  string  |               button                |sets button type (submit || button)     |
| fetchBasicProfile | boolean | true                            |                  |
| disabled | boolean | false                            |                  |
| discoveryDocs | - | https://developers.google.com/discovery/v1/using |
| uxMode       |  string  |  popup   | The UX mode to use for the sign-in flow. Valid values are popup and redirect. |
| redirectUri       |  string  |  -   | If using ux_mode='redirect', this parameter allows you to override the default redirect_uri that will be used at the end of the consent flow. The default redirect_uri is the current URL stripped of query parameters and hash fragment. |
| isSignedIn | boolean | false | If true will return GoogleUser object on load, if user has given your app permission |
| render | function | - | Render prop to use a custom element, use renderProps.onClick |
Google Scopes List: https://developers.google.com/identity/protocols/googlescopes

## onSuccess callback

Argument to the callback with be the [AuthorizeResponse](https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorizeresponse) object.

If you use the hostedDomain param, make sure to validate the id_token (a JSON web token) returned by Google on your backend server:
 1. In the `responseGoogle(response) {...}` callback function, you should get back a standard JWT located at `response.hg.id_token`
 2. Send this token to your server (preferably as an `Authorization` header)
 3. Have your server decode the id_token by using a common JWT library such as [jwt-simple](https://github.com/hokaccha/node-jwt-simple) or by sending a GET request to `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE`
 4. The returned decoded token should have an `hd` key equal to the hosted domain you'd like to restrict to.

You can also pass child components such as icons into the button component.
```js
  <GoogleAuthorize
    clientId={'815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com'}
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  >
    <FontAwesome
      name='google'
    />
    <span> Login with Google</span>
  </GoogleAuthorize>

```


## onFailure callback

onFailure callback is called when either initialization or a authorization attempt fails.
Argument is an error object.

Common error codes include:

| error code | description |
|:----------:|:-----------:|
| `idpiframe_initialization_failed` | initialization of the Google Auth API failed (this will occur if a client doesn't have [third party cookies enabled](https://github.com/google/google-api-javascript-client/issues/260)) |
| `popup_closed_by_user` | The user closed the popup before finishing the sign in flow.|
| `access_denied` | The user denied the permission to the scopes required |
| `immediate_failed` | No user could be automatically selected without prompting the consent flow. |

More details can be found in the official Google docs:
 * [GoogleAuth.then(onInit, onError)](https://developers.google.com/identity/sign-in/web/reference#googleauththenoninit-onerror)
 * [GoogleAuth.signIn(options)](https://developers.google.com/identity/sign-in/web/reference#googleauthsigninoptions)
 * [GoogleAuth.grantOfflineAccess(options)](https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccessoptions)

## Using a custom element

If you prefer, you can use your own custom JSX/React component instead of the default authorization button.

Just make sure to bind the `renderProps.onClick` as your component prop `onClick` listener, in other that to call the 
properly authorization function like the example below:

```js
  <GoogleAuthorize
    clientId={'815121234598-5nn3e2ftm5hobdjbemuappb2t112345.apps.googleusercontent.com'}
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    render={(renderProps) => {
      return (
        <button
          type="button"
          onClick={renderProps.onClick}
        >
          My custom element
        </button>
      )
    }}
  />
```

## Dev Server
```
yarn run start
```
Default dev server runs at localost:3000 in browser.
You can set IP and PORT in webpack.config.dev.js

## Run Tests
```
npm run test:watch
```

(or `yarn run test:watch` for running on code change)

## Production Bundle
```
yarn run bundle
```

## Related projects

You might also be interested in these projects:

* [react-google-login](https://github.com/anthonyjgrove/react-google-login): This project was forked from it, but is incompatible because of the way it uses the Google auth2 library. It it suitable for logging in, or managing sessions on the client side.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/selectom/react-google-authorize/issues/new).

## Author

**Alon Diamant (advance512)**

* [github/advance512](https://github.com/advance512)
* [Homepage](http://www.alondiamant.com)

## Contributors

**Eliran Amar**
* [github/eliranamar](https://github.com/eliranamar)
