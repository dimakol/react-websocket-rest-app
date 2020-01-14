import React from 'react';
import Table from 'react-bootstrap/Table';
import './MyTable.css';

/**
 * Our customized table component
 * @param {*} props 
 */
const MyTable = (props) => {

  // Render the body of the table with the data that we got from our API
  const renderTable = () => {
    return props.data.filter( (album, index) => album && index < 10)
                     .map( (album, index) => {
      return (
        <tr key={index}>
          <td>{album.id}</td>
          <td>{album.userId}</td>
          <td>{album.title}</td>
        </tr>
      )
    })
  }
      
  return (
    <Table id="albums" striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{renderTable()}</tbody>
    </Table>
  );
}

export default MyTable;