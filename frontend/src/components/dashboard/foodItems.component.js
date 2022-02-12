import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';


function DisplayFood(props) {

    console.log(props);

    return (
        <Card
            // bg={variant.toLowerCase()}
            // key={idx}
            // text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
            style={{ width: '18rem' }}
            className="mb-2"
        >
            <Card.Header>Header</Card.Header>
            <Card.Body>
                {/* <Card.Title> Card Title </Card.Title> */}
                <ListGroup variant="flush">
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>

                <Card.Text>
                    Some quick example text to build on the card title and make up the bulk
                    of the card's content.
          </Card.Text>
            </Card.Body>
        </Card>
    )
}

DisplayFood.defaultProps = {
    foodItem: {
        name: "",
        
    }
}

export default DisplayFood