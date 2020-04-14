/* eslint-disable semi */
/* eslint-disable no-var */
var ua = window.navigator.userAgent;
var msie = ua.indexOf('MSIE ');
var trident = ua.indexOf('Trident/');
var ie = (msie > 0 || trident > 0);
if (ie) {
  window.alert('This application will not work in Internet Explorer. Please use Google Chrome.');
}