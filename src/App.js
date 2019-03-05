import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {

	state = {
		dish: "",
		username: "",
		items: [],
		user: null
	}

	componentDidMount() {
		const itemsRef = firebase.database().ref('potluck');
		itemsRef.on("value", (snapshot) => {
			let items = snapshot.val();
			let newState = [];
			for(let item in items) {
				newState.push({
					id: item,
					dish: items[item].food,
					username: items[item].user
				})
			}
			this.setState({
				items: newState
			})
		})
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();	
		const potluck = firebase.database().ref('potluck');
  		const item = {
			food: this.state.dish,
			user: this.state.username
		}

 		potluck.push(item);
  		this.setState({
    		dish: "",
    		username: ""
		});
	}

	removeItem = (itemId) => {
		const user = firebase.auth().currentUser;
		console.log(user)
		if(user === null) {
			const warning = document.querySelector(".warning");
			warning.style.fontSize = "1.05em";
			setTimeout(function(){ warning.style.fontSize = "1em"; }, 300);
		} else {
			const itemsRef = firebase.database().ref(`potluck/${itemId}`);
			itemsRef.remove();
		}
	}

	logInUser = () => {
		firebase.auth().signInWithPopup(provider).then((result) => {
			const token = result.credential.accessToken;
			const user = result.user;
			this.setState({
				user: user
			})
		})
	}

	logOutUser = () => {
		firebase.auth().signOut().then(() => {
			this.setState({
				user: null
			})
		})
	}

	render() {
		return (
		<div className="app">
			<header>
				{this.state.user ? <button className="login" onClick={this.logOutUser}>Log Out</button> : <button className="login" onClick={this.logInUser}>Log In</button>}
				<h1>Holiday Potluck</h1>          
			</header>
			<div className="food-display">
				{this.state.items.map((item) => {
					return (
						<div key={item.id} className="food">
							<i className="fas fa-times" onClick={() => this.removeItem(item.id)} ></i>
							<h3>{item.dish}</h3>
							<p>-{item.username}</p>
						</div>
					)
				})}
			</div>
			<form onSubmit={this.handleSubmit}>
				{this.state.user ? 
				<React.Fragment>
					<input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username}/>
					<br></br>
					<input type="text" name="dish" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.dish}/>
					<br></br>
					<button>Sign Up!</button> 
				</React.Fragment>
					: <p className="warning">Please login to make any changes.</p>
				}				
			</form>
	  	</div>
	);
  }
}

export default App;
