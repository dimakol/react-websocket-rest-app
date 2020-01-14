import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Ticker from '../../components/ticker/Ticker';
import { rateCalculate, generateRateObject } from '../../utils/calculations';

/**
 * Web Socket implementation using React class components
 */
class Websockets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Our rates (ticker)
            rates: [],
            // Our start/stop button state
            stop: false,
        };

        // Bitcoin - United States Dollar
        this.currencyPair = 'btcusd';
        // Our server address to which we will make web socket connection
        this.serverEndPoint = 'wss://ws.bitstamp.net';
    }

    componentDidMount() {
        // Connect
        this.createWebSocket();
    }

    componentDidUpdate() {
        if (!this.webSocket) {
          return;
        }
    
        if (this.webSocket.readyState === this.webSocket.CLOSED) {
          // Reconnect
          this.createWebSocket();
        }
    }

    componentWillUnmount() {
        if (!this.webSocket) {
          return;
        }
        this.webSocket.close();
    }

    // Creating the web socket connection and listening to the incoming events from the web socket
    createWebSocket = () => {
        // Creating the web socket connection
        this.webSocket = new WebSocket(this.serverEndPoint);

        // Listening to the incoming events from the web socket
        this.webSocket.onopen = event => this.onOpen(event);
        this.webSocket.onmessage = event => this.onMessage(event);
        this.webSocket.onclose = event => this.onClose(event);
        this.webSocket.onerror = event => this.onError(event);
    }

    // WebSocket connection's readyState changes to OPEN, The connection is ready to send and receive data.
    onOpen = (event) => {
        try {
            // Subscribing to a channel by sending JSON message to the server
            this.toogleChannel("subscribe");
        } catch (err) {
            console.log("Got invalid message from websocket on open", err, event.data);
        }
    }

    // A message is received from the server
    onMessage = (event) => {
        // Some response message
        const response = JSON.parse(event.data);
        switch (response.event) {
            case 'data':
                // Calculate the rate by summing the last bid with the last ask and divide it by 2
                rateCalculate(response.data.bids[0][0], response.data.asks[0][0])
                            // Generate rate object that includes value and color
                            .then( rate => generateRateObject(!this.state.rates.length ? undefined : this.state.rates[this.state.rates.length-1].value, rate))
                            // Adding the new rate object to previous rates array by using array spread operator
                            .then( rateObj => this.setState({ rates: [...this.state.rates, rateObj] }));
                break;
            case 'bts:request_reconnect':
                // Forced reconnection
                this.createWebSocket();
                break;
            default:
                break;
        }
    }

    // WebSocket connection's readyState changes to CLOSED
    onClose = (event) => {
        // Wasn't cleaned 
        if (!event.wasClean) {
            console.log({ error: `WebSocket error: ${event.code} ${event.reason}` });
            // Reconnect
            this.createWebSocket();
        }
    }

    // An error occurs on the WebSocket
    onError = (event) => {
        console.log("received websocket error", event);
    }

    // Toogle between start and stop states
    handleButtonClick = () => {
        // Currently running
        if (!this.state.stop) {
            this.toogleChannel("unsubscribe");
            this.setState({ stop: true });
        }
        // Currently stopped
        else {
            this.toogleChannel("subscribe");
            this.setState({ stop: false });
        }
    }

    /**
    * Subscribing\Unsubscribing from the channel
    * @param {String} status - "subscribe" or "unsubscribe"
    */
    toogleChannel = (status) => {
        if (status === "subscribe" || status === "unsubscribe")
        {
            // JSON object for subscribe\unsubscribe
            const JSONObj = {
                event: `bts:${status}`,
                data: {
                    channel: `order_book_${this.currencyPair}`
                }
            };
            // subscribe\unsubscribe to\from a channel by sending JSON message to the server
            this.webSocket.send(JSON.stringify(JSONObj));
        }
    }

    render() {
        const { rates } = this.state;
        return (
            <div>
              <Ticker rates={rates} />
              <Button variant="outline-secondary"
                      onClick={this.handleButtonClick}
                      style={{marginBottom: "20px"}}>Start/Stop</Button>
            </div>
        );
    }

}

export default Websockets;