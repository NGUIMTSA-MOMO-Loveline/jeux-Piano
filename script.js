import { NOTES, MUSIC_SHEETS } from './musicRessources.js'

const KEYBOARD_KEYS = [ "a","z","e","r","t","y","u","i","o","p","q","s","d","f","g","h","j","k","l","m","w","x","c","v","b","n","A","Z","E","R","T","Y","U","I","O","P","Q","S","D","F","G","H","J","K","L","M","W","X","C","V","B","N"]

const PLAY_MODES = {
  manual: "manual",
  automatic: "automatic"
}

const instrumentFolderNames = [
  "piano", "harmonium"
]
let selectedInstrumentIndex = 0;
//
const THEMES = [
    "classic",
    "wood",
    "dark",
    "neon"
]

let currentThemeIndex = 0

let pianoKeyElements
const recordingBtn = document.querySelector("#recording-btn")
const recordingBtnIcon = document.querySelector("#recording-btn > div")
const playRecorderMelodyBtn = document.querySelector("#play-melody-recorded-btn")
const createMusicSheetBtn = document.querySelector("#creer-partition")
const levelsUl = document.querySelector("#music-sheets > ul")
const showKeyboardButton = document.querySelector("#show-keyboard-button")
const pianoKeys = document.querySelector("#piano-keys")
const selectInstrumentBtn = document.querySelector("#select-instrument-btn")
//
const scoreValue = document.querySelector("#score-value")
const comboElement = document.querySelector("#combo")
const themeBtn = document.querySelector("#theme-btn")
const piano = document.querySelector("#piano")

selectInstrumentBtn.innerText = instrumentFolderNames[0]
let pianoKeySpans

let levelsLis
//
let score = 0
let combo = 0
let errors = 0

let firstNoteTimestamp = -1
let isRecording= false
let recordedNotes = []
let newPlayedNoteIndex = 0
let canPlay = true
let currentMusicSheet = MUSIC_SHEETS[0]
let currentMusicSheetIndex = 0
let displayKeyboardLetters = false
// let selectedInstrument = INSTRUMENT_FOLDERS.HARMONIUM

function initLevelsListHTML() {
  MUSIC_SHEETS.forEach(function(_, index) {
    if(index === 0) {
      levelsUl.innerHTML =  `
      <li>
        <span>Mélodie ${index+1}</span> 
        <button data-music-sheet-index=${index}>Jouer</button>
      </li>`
    } else {
       levelsUl.innerHTML +=  `<li></li>`
    }
    levelsUl.querySelector("li > button").addEventListener("click", function(e) {
      console.log(e.target)
      const musicSheetIndex = e.target.dataset.musicSheetIndex
      playPartition(MUSIC_SHEETS[musicSheetIndex])
    })
  })
  levelsLis = levelsUl.querySelectorAll("li")
}

function initPianoKeysHTML() {
  let innerHTML = "";
  NOTES.forEach(function(note) {
    if(note.isBlack) {
      innerHTML = innerHTML + `<div class="note black"><span>${note.key}</span></div>`
    } else {
      innerHTML = innerHTML + `<div class="note white"><span>${note.key}</span>${note.name}</div>`
    }
  });
  pianoKeys.innerHTML = innerHTML
  
  pianoKeyElements = document.querySelectorAll(".note")
  pianoKeySpans = document.querySelectorAll(".note > span")
}

initPianoKeysHTML()
function playNote(index, noteElement, mode) {
  const noteUrl = `./assets/audio/${instrumentFolderNames[selectedInstrumentIndex]}/${NOTES[index].fileName}.mp3`
  const audio = new Audio(noteUrl)
  audio.play()
  if(selectedInstrumentIndex === 1) {
    setTimeout(function() {
      audio.pause()
      audio.currentTime = 0
    }, 2000)
  }
  noteElement.style.backgroundColor = "aqua"
  setTimeout(function() {
    noteElement.style.backgroundColor = ""
  }, 200)

  if(mode === PLAY_MODES.manual) {
    if(isRecording=== true) {
      const newNoteTimestamp = new Date().getTime()
      let delai = 0
      if(firstNoteTimestamp > -1)  {
        delai = newNoteTimestamp - firstNoteTimestamp
      } else {
          firstNoteTimestamp = newNoteTimestamp
      }
      recordedNotes.push({
        indexNote: index,
        delai: delai,
      })
    } else {
      const newNoteTimestamp = new Date().getTime()
      let delai = 0
      if(firstNoteTimestamp > -1)  {
        delai = newNoteTimestamp - firstNoteTimestamp
      } else {
          firstNoteTimestamp = newNoteTimestamp
      }

      //if(currentMusicSheet[newPlayedNoteIndex].indexNote === index) {
        //if(newPlayedNoteIndex === currentMusicSheet.length - 1) {
         // newPlayedNoteIndex = 0
          //console.log("Vous avez gagné !")
          //currentMusicSheetIndex++
          //currentMusicSheet = MUSIC_SHEETS[currentMusicSheetIndex]
         // const li = levelsLis[currentMusicSheetIndex]
          //li.innerHTML = `<span>Mélodie ${currentMusicSheetIndex+1}</span> 
          //<button data-music-sheet-index=${currentMusicSheetIndex}>Jouer</button>`
          //li.querySelector("button").addEventListener("click", function(e) {
            //const musicSheetIndex = e.target.dataset.musicSheetIndex
            //playPartition(MUSIC_SHEETS[musicSheetIndex])
            //firstNoteTimestamp = -1
          //})
          //
      if(currentMusicSheet[newPlayedNoteIndex].indexNote === index) {

    combo++
    score += 100 * combo

    scoreValue.innerText = score
    comboElement.innerText = `🔥 Combo x${combo}`

    if(newPlayedNoteIndex === currentMusicSheet.length - 1) {

        score += 500

        if(combo === currentMusicSheet.length) {
            score += 1000
        }

        scoreValue.innerText = score

        newPlayedNoteIndex = 0

        console.log("Vous avez gagné !")

        let stars = "⭐"

        if(errors === 0) {
            stars = "⭐⭐⭐"
        } else if(errors <= 2) {
            stars = "⭐⭐"
        }

        // Mettre les étoiles sur la partition terminée
        const li = levelsLis[currentMusicSheetIndex]

        li.innerHTML = `
            <span>Mélodie ${currentMusicSheetIndex + 1} ${stars}</span>
            <button data-music-sheet-index="${currentMusicSheetIndex}">
                Rejouer
            </button>
        `

        // Passer à la partition suivante
        currentMusicSheetIndex++

        if(currentMusicSheetIndex < MUSIC_SHEETS.length){

    currentMusicSheet = MUSIC_SHEETS[currentMusicSheetIndex]

    const nextLi = levelsLis[currentMusicSheetIndex]

    nextLi.innerHTML = `
        <span>Mélodie ${currentMusicSheetIndex + 1}</span>
        <button data-music-sheet-index="${currentMusicSheetIndex}">
            Jouer
        </button>
    `
    nextLi.querySelector("button").addEventListener("click",function(e){

        const musicSheetIndex = Number(e.target.dataset.musicSheetIndex)

        currentMusicSheetIndex = musicSheetIndex
        currentMusicSheet = MUSIC_SHEETS[musicSheetIndex]
        newPlayedNoteIndex = 0

        playPartition(currentMusicSheet)
    })


}
else{

    alert("🎉 Bravo ! Vous avez terminé toutes les partitions !")

}
        li.querySelector("button").addEventListener("click", function(e) {

        const musicSheetIndex = Number(e.target.dataset.musicSheetIndex)

        playPartition(MUSIC_SHEETS[musicSheetIndex])

        firstNoteTimestamp = -1

        })
        } else {
          newPlayedNoteIndex++ 
          console.log("Jusque là tout va bien !")
        }
      } else {
        errors++
        combo = 0
        newPlayedNoteIndex = 0
        firstNoteTimestamp = -1
        console.log("perdu !")
      } 
    }
  }
}

function playPartition(partition) {
  errors = 0
  combo = 0
comboElement.innerText = "Combo x0"
  if(canPlay) {
    partition.forEach(function(note, index) {
      const elementHTML = pianoKeyElements[note.indexNote]
      
      setTimeout(function() {
        playNote(note.indexNote, elementHTML,PLAY_MODES.automatic)
        if(index === partition.length - 1) {
          canPlay = true
        }
      }, note.delai + 2000)
    })
    canPlay = false
  }
  
}

pianoKeyElements.forEach(function(noteElement, index) {
    noteElement.addEventListener("click", function() {
      playNote(index, noteElement, PLAY_MODES.manual)
    })
})

document.addEventListener("keypress", function(e) {
    const index = KEYBOARD_KEYS.indexOf(e.key)
    if(index > -1) {
        const noteElement = pianoKeyElements[index]
        playNote(index, noteElement,PLAY_MODES.manual)
    }
})

recordingBtn.addEventListener("click", function() {
  if(isRecording=== false) {
    isRecording= true
    recordingBtnIcon.className = "stop"
    recordedNotes = []
    newPlayedNoteIndex = 0
    playRecorderMelodyBtn.style.transform = "scale(0)"
  } else {
    isRecording= false
    recordingBtnIcon.className = "enreg"
    firstNoteTimestamp = -1
    playRecorderMelodyBtn.style.transform = "scale(1)"
  } 
})

playRecorderMelodyBtn.addEventListener("click", function() {
  playPartition(recordedNotes)
})

createMusicSheetBtn.addEventListener("click", function() {
  console.log(JSON.stringify(recordedNotes))
})

showKeyboardButton.addEventListener("click", function() {
  if(displayKeyboardLetters == true) {
    displayKeyboardLetters = false
    pianoKeySpans.forEach(span => {
      span.style.visibility = "hidden"
    })
  } else {
    displayKeyboardLetters = true
    pianoKeySpans.forEach(span => {
      span.style.visibility = "visible"
    })
  }
})

selectInstrumentBtn.addEventListener("click", function() {
  selectedInstrumentIndex ++
  if(selectedInstrumentIndex === instrumentFolderNames.length) {
    selectedInstrumentIndex = 0
  }
  selectInstrumentBtn.innerText = instrumentFolderNames[selectedInstrumentIndex]
})

initLevelsListHTML()
//
themeBtn.addEventListener("click", function(){

    currentThemeIndex++

    if(currentThemeIndex === THEMES.length){
        currentThemeIndex = 0
    }

    piano.className = THEMES[currentThemeIndex]

    themeBtn.innerText = "🎨 " + THEMES[currentThemeIndex]
})

// playPartition(MUSIC_SHEETS[1])