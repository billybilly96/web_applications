export default {
    data: () => ({
        links: [
            { text: "Ricerca Libri", route: "/document-search/book", auth: false, icon: "menu_book" },
            { text: "Ricerca Appunti", route: "/document-search/note", auth: false, icon: "notes" },
            { text: "Prestiti Ottenuti", route: "/loans-obtained/loan", auth: true, icon: "call_received" },
            { text: "Prestiti Concessi", route: "/loans-granted/loan", auth: true, icon: "call_made" },
            { text: "Profilo e Documenti", route: "/personal-profile", auth: true, icon: "dashboard" },
            { text: "Punteggio e Ricompense", route: "/personal-score", auth: true, icon: "score" }
        ]
    })
}