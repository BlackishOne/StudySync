export type Language = 'en' | 'fr';

export const translations = {
    en: {
        common: {
            appName: "StudySync",
            export: "Export Data",
            import: "Import Data",
            level: "Level",
            days: "Days",
            xp: "XP",
        },
        sidebar: {
            dashboard: "Dashboard",
            courses: "Courses",
            tasks: "Tasks",
            calendar: "Calendar",
            flashcards: "Flashcards",
            focusMode: "Focus Mode",
            analytics: "Analytics",
            settings: "Settings",
        },
        dashboard: {
            welcome: "Welcome back,",
            subtitle: "Here's what's happening with your studies today",
            overview: "Here's your overview for today.",
            gpa: "Current GPA",
            gpaTarget: "Target",
            gpaMotivation: "Keep pushing!",
            gpaExcellent: "Excellent work!",
            activeTasks: "Active Tasks",
            studyTime: "Study Time",
            completedTasks: "completed tasks",
            todaysSchedule: "Today's Schedule",
            noEvents: "No tasks due today. Enjoy your free time!",
            viewCalendar: "View Full Calendar",
            loading: "Loading...",
            personal: "Personal",
            stats: {
                levelShort: "Lv",
                level: "Level",
                dayStreak: "Day Streak",
                xp: "XP"
            },
            kanban: {
                courses: {
                    title: "Courses",
                    description: "Manage your academic courses"
                },
                tasks: {
                    title: "Tasks",
                    description: "Track assignments & deadlines",
                    active: "active"
                },
                calendar: {
                    title: "Calendar",
                    description: "View your schedule"
                },
                flashcards: {
                    title: "Flashcards",
                    description: "Study with smart cards"
                },
                focus: {
                    title: "Focus Mode",
                    description: "Pomodoro timer"
                },
                analytics: {
                    title: "Analytics",
                    description: "Track your progress"
                },
                actions: {
                    open: "Open",
                    quickAdd: "Quick Add"
                },
                items: "items"
            },
            habits: {
                title: "Habit Tracker",
                placeholder: "Add a new habit...",
                empty: "No habits tracked yet."
            }
        },
        tasks: {
            boardTitle: "Task Board",
            addTask: "Add Task",
            columns: {
                todo: "To Do",
                inProgress: "In Progress",
                completed: "Completed"
            },
            form: {
                title: "Add New Task",
                taskTitle: "Task Title",
                course: "Course",
                selectCourse: "Select a course",
                noCourse: "No Course (Personal)",
                type: "Type",
                priority: "Priority",
                grade: "Grade (Optional, %)",
                dueDate: "Due Date",
                pickDate: "Pick a date",
                save: "Save Task",
                types: {
                    assignment: "Assignment",
                    exam: "Exam",
                    studySession: "Study Session",
                    other: "Other"
                },
                priorities: {
                    low: "Low",
                    medium: "Medium",
                    high: "High"
                }
            }
        },
        courses: {
            title: "Courses",
            addCourse: "Add Course",
            credits: "Credits",
            viewTasks: "View Tasks",
            resources: "Resources",
            manageResources: "Manage Resources",
            delete: "Delete",
            form: {
                addTitle: "Add New Course",
                editTitle: "Edit Course",
                name: "Course Name",
                courseNamePlaceholder: "Calculus I",
                professor: "Professor",
                professorPlaceholder: "Dr. Smith",
                location: "Location / Room",
                locationPlaceholder: "Room 303",
                credits: "Credits",
                color: "Color",
                pickColor: "Pick a color",
                save: "Save Course",
                resourcesLabel: "Resource Links (One per line)",
                resourcesPlaceholder: "https://example.com/syllabus\nhttps://drive.google.com/..."
            },
            empty: "No courses added yet. Get started by adding one!"
        },
        calendar: {
            title: "Calendar",
            monthly: "Monthly View",
            timetable: "Weekly Timetable",
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            prev: "Previous",
            next: "Next",
            timetableGrid: {
                addSession: "Add Class Session",
                day: "Day",
                startTime: "Start Time",
                endTime: "End Time",
                type: "Type",
                room: "Room",
                save: "Save Session",
                lecture: "Lecture",
                lab: "Lab",
                tutorial: "Tutorial",
                seminar: "Seminar",
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                sunday: "Sunday"
            }
        },
        flashcards: {
            title: "Flashcards",
            createDeck: "Create New Deck",
            study: "Study Now",
            manage: "Manage Deck",
            cards: "Cards",
            empty: "No decks yet. Create one to start studying!",
            form: {
                title: "Create Deck",
                deckName: "Deck Name",
                deckNamePlaceholder: "e.g., Biology Chapter 1",
                course: "Course (Optional)",
                save: "Create Deck",
                addCard: "Add Card",
                front: "Front",
                back: "Back",
                saveCard: "Save Card",
                delete: "Delete"
            },
            studyMode: {
                complete: "Session Complete!",
                xpEarned: "XP Earned",
                close: "Close",
                flip: "Click card to flip",
                rate: "Rate your confidence",
                again: "Again (1m)",
                hard: "Hard (2d)",
                easy: "Easy (4d)"
            }
        },
        analytics: {
            title: "Analytics Dashboard",
            weeklyStudy: "Weekly Study Time",
            gradeDist: "Grade Distribution",
            gradeCalc: {
                title: "Grade Projector",
                currentGrade: "Current Grade (%)",
                weightCompleted: "Weight Completed (%)",
                targetGrade: "Target Grade (%)",
                calculate: "Calculate Required Score",
                result: "You need to average",
                onRemaining: "on your remaining work.",
                impossible: "It's mathematically impossible to reach this target.",
                secured: "You have already secured this grade!"
            }
        },
        focus: {
            work: "Work",
            shortBreak: "Short Break",
            longBreak: "Long Break",
            start: "Start",
            pause: "Pause",
            configure: "Configure",
            settings: "Timer Settings",
        }
    },
    fr: {
        common: {
            appName: "StudySync",
            export: "Exporter",
            import: "Importer",
            level: "Niveau",
            days: "Jours",
            xp: "XP",
        },
        sidebar: {
            dashboard: "Tableau de bord",
            courses: "Cours",
            tasks: "Tâches",
            calendar: "Calendrier",
            flashcards: "Cartes Mémoire",
            focusMode: "Mode Focus",
            analytics: "Analytique",
            settings: "Paramètres",
        },
        dashboard: {
            welcome: "Bon retour,",
            subtitle: "Voici ce qui se passe avec vos études aujourd'hui",
            overview: "Voici votre aperçu pour aujourd'hui.",
            gpa: "GPA Actuel",
            gpaTarget: "Cible",
            gpaMotivation: "Continuez comme ça !",
            gpaExcellent: "Excellent travail !",
            activeTasks: "Tâches Actives",
            studyTime: "Temps d'étude",
            completedTasks: "tâches terminées",
            todaysSchedule: "Programme du jour",
            noEvents: "Aucune tâche prévue aujourd'hui. Profitez de votre temps libre !",
            viewCalendar: "Voir le calendrier",
            loading: "Chargement...",
            personal: "Personnel",
            stats: {
                levelShort: "Nv",
                level: "Niveau",
                dayStreak: "Jours de Suite",
                xp: "XP"
            },
            kanban: {
                courses: {
                    title: "Cours",
                    description: "Gérer vos cours académiques"
                },
                tasks: {
                    title: "Tâches",
                    description: "Suivre devoirs et échéances",
                    active: "actives"
                },
                calendar: {
                    title: "Calendrier",
                    description: "Voir votre emploi du temps"
                },
                flashcards: {
                    title: "Cartes Mémoire",
                    description: "Étudier avec des cartes intelligentes"
                },
                focus: {
                    title: "Mode Focus",
                    description: "Minuteur Pomodoro"
                },
                analytics: {
                    title: "Analytique",
                    description: "Suivre votre progrès"
                },
                actions: {
                    open: "Ouvrir",
                    quickAdd: "Ajout Rapide"
                },
                items: "éléments"
            },
            habits: {
                title: "Suivi d'Habitudes",
                placeholder: "Ajouter une habitude...",
                empty: "Aucune habitude suivie."
            }
        },
        tasks: {
            boardTitle: "Tableau de Tâches",
            addTask: "Ajouter Tâche",
            columns: {
                todo: "À Faires",
                inProgress: "En Cours",
                completed: "Terminées"
            },
            form: {
                title: "Nouvelle Tâche",
                taskTitle: "Titre",
                course: "Cours",
                selectCourse: "Choisir un cours",
                noCourse: "Aucun Cours (Personnel)",
                type: "Type",
                priority: "Priorité",
                grade: "Note (Optionnel, %)",
                dueDate: "Date d'échéance",
                pickDate: "Choisir une date",
                save: "Enregistrer",
                types: {
                    assignment: "Devoir",
                    exam: "Examen",
                    studySession: "Séance d'étude",
                    other: "Autre"
                },
                priorities: {
                    low: "Bas",
                    medium: "Moyen",
                    high: "Haut"
                }
            }
        },
        courses: {
            title: "Cours",
            addCourse: "Ajouter Cours",
            credits: "Crédits",
            viewTasks: "Voir Tâches",
            resources: "Ressources",
            manageResources: "Gérer Ressources",
            delete: "Supprimer",
            form: {
                addTitle: "Nouveau Cours",
                editTitle: "Modifier Cours",
                name: "Nom du Cours",
                courseNamePlaceholder: "Calcul I",
                professor: "Professeur",
                professorPlaceholder: "Dr. Smith",
                location: "Salle / Lieu",
                locationPlaceholder: "Salle 303",
                credits: "Crédits",
                color: "Couleur",
                pickColor: "Choisir une couleur",
                save: "Enregistrer",
                resourcesLabel: "Liens Ressources (Un par ligne)",
                resourcesPlaceholder: "https://example.com/syllabus\n..."
            },
            empty: "Aucun cours ajouté. Commencez par en ajouter un !"
        },
        calendar: {
            title: "Calendrier",
            monthly: "Vue Mensuelle",
            timetable: "Emploi du Temps",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            prev: "Précédent",
            next: "Suivant",
            timetableGrid: {
                addSession: "Ajouter Séance",
                day: "Jour",
                startTime: "Heure Début",
                endTime: "Heure Fin",
                type: "Type",
                room: "Salle",
                save: "Enregistrer",
                lecture: "Cours Magistral",
                lab: "Labo / TD",
                tutorial: "Tutorat",
                seminar: "Séminaire",
                monday: "Lundi",
                tuesday: "Mardi",
                wednesday: "Mercredi",
                thursday: "Jeudi",
                friday: "Vendredi",
                saturday: "Samedi",
                sunday: "Dimanche"
            }
        },
        flashcards: {
            title: "Cartes Mémoire",
            createDeck: "Créer un paquet",
            study: "Étudier",
            manage: "Gérer",
            cards: "Cartes",
            empty: "Aucun paquet. Créez-en un pour commencer !",
            form: {
                title: "Créer Paquet",
                deckName: "Nom du Paquet",
                deckNamePlaceholder: "ex: Biologie Chap. 1",
                course: "Cours (Optionnel)",
                save: "Créer",
                addCard: "Ajouter Carte",
                front: "Recto",
                back: "Verso",
                saveCard: "Enregistrer",
                delete: "Supprimer"
            },
            studyMode: {
                complete: "Session Terminée !",
                xpEarned: "XP Gagnés",
                close: "Fermer",
                flip: "Cliquer pour retourner",
                rate: "Évaluez votre confiance",
                again: "À Revoir (1m)",
                hard: "Difficile (2j)",
                easy: "Facile (4j)"
            }
        },
        analytics: {
            title: "Tableau Analytique",
            weeklyStudy: "Temps d'Étude Hebdo",
            gradeDist: "Distribution des Notes",
            gradeCalc: {
                title: "Projecteur de Notes",
                currentGrade: "Note Actuelle (%)",
                weightCompleted: "Pondération Complétée (%)",
                targetGrade: "Note Visée (%)",
                calculate: "Calculer Score Requis",
                result: "Vous devez obtenir",
                onRemaining: "sur le reste du travail.",
                impossible: "Il est mathématiquement impossible d'atteindre cette cible.",
                secured: "Vous avez déjà sécurisé cette note !"
            }
        },
        focus: {
            work: "Travail",
            shortBreak: "Pause Courte",
            longBreak: "Pause Longue",
            start: "Démarrer",
            pause: "Pause",
            configure: "Configurer",
            settings: "Paramètres du minuteur",
        }
    }
};
