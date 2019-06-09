export default function ({ $axios, app, redirect, store, req }) {
  $axios.onRequest(config => {
    config.headers.common['accept'] = 'application/json';
    config.headers.common['content-type'] = 'application/json; application/x-www-form-urlencoded; charset=utf-8';
  })
}
