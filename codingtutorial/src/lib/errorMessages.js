const errorConsoleLogNotInBody = [
  "Achte darauf, if-else richtig zu verwenden. Der Code innerhalb der if-Anweisung wird ausgeführt, wenn die Bedingung true ergibt. Der Code innerhalb von else wird ausgeführt, wenn die Kondition false ist.",
  "Code außerhalb von if-else wird immer ausgeführt.",
  "console.log('Auf Wiedersehen'); sollte nicht in if-else enthalten sein. Stattdessen wird diese danach ausgeführt.",
]

const errorSwitchedCompareSymbol = [
  "Das Gleichheitszeichen befindet sich bei Vergleichsoperatoren immer hinten.",
  "Mögliche Vergleichsoperatoren sind <, >, <=, >=, != und ==.",
  "Benutze >= 5, um 'Bestanden' anzuzeigen.",
]

const errorMissingIf = [
  "Diese Aufgabe benötigt eine if- und else-Anweisung. Sind beide Teil des Codes?",
  `Die Syntax für eine if- und else-Anweisung sieht folgendermaßen aus:
if (kondition) {
  //code
} else {
  //code
}`,
  `Ergänze folgende Syntax um den richtigen Code:
if (punkte mindestens 5) {
  // drucke "Bestanden"
} else {
  // drucke "Durchgefallen"
}`,
]

export default {
  errorConsoleLogNotInBody,
  errorSwitchedCompareSymbol,
  errorMissingIf,
}
