import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Roles extends Component {

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Liste des rôles
          <Button variant="contained" color="primary">
            Ajouter
         </Button>
        </Typography>
        <Typography>Page listant les différents rôles</Typography>
      </div>
    );
  };
}

export default Roles;
