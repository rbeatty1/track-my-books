export default class ApiWrapper {
  constructor(props) {
    this.props = props;
    this.apiUrl = `http://localhost:5000/books/api/v1/${this.props.endpoint}/`;
  }

  getData(callbackFn) {
    fetch(this.apiUrl)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then((data) => callbackFn({ success: true, results: data }))
      .catch((err) => callbackFn({ success: false, results: err }));
  }

  userAuthentication(username, password, callbackFn) {
    fetch(
      this.apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ username, password }),
      },
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Login failed');
      })
      .then((d) => callbackFn(d))
      .catch(() => callbackFn({ auth: false }));
  }
}
