/* eslint-disable no-console,no-restricted-syntax */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function addScript(d, s, id, cb) {

  if (d.getElementById(id)) {
    cb();
    return;
  }

  const element = d.getElementsByTagName(s)[0];
  const fjs = element;
  let js = element;
  js = d.createElement(s);
  js.id = id;
  js.src = '//apis.google.com/js/client:platform.js';
  fjs.parentNode.insertBefore(js, fjs);
  js.onload = () => {
    cb();
  };
}

class GoogleAuthorize extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      disabled: true,
    };
  }

  componentDidMount() {
    addScript(
      document,
      'script',
      'react-google-authorize-script',
      () => {
        this.setState({
          disabled: false
        });
      }
    );
  }

  handleClick(e) {
    if (e) {
      e.preventDefault(); // to prevent submit if used within form
    }

    const { disabled } = this.state;
    if (disabled) {
      return;
    }

    const { clientId, cookiePolicy, loginHint, hostedDomain, fetchBasicProfile, redirectUri, discoveryDocs, onFailure, uxMode, scope, responseType, onSuccess, onRequest, prompt } = this.props;

    const params = {
      client_id:              clientId,
      cookie_policy:          cookiePolicy,
      login_hint:             loginHint,
      hosted_domain:          hostedDomain,
      fetch_basic_profile:    fetchBasicProfile,
      ux_mode:                uxMode,
      redirect_uri:           redirectUri,
      response_type:          responseType,
      include_granted_scopes: true,
      discoveryDocs,
      prompt,
      scope,
    };

    if (params.response_type === 'code') {
      params.access_type = 'offline';
    }

    onRequest();

    window.gapi.auth2.authorize(
      params,
      (response) => {
        if (response.error) {
          // An error happened!
          onFailure(new Error(response.error));

          return;
        }

        if (params.response_type === 'code') {
          onSuccess(response);
        } else {
          onSuccess(response);
        }
      }
    );
  }

  render() {
    const {
      tag, type, style, className, disabledStyle, buttonText, children, render
    } = this.props;
    const disabled = this.state.disabled || this.props.disabled;
    if (render) {
      return render({ onClick: this.handleClick })
    }
    const initialStyle = {
      display:       'inline-block',
      background:    '#d14836',
      color:         '#fff',
      width:         190,
      paddingTop:    10,
      paddingBottom: 10,
      borderRadius:  2,
      border:        '1px solid transparent',
      fontSize:      16,
      fontWeight:    'bold',
      fontFamily:    'Roboto',
      cursor:        'pointer',
    };
    const styleProp = (() => {
      if (style) {
        return style;
      } else if (className && !style) {
        return {};
      }
      return initialStyle;
    })();
    const defaultStyle = (() => {
      if (disabled) {
        return Object.assign({}, styleProp, disabledStyle);
      }
      return styleProp;
    })();
    const googleLoginButton = React.createElement(
      tag,
      {
        onClick: this.handleClick,
        style:   defaultStyle,
        type,
        disabled,
        className
      },
      children || buttonText
    );
    return googleLoginButton;
  }
}

GoogleAuthorize.propTypes = {
  onSuccess:         PropTypes.func.isRequired,
  onFailure:         PropTypes.func.isRequired,
  clientId:          PropTypes.string.isRequired,
  onRequest:         PropTypes.func,
  buttonText:        PropTypes.string,
  scope:             PropTypes.string,
  className:         PropTypes.string,
  redirectUri:       PropTypes.string,
  cookiePolicy:      PropTypes.string,
  loginHint:         PropTypes.string,
  hostedDomain:      PropTypes.string,
  children:          PropTypes.node,
  style:             PropTypes.object,
  disabledStyle:     PropTypes.object,
  fetchBasicProfile: PropTypes.bool,
  prompt:            PropTypes.string,
  tag:               PropTypes.string,
  disabled:          PropTypes.bool,
  discoveryDocs:     PropTypes.array,
  uxMode:            PropTypes.string,
  responseType:      PropTypes.string,
  type:              PropTypes.string,
  render:            PropTypes.func
};

GoogleAuthorize.defaultProps = {
  type:              'button',
  tag:               'button',
  buttonText:        'Login with Google',
  scope:             'profile email',
  prompt:            '',
  cookiePolicy:      'single_host_origin',
  fetchBasicProfile: true,
  uxMode:            'popup',
  disabledStyle:     {
    opacity:    0.6,
    background: '#9c9c9c',
    cursor:     'not-allowed',
  },
  onRequest:         () => {}
};

export default GoogleAuthorize;
