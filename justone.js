const fs = require("fs"); // // Import file system module
const readline = require("readline"); // module pour des interactions dans l'invité de commande

// Interface pour entrer du texte dans le terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Liste des mots mystères
const motsMysteres = ["soleil", "chocolat", "aventure", "musique", "mystère"];
let round = 0; // Suivi du round actuel
let indices = []; // Liste des indices pour un round
let joueurs = 5; // Nombre de joueurs
let indexJoueur = 0; // Suivi du joueur actuel
let score = 0; // Compteur de points
let logPropositions = []; // Stocke toutes les propositions pour l'écriture dans le fichier

console.log("🎲 Bienvenue dans le jeu JUST ONE !");
console.log(`📝 Il y aura ${motsMysteres.length} rounds.`);

// Fonction principale pour démarrer un round
function lancerRound() {
    if (round < motsMysteres.length) {
        indices = []; // Réinitialiser les indices
        indexJoueur = 0; // Réinitialiser le compteur de joueur
        console.log(`\nRound ${round + 1}: Le mot mystère est "${motsMysteres[round]}" (gardez-le secret !)`);

        // Demander les indices à chaque joueur
        demanderIndices();
    } 
    else {
        afficherScoreFinal();
        rl.close();
    }
}

// Fonction pour demander un indice à chaque joueur
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

// Fonction pour vérifier les indices et afficher les valides avant la devinette
function verifierIndices() {
    let occurrences = {};

    // Comptage des occurrences de chaque mot
    indices.forEach(mot => {
        occurrences[mot] = (occurrences[mot] || 0) + 1;});

    console.log(occurrences);
    console.log(indices);    
    // On garde uniquement les mots uniques (1 seule occurrence)
    let indicesValides = indices.filter(mot => occurrences[mot] === 1);

    // Enregistrer les propositions dans un fichier
    logPropositions.push(`Round ${round + 1} : ${indices.join(", ")}`);
    fs.writeFileSync("propositions.txt", logPropositions.join("\n"), "utf-8");

    // Afficher les indices valides avant la devinette
    let msg = "";
    if (indicesValides.length > 0)  {msg = indicesValides.join(", ")} else (msg = "Aucun indice valide... 😢");
    console.log("\nIndices valides :");
    console.log(msg);

    // Demander à l'utilisateur de deviner le mot mystère
    rl.question(`Devinez le mot mystère (Round ${round + 1}): `, (reponse) => {
        // Vérifier si la reponse est correcte
        if (reponse.toLowerCase().trim() === motsMysteres[round].toLowerCase()) {
            score += 1;
            console.log("\n🎉 Round validé ! (+1 point)");
        } else {
            score -= 1;
            console.log("\n🚫 Round non validé (mot mystère incorrect). (-1 point)");
        }

        // Passer au round suivant
        round++;
        setTimeout(lancerRound, 2000); // Attente de 2 secondes avant de démarrer le prochain round
    });
}

// Afficher le score final
function afficherScoreFinal() {
    console.log(`\n🏁 Jeu terminé !`);
    console.log(`Votre score final est : ${score} point(s)`);
}

// Lancer le premier round
lancerRound();
