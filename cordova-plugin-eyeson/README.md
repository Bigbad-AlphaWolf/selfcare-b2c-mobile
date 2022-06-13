# SelfcareB2C

Ceci est la version cordova du plugin EyesOn.
Ce plugin est distribuée par la société SoftAtHome. Ma contribution personnelle a consisté à ajouter
la partie wrapper pour l'intégration sur un code typescript.
Ainsi donc comme la plupart des plugins Cordova, pour l'utiliser il faudra:
1 - L'ajouter aux provider en important EyesOn. (import { EyesOn } from 'cordova-plugin-eyeson/ngx')

2 - Injecter le service eyesOn dans le constructeur de la classe où vous voulez l'utiliser.

3 - Pour le moment il y a que 3 méthodes qui sont exposées à savoir:
   initAgent(), startAgent() et getDqaID()

