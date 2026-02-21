// ===== FONCTIONS POUR LES QUIZ =====

/**
 * Vérifie la réponse à une question de quiz
 * @param {HTMLElement} option - L'élément cliqué
 * @param {string} expected - La valeur attendue (non utilisé directement)
 * @param {boolean} isCorrect - True si c'est la bonne réponse
 */
function checkAnswer(option, expected, isCorrect) {
    // Désactiver toutes les options dans ce quiz
    const container = option.closest('.quiz-container');
    const options = container.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.6';
    });
    
    // Trouver le résultat
    const resultDiv = container.querySelector('.quiz-result');
    
    // Afficher le résultat
    if (isCorrect) {
        resultDiv.className = 'quiz-result success';
        resultDiv.innerHTML = '✅ Bravo ! C\'est la bonne réponse.';
        option.style.background = '#d4edda';
        option.style.borderColor = '#28a745';
    } else {
        resultDiv.className = 'quiz-result error';
        resultDiv.innerHTML = '❌ Ce n\'est pas la bonne réponse. Essaie encore !';
        option.style.background = '#f8d7da';
        option.style.borderColor = '#dc3545';
        
        // Mettre en évidence la bonne réponse
        options.forEach(opt => {
            // Vérifie si l'option contient le symbole ✓ ou si l'attribut onclick contient 'true'
            if (opt.innerText.includes('✓') || opt.getAttribute('onclick').includes('true')) {
                opt.style.background = '#d4edda';
                opt.style.borderColor = '#28a745';
            }
        });
    }
}

/**
 * Réinitialise tous les quiz
 */
function resetQuiz() {
    const containers = document.querySelectorAll('.quiz-container');
    containers.forEach(container => {
        const options = container.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.style.pointerEvents = 'auto';
            opt.style.opacity = '1';
            opt.style.background = 'white';
            opt.style.borderColor = '#e0e0e0';
        });
        
        const resultDiv = container.querySelector('.quiz-result');
        resultDiv.className = 'quiz-result';
        resultDiv.innerHTML = '';
    });
}

/**
 * Filtre le tableau des raccourcis (pour exercice interactif)
 * @param {string} input - La recherche de l'utilisateur
 */
function filterTable(input) {
    const filter = input.value.toUpperCase();
    const table = document.getElementById("raccourcisTable");
    const tr = table.getElementsByTagName("tr");
    
    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td");
        let found = false;
        for (let j = 0; j < td.length; j++) {
            if (td[j] && td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        tr[i].style.display = found ? "" : "none";
    }
}

// ===== FONCTIONS D'INTERFACE =====

/**
 * Met en évidence le lien de navigation actif
 */
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Exécuter quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    setActiveNav();
    
    // Ajouter un écouteur pour le champ de recherche s'il existe
    const searchInput = document.getElementById('searchRaccourcis');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            filterTable(this);
        });
    }
});

// ===== FONCTIONS POUR EXERCICES INTERACTIFS =====

/**
 * Vérifie un exercice de type "texte à trous"
 * @param {number} exerciceId - L'ID de l'exercice
 * @param {string} bonneReponse - La réponse attendue
 */
function verifierExercice(exerciceId, bonneReponse) {
    const input = document.getElementById('ex' + exerciceId);
    const resultat = document.getElementById('res' + exerciceId);
    
    if (input.value.trim().toUpperCase() === bonneReponse.toUpperCase()) {
        resultat.innerHTML = '✅ Correct !';
        resultat.style.color = 'green';
        input.style.borderColor = 'green';
    } else {
        resultat.innerHTML = '❌ Faux. Réponse : ' + bonneReponse;
        resultat.style.color = 'red';
        input.style.borderColor = 'red';
    }
}
