import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Tableau de bord
        </Typography>

        <Typography>
          Vous êtes bien connectés à l'extranet.
        </Typography>
        <Typography>
          Utilisez le menu pour accéder aux différentes ressources.
          Il vous sera alors possible de poser des congés, des notes de frais,
          gérer les différents projets, etc...
        </Typography>
      </div>
    );
  }
}

export default Dashboard;
