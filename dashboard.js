// ============================================
// STRUCTURE DE DONNÉES
// ============================================

let pedagogieData = {
    classes: [
        {
            id: 'seconde',
            name: 'Seconde',
            level: 'lycee',
            color: '#3498db',
            subjects: [
                {
                    id: 'bureautique',
                    name: 'Bureautique',
                    description: 'Maîtrise des outils bureautiques',
                    icon: '💻',
                    chapters: [
                        {
                            id: 'word-bases',
                            title: 'Word - Les bases',
                            fundamentals: {
                                objectives: 'Savoir créer et mettre en forme un document',
                                keyPoints: 'Raccourcis, styles, mise en page',
                                resources: 'Tutoriels vidéo, exercices pratiques'
                            },
                            quiz: [
                                {
                                    question: 'Quel raccourci pour copier ?',
                                    options: ['Ctrl+X', 'Ctrl+C', 'Ctrl+V', 'Ctrl+Z'],
                                    correct: 1
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    currentClass: null,
    currentSubject: null,
    currentChapter: null
};

// Charger les données sauvegardées
const savedData = localStorage.getItem('pedagogieData');
if (savedData) {
    pedagogieData = JSON.parse(savedData);
}

// ============================================
// GESTION DE LA HIÉRARCHIE
// ============================================

let currentView = 'classes';
let currentClassId = null;
let currentSubjectId = null;

function loadView(view, classId = null, subjectId = null) {
    currentView = view;
    currentClassId = classId;
    currentSubjectId = subjectId;
    
    updateHierarchyNav();
    
    switch(view) {
        case 'classes':
            displayClasses();
            break;
        case 'subjects':
            displaySubjects(classId);
            break;
        case 'chapters':
            displayChapters(classId, subjectId);
            break;
    }
}

function updateHierarchyNav() {
    const nav = document.getElementById('hierarchyNav');
    let html = '<span class="hierarchy-item" onclick="loadView(\'classes\')">📚 Classes</span>';
    
    if (currentClassId) {
        const classe = pedagogieData.classes.find(c => c.id === currentClassId);
        if (classe) {
            html += `<span class="hierarchy-separator">›</span>`;
            html += `<span class="hierarchy-item" onclick="loadView('subjects', '${currentClassId}')">${classe.name}</span>`;
        }
    }
    
    if (currentSubjectId) {
        const classe = pedagogieData.classes.find(c => c.id === currentClassId);
        const subject = classe?.subjects.find(s => s.id === currentSubjectId);
        if (subject) {
            html += `<span class="hierarchy-separator">›</span>`;
            html += `<span class="hierarchy-item active">${subject.name}</span>`;
        }
    }
    
    nav.innerHTML = html;
}

// ============================================
// AFFICHAGE DES CLASSES
// ============================================

function displayClasses() {
    const content = document.getElementById('mainContent');
    
    let html = `
        <div class="classes-header">
            <h2>📚 Classes</h2>
            <button onclick="showModal('classModal')" class="btn-primary">➕ Nouvelle classe</button>
        </div>
        <div class="classes-grid">
    `;
    
    pedagogieData.classes.forEach(classe => {
        const subjectCount = classe.subjects?.length || 0;
        const chapterCount = classe.subjects?.reduce((acc, s) => acc + (s.chapters?.length || 0), 0) || 0;
        
        html += `
            <div class="class-card" onclick="loadView('subjects', '${classe.id}')" style="--class-color: ${classe.color}">
                <div class="class-header">
                    <h3 class="class-title">${classe.name}</h3>
                    <span class="class-level">${getLevelLabel(classe.level)}</span>
                </div>
                <div class="class-stats">
                    <span>📚 ${subjectCount} matière${subjectCount > 1 ? 's' : ''}</span>
                    <span>📖 ${chapterCount} chapitre${chapterCount > 1 ? 's' : ''}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// ============================================
// AFFICHAGE DES MATIÈRES
// ============================================

function displaySubjects(classId) {
    const classe = pedagogieData.classes.find(c => c.id === classId);
    if (!classe) return;
    
    const content = document.getElementById('mainContent');
    
    let html = `
        <div class="subjects-header">
            <button onclick="loadView('classes')" class="back-button">← Retour aux classes</button>
            <h2>📚 ${classe.name} - Matières</h2>
            <button onclick="showModal('subjectModal')" class="btn-primary">➕ Nouvelle matière</button>
        </div>
        <div class="subjects-grid">
    `;
    
    (classe.subjects || []).forEach(subject => {
        const chapterCount = subject.chapters?.length || 0;
        
        html += `
            <div class="subject-card" onclick="loadView('chapters', '${classId}', '${subject.id}')">
                <div class="subject-icon">${subject.icon}</div>
                <h3 class="subject-title">${subject.name}</h3>
                <p class="subject-description">${subject.description || ''}</p>
                <div class="subject-meta">
                    <span>📖 ${chapterCount} chapitre${chapterCount > 1 ? 's' : ''}</span>
                    <span>✏️ ${getQuizCount(subject)} quiz</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// ============================================
// AFFICHAGE DES CHAPITRES
// ============================================

function displayChapters(classId, subjectId) {
    const classe = pedagogieData.classes.find(c => c.id === classId);
    const subject = classe?.subjects.find(s => s.id === subjectId);
    if (!classe || !subject) return;
    
    const content = document.getElementById('mainContent');
    
    let html = `
        <div class="chapters-header">
            <button onclick="loadView('subjects', '${classId}')" class="back-button">← Retour aux matières</button>
            <h2>📚 ${classe.name} - ${subject.name}</h2>
            <button onclick="showModal('chapterModal')" class="btn-primary">➕ Nouveau chapitre</button>
        </div>
        <div class="chapters-grid">
    `;
    
    (subject.chapters || []).forEach(chapter => {
        html += `
            <div class="chapter-card">
                <h3 class="chapter-title">${chapter.title}</h3>
                
                <div class="chapter-preview">
                    <div class="preview-section">
                        <h4>Objectifs</h4>
                        <div class="preview-content">${stripHtml(chapter.fundamentals?.objectives || '')}</div>
                    </div>
                    
                    <div class="preview-section">
                        <h4>Quiz</h4>
                        <div class="preview-content">${chapter.quiz?.length || 0} questions</div>
                    </div>
                </div>
                
                <div class="chapter-actions">
                    <button onclick="editFundamentals('${classId}', '${subjectId}', '${chapter.id}')" class="btn-edit">
                        ✏️ Modifier
                    </button>
                    <button onclick="viewQuiz('${classId}', '${subjectId}', '${chapter.id}')" class="btn-view">
                        📝 Voir quiz
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// ============================================
// CRÉATION D'UNE CLASSE
// ============================================

function createClass(event) {
    event.preventDefault();
    
    const newClass = {
        id: generateId(document.getElementById('className').value),
        name: document.getElementById('className').value,
        level: document.getElementById('classLevel').value,
        color: document.getElementById('classColor').value,
        subjects: []
    };
    
    pedagogieData.classes.push(newClass);
    saveData();
    closeModal('classModal');
    displayClasses();
}

// ============================================
// CRÉATION D'UNE MATIÈRE
// ============================================

function createSubject(event) {
    event.preventDefault();
    
    const newSubject = {
        id: generateId(document.getElementById('subjectName').value),
        name: document.getElementById('subjectName').value,
        description: document.getElementById('subjectDescription').value,
        icon: document.getElementById('subjectIcon').value,
        chapters: []
    };
    
    const classe = pedagogieData.classes.find(c => c.id === currentClassId);
    if (classe) {
        if (!classe.subjects) classe.subjects = [];
        classe.subjects.push(newSubject);
        saveData();
        closeModal('subjectModal');
        displaySubjects(currentClassId);
    }
}

// ============================================
// GESTION DU CHAPITRE (AVEC QUIZ)
// ============================================

let questions = [];

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tab === 'fundamentals') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('fundamentalsTab').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('quizTab').classList.add('active');
    }
}

function addQuestion() {
    const questionId = Date.now();
    const questionHtml = `
        <div class="question-card" id="question-${questionId}">
            <div class="question-header">
                <span class="question-number">Question ${questions.length + 1}</span>
                <button type="button" onclick="removeQuestion(${questionId})" class="remove-question">🗑️</button>
            </div>
            <div class="question-text">
                <input type="text" placeholder="Votre question..." onchange="updateQuestion(${questionId}, 'text', this.value)">
            </div>
            <div class="options-container">
                ${[0,1,2,3].map(i => `
                    <div class="option-item">
                        <input type="radio" name="correct-${questionId}" value="${i}" onchange="setCorrectAnswer(${questionId}, ${i})">
                        <input type="text" placeholder="Option ${i+1}" onchange="updateQuestion(${questionId}, 'option${i}', this.value)">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('questionsList').insertAdjacentHTML('beforeend', questionHtml);
    
    questions.push({
        id: questionId,
        text: '',
        options: ['', '', '', ''],
        correct: null
    });
}

function removeQuestion(questionId) {
    document.getElementById(`question-${questionId}`).remove();
    questions = questions.filter(q => q.id !== questionId);
}

function updateQuestion(questionId, field, value) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        if (field === 'text') {
            question.text = value;
        } else if (field.startsWith('option')) {
            const index = parseInt(field.replace('option', ''));
            question.options[index] = value;
        }
    }
}

function setCorrectAnswer(questionId, optionIndex) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.correct = optionIndex;
    }
}

function createChapter(event) {
    event.preventDefault();
    
    const chapterTitle = document.getElementById('chapterTitle').value;
    
    // Récupérer le contenu des éditeurs (à initialiser avec Quill)
    const fundamentals = {
        objectives: document.getElementById('objectivesEditor').innerHTML || '',
        keyPoints: document.getElementById('keyPointsEditor').innerHTML || '',
        resources: document.getElementById('resourcesEditor').innerHTML || ''
    };
    
    const newChapter = {
        id: generateId(chapterTitle),
        title: chapterTitle,
        fundamentals: fundamentals,
        quiz: questions.filter(q => q.text && q.correct !== null && q.options.every(o => o))
    };
    
    const classe = pedagogieData.classes.find(c => c.id === currentClassId);
    const subject = classe?.subjects.find(s => s.id === currentSubjectId);
    
    if (subject) {
        if (!subject.chapters) subject.chapters = [];
        subject.chapters.push(newChapter);
        saveData();
        closeModal('chapterModal');
        displayChapters(currentClassId, currentSubjectId);
        
        // Réinitialiser le formulaire
        document.getElementById('chapterForm').reset();
        questions = [];
        document.getElementById('questionsList').innerHTML = '';
    }
}

// ============================================
// ÉDITION DES FONDAMENTAUX
// ============================================

function editFundamentals(classId, subjectId, chapterId) {
    const classe = pedagogieData.classes.find(c => c.id === classId);
    const subject = classe?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    
    if (chapter) {
        const modal = document.getElementById('editFundamentalsModal');
        const editor = document.getElementById('fundamentalsEditor');
        
        editor.innerHTML = `
            <h3>${chapter.title}</h3>
            <div class="form-group">
                <label>Objectifs :</label>
                <div id="editObjectives" class="rich-editor">${chapter.fundamentals?.objectives || ''}</div>
            </div>
            <div class="form-group">
                <label>Points clés :</label>
                <div id="editKeyPoints" class="rich-editor">${chapter.fundamentals?.keyPoints || ''}</div>
            </div>
            <div class="form-group">
                <label>Ressources :</label>
                <div id="editResources" class="rich-editor">${chapter.fundamentals?.resources || ''}</div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Sauvegarder le contexte pour la sauvegarde
        window.currentEditContext = { classId, subjectId, chapterId };
    }
}

function saveFundamentals() {
    const context = window.currentEditContext;
    if (!context) return;
    
    const classe = pedagogieData.classes.find(c => c.id === context.classId);
    const subject = classe?.subjects.find(s => s.id === context.subjectId);
    const chapter = subject?.chapters.find(c => c.id === context.chapterId);
    
    if (chapter) {
        chapter.fundamentals = {
            objectives: document.getElementById('editObjectives')?.innerHTML || '',
            keyPoints: document.getElementById('editKeyPoints')?.innerHTML || '',
            resources: document.getElementById('editResources')?.innerHTML || ''
        };
        
        saveData();
        closeModal('editFundamentalsModal');
        displayChapters(context.classId, context.subjectId);
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function generateId(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-');
}

function getLevelLabel(level) {
    const labels = {
        'lycee': 'Lycée',
        'college': 'Collège',
        'autre': 'Autre'
    };
    return labels[level] || level;
}

function getQuizCount(subject) {
    return subject.chapters?.reduce((acc, ch) => acc + (ch.quiz?.length || 0), 0) || 0;
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function saveData() {
    localStorage.setItem('pedagogieData', JSON.stringify(pedagogieData));
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialisation des éditeurs riches
document.addEventListener('DOMContentLoaded', function() {
    displayClasses();
    
    // Initialiser les éditeurs Quill quand les modals sont ouverts
    // (à implémenter selon vos besoins)
});

// Fermer les modals en cliquant dehors
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};