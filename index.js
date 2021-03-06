const newGameForm = document.querySelector('#new-game')

const phraseholder = document.querySelector('#phraseholder')
const optionsHolder = document.querySelector('#options')
const playAgainHolder = document.querySelector('#play-again')
const playAgainButton = document.querySelector('#play-again-button')

const params = new URLSearchParams(window.location.search)

const fixVHFunkiness = () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
fixVHFunkiness()
window.addEventListener('resize', fixVHFunkiness);

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
      return phrase.split('').includes(letter)
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
    if (!eventHandler(letter)) {
      button.classList.add('wrong')
    }
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