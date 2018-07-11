Partie frontend de l'extranet
=============================

Partie réalisée avec les technologies suivantes :
 - NodeJS : https://nodejs.org/
 - ReactJS : https://reactjs.org/
 - MaterialUI : https://material-ui.com/

Il est préférable d'être en possession des dernières versions de node et npm.

## Mise en route

### Pour travailler en local

```sh
npm install
npm start
```

Là ça va ouvrir le navigateur sur http://localhost:3000 et à chaque fois qu'un
fichier sera sauvegardé, la page se mettra automatiquement à jour sans avoir
à actualiser la page à chaque fois; c'est plutôt sympa :p

### Pour avoir une version buildée pour la prod'

```sh
npm install
npm run build
```

et servir statiquement le dossier `build`.
