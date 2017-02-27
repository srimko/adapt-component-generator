# Component Generator for Adapt

Component generator is a simple script to generate component for Adapt.

## Start script

You must lauch this command to start the script :
```js
node index.js src/component_list.xlsx
```

If you start the script whitout file source, the script will automatically launch with this argument ``src/component_list.xlsx``. Don't be afraid nothing will be execute, the script will return an error.



### Default component supported

You can find all components supported inside model directory. Here a list of them :

* block
* grahic
* mcq

  ... mcq component have an extra JSON file to generate items 'mcq-item-model'

* media

  ... media component have an extra JSON file to generate items 'media-item-model'

* narrative

  ... narrative component have an extra JSON file to generate items 'narrative-item-model'


### How to make your makers

Commencer par créer le modèle JSON et le placer dans le répoertoire model. Il faut maintenant créer le marker.


### YesnYou component supported

Here a list of components created by YesnYou's front developer specialy for their clients. Here a list of them :

* intro-anchor
* introjld
* multicam

  ... multicam component have an extra JSON file to generate items 'multicam-item-model'

* Scrolling

## Display debug
If you want to display marker's debug in your terminal, you should excecute a command like
```js
DEBUG=make***** index.js
```

Stars are the name of the marker exemple. The first letter must be uppercase ex :makeNarrative, makeMcq

### To do

* Have to check argument before start script
* Have to log supported marker
* Write test to check before start script if xlsx file is correct.
* Write test to check if makers works correctly
