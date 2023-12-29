Msc. project for the Web Applications and Systems course.

Tema: Social Good, con accenni alla Sustainability.

Intersezioni: Gamification, Data Visualization e IoT.

- Il gruppo si pone l’obiettivo di realizzare un’applicazione web per la condivisione di materiale didattico (appunti e libri di testo) tra studenti all’interno del Nuovo Campus di Cesena.

- Il sistema dovrà prevedere un meccanismo di autenticazione attraverso il quale gli utenti potranno accedere all’applicazione. Ogni utente autenticato potrà rendere disponibili documenti o richiedere in prestito materiale didattico ad altri studenti, e il sistema dovrà gestire prestito e restituzione di documenti.

- Gli utenti che hanno bisogno di materiale trarrebbero vantaggi dall’applicazione, mentre chi lo rende disponibile sarebbe ricompensato soltanto “moralmente”. Per questo motivo, l’applicazione tenterà di incentivare gli studenti che presteranno il proprio materiale premiandoli con delle ricompense.

- Dopo aver restituito un documento ricevuto in prestito, un utente potrà scrivere una recensione relativa ad esso per aiutare altri studenti nella scelta del materiale. Allo stesso modo, al termine di un prestito, l’utente che ha messo a disposizione il documento potrà lasciare un feedback relativo all’utente a cui lo ha prestato. Sarà così possibile segnalare eventuali inadempienze (mancata riconsegna del materiale, scadenze non rispettate, materiale rovinato).

- Le recensioni e i feedback inseriti, per poter essere utili agli utenti, dovranno essere considerati validi dal sistema (e quindi rispettare alcune regole imposte) e consentiranno ai loro autori di ottenere altre ricompense.

- Per ogni documento inserito nel sistema sarà necessario specificare corso di laurea, anno accademico e materia, in modo da facilitare la ricerca del materiale. Sarà infatti possibile visualizzare il materiale disponibile applicando filtri differenti, anche contemporaneamente. Le recensioni inserite consentiranno inoltre di ordinare i documenti in base al punteggio medio ottenuto.

- Le ricompense accumulate potranno essere convertite in credito utilizzabile nella “Casina dell’acqua” del Nuovo Campus, per incoraggiare gli studenti a ridurre il consumo di bottiglie di plastica. Questo sarà possibile grazie alla comunicazione tra l’applicazione e delle smart card usabili nella “Casina dell’acqua”, dispositivi connessi alla rete che potranno essere ricaricati grazie all’applicazione (il comportamento delle smart card sarà simulato).




PER FAR ANDARE MONGO DB:

- Posizionarsi nella cartella 'C:\Program Files\MongoDB\Server\4.2\bin' (o simile... dipende dal computer).

- Lanciare il comando 'mongod' dalla stessa cartella (credo serve a lanciare il server di mongodb.

- Per lanciare il client: aprire un altro prompt, posizionarsi nella stessa cartella e lanciare il comando 'mongo'.




PER IMPORTARE DB:

- Andare nella cartella bin.

- Copiare il percorso della cartella db almanotes dentro a db esame (è nel repo).

- Digitare il comando mongostore -d dbalmanotes percorso (comando qui sotto). 

mongorestore -d dbalmanotes C:\Users\tomma\Desktop\almanotes\Db Esame\dbalmanotes




RECENSIONI NON ACCETTATE:

- Il documento fa schifo e il proprietario è una persona odiosa e insopportabile.

- Nome è irrispettoso e antipatico. Fa schifo!
