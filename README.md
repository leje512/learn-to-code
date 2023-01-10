# Interaktive Webanwendung zum Lernen von Programmieren

## Bachelorprojekt im Studiengang Interaktive Medien

Ziel des Projektes war auf der Grundlage einer Recherche zu Programmierproblemen bei Anfängern eine interaktive Webanwendung zum Lernen von Programmieren umzusetzen. Daraus ist dieses MVP entstanden. Das interaktive Tutorial umfasst mehrere Übungsaufgaben in einer minimalistischen Programmierumgebung - mit automatischen Tests zum Erkennen der Richtigkeit sowie mit einem Tutor, der Fehler und Probleme erkennt und mehrstufige Tipps gibt.

## Projekt starten

Um die Anwendung zu starten, muss Node.js installiert sein. Dies kann [hier](https://nodejs.org/en/download/) nachgeholt werden. Die aktuell verwendete Node-Version des Projekts ist in der Datei .nvmrc angegeben.

Als nächstes wird der Package-Manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) benötigt. Dieser kann mit dem folgenden Befehl installiert werden:
``
npm install -g npm
``

Anschließend kann das Projekt über github geklont werden.

Um eine Vorschau des Projekts im lokalen Produktionsmodus zu sehen, gebe folgende Befehle im Terminal ein:

```
cd codingtutorial
npm i
npm run build
npm run preview
```

Für den Entwicklermodus werden folgende Befehle verwendet:

```
cd codingtutorial
npm i
npm run dev
```

## Automatisierte Tests

Für das einfacher Refactoring und das Testen der Fehlerkennung wurden mithilfe von mocha Tests für die einzelnen Fehlerfälle geschrieben. Diese befinden sich in der Datei errorMessages.test.js, dort sind also auch Codebeispiele für die einzelnen Fehlerfälle hinterlegt. Für jede Fehlerüberprüfung gibt es mindestens einen Fall, der nicht als Fehler erkannt wird und mindestens einen Fall, der einen Fehler anzeigt. Die Tests können mit folgendem Befehl gestartet werden:

```
npm run test
```
