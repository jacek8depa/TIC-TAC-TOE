const fields = document.querySelectorAll('.field')
const fieldsSymbols = document.querySelectorAll('.field-symbol')
const fieldSymbolChosen = document.querySelectorAll('.field-symbol-chosen')
const restartButton = document.querySelector('.icon-restart')
const turnSignX = document.querySelector('.turn-sign-x')
const turnSignO = document.querySelector('.turn-sign-o')

let actualSymbol = 'x'
let strzal = NaN





fields.forEach((field, index) => {
    field.addEventListener('mouseover', () => {
        fieldsSymbols[index].style.backgroundImage = `url(assets/icon-${actualSymbol}-outline.svg)`
    })
    field.addEventListener('mouseout', () => {
        fieldsSymbols[index].style.backgroundImage = "none"
    })
})



function styleBackground(index, actualSymbol) {
    fieldsSymbols[index].style.backgroundImage = `url(assets/icon-${actualSymbol}-outline.svg)`
}
function unStyleBackground(index) {
    fieldsSymbols[index].style.backgroundImage = "none"
}




function oHover(actualSymbol) {
    fields.forEach((field, index) => {
        field.addEventListener('mouseover', () => {
            fieldsSymbols[index].style.backgroundImage = `url(assets/icon-${actualSymbol}-outline.svg)`
        })
        field.addEventListener('mouseout', () => {
            fieldsSymbols[index].style.backgroundImage = "none"
        })
    })
}

const xShots = []
const oShots = []


function placeImg(fieldSymbolChosen, actualSymbol) {
    fieldSymbolChosen[strzal].style.backgroundImage = `url(assets/icon-${actualSymbol}.svg)`
    fieldSymbolChosen[strzal].style.zIndex = '100'

}




function switchTurnSign() {
    if (window.getComputedStyle(turnSignX).display == 'block') {
        turnSignX.style.display = 'none'
        turnSignO.style.display = 'block'
    } else {
        turnSignO.style.display = 'none'
        turnSignX.style.display = 'block'
    }
}

function restartGame() {
    actualSymbol = 'x'
    strzal = NaN
    oHover(actualSymbol)
    fieldSymbolChosen.forEach((fld) => {
        fld.style.backgroundImage = 'none'
        fld.style.backgroundImage = `none`
        fld.style.zIndex = '-100'
    })
    if (window.getComputedStyle(turnSignO).display == 'block') {
        turnSignO.style.display = 'none'
        turnSignX.style.display = 'block'
    }
    xShots.splice(0, xShots.length);
    theEnd = false
    oShots.splice(0, oShots.length);
}

function randomPick() {
    let random = Math.floor(Math.random() * 9)
    for (let i = 0; i < 1000; i++) {
        if (window.getComputedStyle(fieldSymbolChosen[random]).backgroundImage !== 'none') {
            random = Math.floor(Math.random() * 9)
        } else {
            fields[random].click()
            break
        }
    }
}

function aiPick(winningCombinations) {
    if (findWinner(xShots, oShots) == false) {
        if (findWinningCombo(oShots, winningCombinations) !== undefined && window.getComputedStyle(fieldSymbolChosen[findWinningCombo(oShots, winningCombinations)]).backgroundImage == 'none') {
            fields[findWinningCombo(oShots, winningCombinations)].click()

        } else if
            (findWinningCombo(xShots, winningCombinations) !== undefined && window.getComputedStyle(fieldSymbolChosen[findWinningCombo(xShots, winningCombinations)]).backgroundImage == 'none') {
            fields[findWinningCombo(xShots, winningCombinations)].click()
        } else {
            randomPick()
        }
    }
}
function findWinningCombo(array, winningCombinations) {
    // Loop through all of the combinations
    for (let i = 0; i < winningCombinations.length; i++) {
        // Find the number of elements in the combination that match those in the array
        let matchingElements = 0;
        for (let j = 0; j < winningCombinations[i].length; j++) {
            if (array.includes(winningCombinations[i][j])) {
                matchingElements++;
            }
        }
        if (matchingElements === 2) {
            let missingElement;
            for (let j = 0; j < winningCombinations[i].length; j++) {
                if (!array.includes(winningCombinations[i][j])) {
                    missingElement = winningCombinations[i][j];
                    break;
                }
            }
            return missingElement
        }
    }
}




cpuTurn = false



function firstCpuPick() {
    if (cpuTurn == true) {
        randomPick()
    }
}

let vsCpu = true
let theEnd = false

function clickAction(field, index) {
    if (!theEnd) {
        strzal = index
        if (window.getComputedStyle(fieldSymbolChosen[index]).backgroundImage == 'none') {
            placeImg(fieldSymbolChosen, actualSymbol)
            if (actualSymbol === 'x') {
                xShots.push(strzal)
                actualSymbol = 'o'
            } else {
                oShots.push(strzal)
                actualSymbol = 'x'
            }
        } else {
            return false;
        }
        oHover(actualSymbol)
        switchTurnSign()
        endGame(xShots, oShots)
        if (state !== 'o') {
            if (vsCpu && !theEnd) {
                if (!cpuTurn) {
                    cpuTurn = true
                    aiPick(winningCombinations)
                }
                cpuTurn = false
            }
        }
        state = 'x'
    }
}


fields.forEach((field, index) => {
    field.addEventListener('click', () => {
        clickAction(field, index)
    })
})

restartButton.addEventListener('click', () => {
    restartGame();
})

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];



function checkWinning(arr) {
    for (let i = 0; i < winningCombinations.length; i++) {
        let valid = true
        for (let j = 0; j < winningCombinations[i].length; j++) {
            if (!arr.includes(winningCombinations[i][j])) {
                valid = false;
                break;
            }
        }
        if (valid) {
            return true;
        }
    }
    return false;
}

const winSymbol = document.querySelector('.win-symbol')


function findWinner(x, o) {

    if (checkWinning(x)) {
        winSymbol.style.backgroundImage = 'url(assets/icon-x.svg)'
        xScore++
        xScoreBoard.innerHTML = xScore
        theEnd = true
        return true

    }
    if (checkWinning(o)) {
        oScore++
        oScoreBoard.innerHTML = oScore
        theEnd = true
        winSymbol.style.backgroundImage = 'url(assets/icon-o.svg)'
        return true
    }
    return false
}
const tlo = document.querySelector('#tlo')
const endingStripeOne = document.querySelector('.ending-stripe-1')
const endingStripeTwo = document.querySelector('.ending-stripe-2')
const endingStripeTied = document.querySelector('.ending-stripe-tied')
const endingStripes = document.querySelectorAll('.ending-stripe')
const nextRoundBtn = document.querySelectorAll('.next-round-btn')
const xScoreBoard = document.querySelector('.x-score')
const oScoreBoard = document.querySelector('.o-score')
const TiesScoreBoard = document.querySelector('.ties-score')

let drawCaunter = 0
let xScore = 0
let oScore = 0
xScoreBoard.innerHTML = xScore
oScoreBoard.innerHTML = oScore

function isDraw() {
    for (dupsko of fieldSymbolChosen) {
        if (window.getComputedStyle(dupsko).backgroundImage == 'none') {
            return false
        }
    } return true
}

function endGame(x, o) {

    if (findWinner(x, o)) {
        endingStripeOne.style.display = 'flex'
        tlo.style.display = 'block'

    } else if (isDraw()) {
        endingStripeTied.style.display = 'flex'
        tlo.style.display = 'block'
        drawCaunter++
        TiesScoreBoard.innerHTML = drawCaunter
    } return false
}

nextRoundBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        restartGame()
        endingStripes.forEach((strp) => {
            strp.style.display = 'none'
            tlo.style.display = 'none'
        })
        if (cpuVsO) {
            state = 'o'
        }
        if (state == 'o') {
            randomPick();
        }
    })
}
)

function findWinningCombo(array, winningCombinations) {
    // Loop through all of the combinations
    for (let i = 0; i < winningCombinations.length; i++) {
        // Find the number of elements in the combination that match those in the array
        let matchingElements = 0;
        for (let j = 0; j < winningCombinations[i].length; j++) {
            if (array.includes(winningCombinations[i][j])) {
                matchingElements++;
            }
        }
        if (matchingElements === 2) {
            let missingElement;
            for (let j = 0; j < winningCombinations[i].length; j++) {
                if (!array.includes(winningCombinations[i][j])) {
                    missingElement = winningCombinations[i][j];
                    break;
                }
            }
            return missingElement
        }
    }
}

const newGameCpu = document.querySelector('.new-game-cpu')
const newGamePlayer = document.querySelector('.new-game-player')
const landingPage = document.querySelector('#landing-page')
const board = document.querySelector('#board')
const p1 = document.querySelector('.p1')
const p2 = document.querySelector('.p2')

newGameCpu.addEventListener('click', () => {

    turnSignX.style.display = 'block'
    turnSignO.style.display = 'none'
    landingPage.style.display = 'none'
    board.style.display = 'block'
    if (state == 'o') {
        randomPick();
    }
    vsCpu = true

    p1.innerHTML = '(YOU)'
    p2.innerHTML = '(CPU)'

})

newGamePlayer.addEventListener('click', () => {
    landingPage.style.display = 'none'
    board.style.display = 'block'
    vsCpu = false
    p1.innerHTML = '(P2)'
    p2.innerHTML = '(P1)'
    cpuVsO = false


})


const pickSlider = document.querySelector('.pick-slider-slider')
const flipBox = document.querySelector('.flip-box-inner')
let state = 'o'
let cpuVsO = true

pickSlider.addEventListener('click', () => {
    if (state == 'o') {
        pickSlider.style.transform = 'translate(-198px)'
        flipBox.style.transform = 'rotateY(180deg)'
        state = 'x'
        cpuVsO = false
    } else {
        pickSlider.style.transform = 'translate(0px)'
        flipBox.style.transform = 'rotateY(0deg)'
        state = 'o'
        cpuVsO = true
    }
})


