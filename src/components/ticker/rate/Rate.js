import React from 'react';
import './Rate.css';

/**
 * Our rate component consist of value and color
 * @param {*} props 
 */
const Rate = (props) => {
    return (
        <div className="Rate" style={{color: props.color}}>
            {props.value}
        </div>
    );
}
  
export default Rate;