## WebSockets-Rest_API

The project implements and show the two most popular options available today for client-server communication protocols: **WebSocket against RESTful HTTP**.

## Motivation

The motivation behind this project was to **learn and understand better the topic of client-server communication** (the communication between a web browser and a web server) and to implement it with **ReactJS** web framework.

## Screenshots

![image](screenshots/RestAPI.png?raw=true "RestAPI")

![animated gif](screenshots/WebSocket.gif?raw=true "WebSocket")

## Tech/framework used

**Built with**

-   [ReactJS](https://reactjs.org/)

## Features

- The JSON data that we receive from the REST API is displayed in a beautifully designed **Table**.
- The messages that we receive from the WebSocket is displayed on the screen as **Live Rates Ticker** that are colorfully designed and include start/stop button.

## Code Examples

**REST API**
~~~
// Using useEffect to retrieve data from an API
useEffect(() => {
	const source = axios.CancelToken.source();

	const fetchData = async () => {
		setIsError(false);
		setIsLoading(true);

		try {
			// Making our HTTP request to the specified url
			const response = await axios(url, {
				cancelToken: source.token
			});
			// Updating the state with the data we got from the response
			setData(response.data);
		} catch (error) {
			setIsError(true);
			if (axios.isCancel(error)) {
				console.log('request cancelled');
			} else {
				throw error;
			}
		}

		setIsLoading(false);
	};

	// Invoke the async function
	fetchData();

	// Unmount
	return () => {
		source.cancel();
	};
}, []);
~~~
**WebSocket**
~~~ 
// Consistent WebSocket API connection
const webSocket = useRef(null);

// Socket onopen effect
useEffect(() => {
	// Connect to websocket
	connect();
	webSocket.current.onopen = (event) => {
		try {
			// Subscribing to a channel by sending JSON message to the server
			toogleChannel("subscribe");
		} catch (err) {
			console.log("Got invalid message from websocket on open", err, event.data);
		}
	}
}, []);

// Socket onmessage effect
useEffect(() => {
	webSocket.current.onmessage = (event) => {
		// Some response message
		const response = JSON.parse(event.data);
		switch (response.event) {
			case 'data':
				// Calculate the rate by summing the last bid with the last ask and divide it by 2
				rateCalculate(response.data.bids[0][0], response.data.asks[0][0])
					// Generate rate object that includes value and color
					.then( rate => generateRateObject(!rates.length ? undefined : rates[rates.length-1].value, rate))
					// Adding the new rate to previous rates array by using array spread operator.
					.then( rateObj => setRates(rates => [...rates, rateObj]));
				break;
			case 'bts:request_reconnect':
				// Forced reconnection
				connect();
				break;
			default:
				break;
		}
	}
}, [rates]);

// Socket onclose effect
useEffect(() => {
	webSocket.current.onclose = (event) => {
		// Wasn't cleaned
		if (!event.wasClean) {
			console.log({ error: `WebSocket error: ${event.code} ${event.reason}` });
			// Reconnect
			connect();
		}
	}
}, []);

// Socket onerror effect
useEffect(() => {
	webSocket.current.onerror = (event) => {
		console.log("received websocket error", event);
	}
}, []);

// Unmount
useEffect(() => () => {
	webSocket.current.close();
}, [webSocket])

// WebSocket connection
const connect = () => {
	webSocket.current = new WebSocket(serverEndPoint);
}
~~~

## Installation

**Running in development environment**

	git, npm and node softwares should be installed
	before moving on
	
 - git clone https://github.com/dimakol/WebSockets-REST_API.git
 - cd WebSockets-REST_API/ 
 - npm install
 - npm start

## API Reference

- https://www.bitstamp.net/websocket/v2/ - Websocket API
- https://jsonplaceholder.typicode.com/ - REST API

## Link to the website that hosting our project

https://dimakol.github.io/WebSockets-REST_API/

## Credits

- https://www.robinwieruch.de/react-hooks-fetch-data
- https://www.grapecity.com/blogs/moving-from-react-components-to-react-hooks
- https://github.com/Nikhil-Kumaran/ChatApp/blob/master/src/WebSockets.js
- https://dev.to/sama/react-with-websockets-254e

## License

MIT © Dima Kolyas
