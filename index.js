const newGameForm = document.querySelector('#new-game')
const randomWordButton = document.querySelector('#random-word')

const phraseholder = document.querySelector('#phraseholder')
const optionsHolder = document.querySelector('#options')
const playAgainHolder = document.querySelector('#play-again')
const playAgainButton = document.querySelector('#play-again-button')

const params = new URLSearchParams(window.location.search)

const randomWordAPIURL = 'https://random-word-api.herokuapp.com/word?key=4UTQK5O8'

randomWordButton.addEventListener('click', event => {
  event.preventDefault();
  fetch(randomWordAPIURL)
    .then(res => res.json())
    .then(words => words[0])
    .then(word => startGame(word.toUpperCase()))
})

let phrase = params.get('phrase') ? b64DecodeUnicode(params.get('phrase')) : undefined
let guesses = []

const startGame = newPhrase => {
  phrase = newPhrase
  hideEl(newGameForm, playAgainHolder)
  showEl(phraseholder)
  updatePhraseholder(phrase, guesses)

  updateQueryString(phrase)

  letterOptions.forEach(
    addLetterOption(optionsHolder, letter => {
      guesses.push(letter)
      updatePhraseholder(phrase, guesses)
    })
  )
}

const updateQueryString = newPhrase => {
  const newurl =
    window.location.pathname +
    replaceQueryParam(
      'phrase',
      b64EncodeUnicode(newPhrase),
      window.location.search
    )
  window.history.pushState({ path: newurl }, '', newurl)
}

const updatePhraseholder = (phrase, guesses) => {
  const displayString = phrase
    .split('')
    .map(char => {
      if (guesses.includes(char) || !letterOptions.includes(char)) return char
      return '_'
    })
    .join('')
  phraseholder.innerText = displayString

  if (phrase === displayString) {
    winGame()
  }
}

const winGame = () => {
  hideEl(optionsHolder)
  showEl(playAgainHolder)
}

const addLetterOption = (parentEl, eventHandler) => letter => {
  const button = document.createElement('button')
  button.innerText = letter
  button.addEventListener('click', () => {
    button.disabled = true
    eventHandler(letter)
  })
  parentEl.appendChild(button)
}

if (!phrase) {
  showEl(newGameForm)
  hideEl(phraseholder, playAgainHolder)

  newGameForm.addEventListener('submit', event => {
    event.preventDefault()
    startGame(event.target.elements.phrase.value.toUpperCase())
  })
} else {
  startGame(phrase)
}