import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

/**
 * Spinner component aligned to the center of the screen
 */
const Loader = () => {
  return (
    <div className="page-center">
      <Spinner animation="border" variant="primary" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;
