# JS_projet

 # Explication détaillée du code du jeu JUST ONE

## Présentation générale du jeu

Le jeu **Just One** se base sur des mots mystères et des indices fournis par les joueurs pour deviner ce mot. À la fin de chaque round, le joueur doit deviner le mot mystère en fonction des indices donnés par les autres joueurs. Le score est mis à jour en fonction de la validité des indices (doublons ou non) et si la devinette est correcte.

## Structure du code

Le code est principalement composé de 3 grandes sections :
1. **Initialisation du jeu** (listes, variables)
2. **Interaction avec les joueurs** (saisie des indices, devinette)
3. **Gestion de la logique du jeu** (validation des indices, calcul du score)

## Explication détaillée des fonctions et de leur rôle

### 1. Interface utilisateur (lecture/écriture)

```javascript
const readline = require("readline");
```

- **readline** est un module Node.js utilisé pour interagir avec l'utilisateur via la ligne de commande.
- Cela permet de poser des questions et de récupérer les réponses de manière interactive.

### 2. Initialisation du jeu

#### Variables globales :

```javascript
const motsMysteres = ["soleil", "chocolat", "aventure", "musique", "mystère"];
let round = 0; // Suivi du round actuel
let indices = []; // Liste des indices pour un round
let joueurs = 5; // Nombre de joueurs
let indexJoueur = 0; // Suivi du joueur actuel
let score = 0; // Compteur de points
let logPropositions = []; // Stocke toutes les propositions pour l'écriture dans le fichier
```

- **`motsMysteres`** : C'est la liste des mots mystères que les joueurs devront deviner. Ces mots sont pré-définis dans le tableau.
- **`round`** : C'est le compteur du round actuel. Le jeu commencera avec `round = 0` et se terminera une fois que tous les mots mystères auront été utilisés.
- **`indices`** : Ce tableau stocke les indices donnés par chaque joueur durant un round.
- **`joueurs`** : Le nombre de joueurs (ici, fixé à 5).
- **`indexJoueur`** : C'est l'index qui suit le joueur actuel, de sorte que le jeu demande un indice à chaque joueur tour à tour.
- **`score`** : Le score du joueur est comptabilisé ici. Il sera ajusté en fonction de la réussite ou de l'échec dans la devinette et la validation des indices.
- **`logPropositions`** : Un tableau où toutes les propositions des joueurs sont enregistrées pour être écrites dans un fichier à la fin de chaque round.

### 3. Fonction `lancerRound()`

```javascript
function lancerRound() {
    if (round < motsMysteres.length) {
        indices = []; // Réinitialiser les indices
        indexJoueur = 0; // Réinitialiser le compteur de joueur
        console.log(`
Round ${round + 1}: Le mot mystère est "${motsMysteres[round]}" (gardez-le secret !)`);
        
        // Demander les indices à chaque joueur
        demanderIndices();
    } else {
        afficherScoreFinal();
        rl.close();
    }
}
```

- Cette fonction est utilisée pour démarrer un **nouveau round**.
- Si le **round actuel** est inférieur au nombre total de mots mystères, elle réinitialise les indices et le compteur de joueurs (`indexJoueur`), puis demande à chaque joueur de fournir un indice.
- Si le jeu a atteint la fin des mots mystères (fin des rounds), le score final est affiché et le jeu se termine.

### 4. Fonction `demanderIndices()`

```javascript
function demanderIndices() {
    if (indexJoueur < joueurs) {
        rl.question(`Joueur ${indexJoueur + 1}, entrez votre indice : `, (mot) => {
            indices.push(mot.toLowerCase().trim());
            indexJoueur++;
            demanderIndices();
        });
    } else {
        verifierIndices();
    }
}
```

- **Objectif :** Cette fonction demande à chaque joueur (un par un) d'entrer un indice. La fonction est appelée de manière récursive pour chaque joueur tant que `indexJoueur` est inférieur au nombre total de joueurs.
- **`rl.question()`** : Affiche un message pour inviter le joueur à saisir un indice. Une fois que le joueur a répondu, cet indice est **ajouté au tableau `indices`**, et le compteur `indexJoueur` est incrémenté.
- Lorsque tous les joueurs ont donné un indice, la fonction **appelle `verifierIndices()`** pour vérifier et traiter les indices.

### 5. Fonction `verifierIndices()`

```javascript
function verifierIndices() {
    let occurrences = {};

    // Comptage des occurrences de chaque mot
    indices.forEach(mot => {
        occurrences[mot] = (occurrences[mot] || 0) + 1;
    });

    // On garde uniquement les mots uniques (1 seule occurrence)
    let indicesValides = indices.filter(mot => occurrences[mot] === 1);

    // Enregistrer les propositions dans un fichier
    logPropositions.push(`Round ${round + 1} : ${indices.join(", ")}`);
    fs.writeFileSync("propositions.txt", logPropositions.join("
"), "utf-8");

    // Afficher les indices valides avant la devinette
    console.log("
Indices valides :");
    console.log(indicesValides.length > 0 ? indicesValides.join(", ") : "Aucun indice valide... 😢");

    // Demander à l'utilisateur de deviner le mot mystère
    rl.question(`Devinez le mot mystère (Round ${round + 1}): `, (devinette) => {
        // Vérifier si la devinette est correcte
        if (devinette.toLowerCase().trim() === motsMysteres[round].toLowerCase()) {
            score += 1;
            console.log("
🎉 Round validé ! (+1 point)");
        } else {
            score -= 1;
            console.log("
🚫 Round non validé (mot mystère incorrect). (-1 point)");
        }

        // Passer au round suivant
        round++;
        setTimeout(lancerRound, 2000); // Attente de 2 secondes avant de démarrer le prochain round
    });
}
```

- **Objectif :** Cette fonction sert à **vérifier et traiter les indices** fournis par les joueurs.
- Elle **compte les occurrences de chaque indice** dans le tableau `indices` afin de détecter les doublons.
- Les indices **valides** (c'est-à-dire ceux qui apparaissent une seule fois) sont extraits et affichés à l'utilisateur avant qu'il ne devine le mot mystère.
- Ensuite, le joueur est invité à **deviner le mot mystère**. Si la devinette est correcte, **+1 point** est attribué au score, sinon **-1 point**.
- Enfin, le round suivant est lancé après un délai de 2 secondes.

### 6. Fonction `afficherScoreFinal()`

```javascript
function afficherScoreFinal() {
    console.log(`
🏁 Jeu terminé !`);
    console.log(`Votre score final est : ${score} point(s)`);
}
```

- **Objectif :** Cette fonction affiche le score final du joueur une fois que tous les rounds ont été joués.
- Elle est appelée à la fin du jeu lorsque tous les mots mystères ont été devinés.

### Sauvegarde des propositions dans un fichier

```javascript
fs.writeFileSync("propositions.txt", logPropositions.join("
"), "utf-8");
```

- **fs.writeFileSync()** : Cette méthode permet d'écrire de manière synchrone dans un fichier **`propositions.txt`**.
- Chaque round avec les indices des joueurs est sauvegardé dans ce fichier, permettant ainsi de garder un historique des propositions et de la partie.

## Résumé global du flux du jeu
1. **Initialisation** : Le jeu commence avec une liste de mots mystères.
2. **Demande des indices** : Les joueurs donnent chacun un indice.
3. **Vérification des indices** : Les indices sont analysés pour détecter les doublons et ceux valides sont affichés.
4. **Devinette du mot mystère** : Le joueur tente de deviner le mot mystère en fonction des indices.
5. **Calcul du score** : Le score est ajusté en fonction de la réussite ou de l'échec de la devinette.
6. **Fichier de sauvegarde** : Les propositions de chaque round sont sauvegardées dans un fichier pour garder une trace de la partie.

## Conclusion
Ce code représente une version simple mais complète du jeu **Just One**, où la logique principale est de donner des indices, deviner le mot mystère, et mettre à jour un score. La fonctionnalité de sauvegarde des propositions dans un fichier permet de conserver un historique du jeu. Ce jeu peut être amélioré avec des fonctionnalités supplémentaires comme un système de chronomètre ou des niveaux de difficulté.
