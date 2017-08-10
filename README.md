# Générateur de composant pour adapt / ComponentGenerator V1.0.0

ComponentGenerator est un petit script permettant de générer le code source des fichiers articles blocks et composants d'un projet adapt.

## Pré requis

* Vous devez avoir node installer sur votre machine.
* Vous devez avoir un fichier component_list.xlsx structurer de la bonne manière.


## Démarrage du script

Vous devez lancer la commande suivant pour lancer le script
```js
node index.js src/component_list.xlsx
```

Si vous lancez la commande sans le fichier source le scirpt se lancera automatiquement avec cette argument ``src/component_list.xlsx``. Si le fichier envoyer en parametre n'existe pas le script vous enverra une erreur.

## Les composants de base supportés

Vous pourrez trouver tout les compodants supportés dans le répertoire `model`.
une liste de certains d'entre eux :

* block
* grahic
* mcq -> 'mcq-item-model'
* media -> 'media-item-model'
* narrative -> 'narrative-item-model'

## Comment fabriquer les makers

Commencer par créer le modèle JSON et le placer dans le répoertoire model. Il faut maintenant créer le marker.


### Les composants YesnYou supportés

Une liste des composants crés par les développeur front de YesnYou spécialement pour leurs clients :lol:.
Une liste de certains d'entre eux :

* intro-anchor et introjld (identique)
* multicam -> 'multicam-item-model'
* Scrolling (neccessite l'ajout de contenu après génération)

## Afficher les debugs

Si vous voulez afficher les debug des markers dans votre terminal, vous devrez éxécuter la commande ci-après :
```js
DEBUG=make***** index.js
```
Les étoiles représentent le nom du marker.

### TO DO

* Plein de chose :)
