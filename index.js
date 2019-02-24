const newGameForm = document.querySelector('#new-game')

const phraseholder = document.querySelector('#phraseholder')
const optionsHolder = document.querySelector('#options')

const params = new URLSearchParams(window.location.search)
let phrase = params.get('phrase') ? b64DecodeUnicode(params.get('phrase')) : undefined
let guesses = []

const startGame = newPhrase => {
  phrase = newPhrase
  hideEl(newGameForm)
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
      if (char === ' ' || guesses.includes(char)) return char
      return '_'
    })
    .join('')
  phraseholder.innerText = displayString

  if (phrase === displayString) {
    winGame()
  }
}

const winGame = () => {
//   alert('you won')
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
    hideEl(phraseholder)
  
    newGameForm.addEventListener('submit', event => {
      event.preventDefault()
      startGame(event.target.elements.phrase.value.toUpperCase())
    })
  } else {
    startGame(phrase)
  }