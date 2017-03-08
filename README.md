# Générateur de composant pour adapt / ComponentGenerator /

ComponentGenerator est un petit script permettant de générer le code source des composants et block pour un projet adapt.

## Démarrage du script

Vous devez lancer la commande suivant pour lancer le script
```js
node index.js src/component_list.xlsx
```

Si vous lancez la commande sans le fichier source le scirpt se lancera automatiquement avec cette argument ``src/component_list.xlsx``. Si le fichier envoyer en parametre n'existe pas le script vous enverra une erreur.

### Les composants de base supportés

Vous pourrez trouver tout les compodants supportés dans le répertoire `model`.
une liste de certains d'entre eux :

* block
* grahic
* mcq

  ... mcq component have an extra JSON file to generate items 'mcq-item-model'

* media

  ... media component have an extra JSON file to generate items 'media-item-model'

* narrative

  ... narrative component have an extra JSON file to generate items 'narrative-item-model'


### Comment fabriquer les makers

Commencer par créer le modèle JSON et le placer dans le répoertoire model. Il faut maintenant créer le marker.


### Les composants YesnYou supportés

Une liste des composants crés par les développeur front de YesnYou spécialement pour leurs clients :lol:.
Une liste de certains d'entre eux :

* intro-anchor
* introjld
* multicam

  ... multicam component have an extra JSON file to generate items 'multicam-item-model'

* Scrolling

## Afficher les debugs
Si vous voulez afficher les debug des markers dans votre terminal, vous devrez éxécuter la commande ci-après :
```js
DEBUG=make***** index.js
```
Les étoiles représentent le nom du marker.

### TO DO

* Vérifier les arguments avant le démarrage du script
* Have to log supported marker
* Write test to check before start script if xlsx file is correct.
* Write test to check if makers works correctly
