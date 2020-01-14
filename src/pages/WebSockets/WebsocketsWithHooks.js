import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Ticker from '../../components/ticker/Ticker';
import { rateCalculate, generateRateObject } from '../../utils/calculations';

/**
 * Web Socket implementation using React hooks
 */
const WebsocketsWithHooks = () => {
  // Our rates (ticker)
  const [rates, setRates] = useState([]);
  // Our start/stop button state
  const [stop, setStop] = useState(false);

  // Bitcoin - United States Dollar
  const currencyPair = 'btcusd';
  // Our server address to which we will make web socket connection
  const serverEndPoint = 'wss://ws.bitstamp.net';
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

  // Toogle between start and stop states
  const handleButtonClick = () => {
    // Currently running
    if (!stop) {
      toogleChannel("unsubscribe");
      setStop(true);
    }
    // Currently stopped
    else {
      toogleChannel("subscribe");
      setStop(false);
    }
  }
  
  /**
   * Subscribing\Unsubscribing from the channel
   * @param {String} status - "subscribe" or "unsubscribe"
   */
  const toogleChannel = (status) => {
    if (status === "subscribe" || status === "unsubscribe")
    {
      // JSON object for subscribe\unsubscribe
      const JSONObj = {
        event: `bts:${status}`,
        data: {
          channel: `order_book_${currencyPair}`
        }
      };
      // subscribe\unsubscribe to\from a channel by sending JSON message to the server
      webSocket.current.send(JSON.stringify(JSONObj));
    }
  }

  return (
    <div>
      <Ticker rates={rates} />
      <Button variant="outline-secondary"
              onClick={handleButtonClick}
              style={{marginBottom: "20px"}}>Start/Stop</Button>
    </div>
  );

}

export default WebsocketsWithHooks;