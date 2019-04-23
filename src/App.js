import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor() {
    super();

    this.state = {
      supplies: [],
      cart: [],
      user: "",
      username: "",
      password: "",
      loggedIn: false
    };
  }

  componentDidMount() {
    this.getSupplies();
    this.getUser();
  }

  getUser = () => {
    axios
      .get("/api/users")
      .then(response => {
        if (response.data.username !== "") {
          this.setState({
            loggedIn: true
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getSupplies = () => {
    axios
      .get("/api/supplies")
      .then(response => {
        this.setState({
          supplies: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  addToCart = id => {
    axios
      .post(`/api/supplies/${id}`)
      .then(response => {
        this.setState(
          {
            cart: [...response.data.cart]
          },
          () => {
            console.log("cart ", this.state.cart);
            console.log("length ", this.state.cart.length);
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  login = () => {
    const { username, password } = this.state;
    axios
      .post("/api/auth/login", { username, password })
      .then(response => {
        console.log(response);
        this.setState({
          loggedIn: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  signup = () => {
    const { username, password } = this.state;
    axios
      .post("/api/auth/signup", { username, password })
      .then(response => {
        this.setState({
          loggedIn: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let displayItems = this.state.supplies.map(item => {
      return (
        <div
          key={item.id}
          style={{
            width: "300px",
            margin: "auto",
            textAlign: "left"
          }}
        >
          <div style={{}}>
            <h1>{item.name}</h1>
            <div style={{ display: "flex" }}>
              <p>Price: </p>
              <p>${item.price}</p>
            </div>
          </div>
          <button onClick={() => this.addToCart(item.id)}>Add to Cart</button>
        </div>
      );
    });
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="App">
          {this.state.loggedIn ? (
            <button style={{ padding: "10px", margin: "50px" }}>
              Checkout
            </button>
          ) : null}

          <div style={{ paddingLeft: "200px" }}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="username"
              onChange={e => this.setState({ username: e.target.value })}
            />
            <input
              type="text"
              placeholder="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            <button onClick={this.login}>Log in</button>
            <button onClick={this.signup}>Signup</button>
            <h2>Logged In: {this.state.loggedIn ? "true" : "false"}</h2>
          </div>
          {displayItems}
        </div>
        <h1>Items in cart: {this.state.cart.length}</h1>
      </div>
    );
  }
}

export default App;
