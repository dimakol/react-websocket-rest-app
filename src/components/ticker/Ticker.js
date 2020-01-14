import React from 'react';
import Rate from '../../components/ticker/rate/Rate';
import './Ticker.css';

/**
 * Our ticker component
 * @param {*} props 
 */
const Ticker = (props) => {
    return (
        <div className="Ticker">
            {props.rates.map( (rate, index) => {
                return <Rate key={index}
                             value={rate.value}
                             color={rate.color} />
                } )
            }
        </div>
    );
}
  
export default Ticker;