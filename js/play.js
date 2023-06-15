  class Connect4 {
    constructor(element_id, rows = 6, cols = 7) {

      // LINES AND COLUMNS NUMBER
      this.rows = rows;
      this.cols = cols;
      this.messagePlayer1 = "";
      this.messagePlayer2 = "";

      // DOM ELEMENT TO SHOW THE BOARD
      this.element = document.querySelector(element_id);

      // BOARD OF GAMEPLAY - 0 NULL, 1 PLAYER1, 2 PLAYER2
      this.board = Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        this.board[i] = Array(this.cols).fill(0);
      }

      // INTEGER 1 OR 2
      this.turn = 1;

      // COUNT OF MOVES
      this.moves = 0;

      // 0 NULL, 1 OR 2 FOR WINNER
      this.winner = null;

      // ADDING EVENT LISTENER FOR GAMEPLAY
      this.element.addEventListener("click", (event) =>
        this.handle_click(event)
      );

      // GAME DISPLAY
      this.render();
      
      // GAME START
      this.initiate();
      
      document.querySelector('#game table').classList.add('disabled')

      // GAME QUIT
      this.quit()
        
    }

    // SHOWING GAME BOARD IN DOM ELEMENT
   render() {
      let table = document.createElement("table");
      
      for (let i = this.rows - 1; i >= 0; i--) {
        let tr = table.appendChild(document.createElement("tr"));
        for (let j = 0; j < this.cols; j++) {
          let td = tr.appendChild(document.createElement("td"));
          let colour = this.board[i][j];
          if (colour) td.className = "player" + colour;
          td.dataset.column = j;
        }
      }
      this.element.innerHTML = "";
      this.element.appendChild(table);

    }

    set(row, column, player) {

      // COLOR THE CASE
      this.board[row][column] = player;

      // DISPLAY TURN MESSAGE
      const playerOne = document.querySelector("#player1");
      const playerTwo = document.querySelector("#player2");

      if (player === 1) {
        playerTwo.innerHTML = "Your turn...";
        playerOne.innerHTML = "";
        
      } 
      if(player === 2) {
        playerOne.innerText = "Your turn...";
        playerTwo.innerHTML = "";
      }

      // COUNT THE MOVE
      this.moves++;
    }

    // START TO PLAY BUTTON
    initiate() {
      // GETTING RIGHT DOM ELEMENTS WE NEED TO INITIATE THE GAME

      this.playBtn = document.querySelector("#init");
      this.fightAudio = document.querySelector("#fight");
      this.firstPlayerCard = document.getElementById("firstplayer");
      this.secondPlayerCard = document.getElementById("secondplayer");

      // GAME START ON CLICK "PLAY" BUTTON
      this.playBtn.addEventListener("click", () => {
        this.player1 = window.prompt("Please type the Name of the 1st Player below:");
        
        if(!this.player1){
          return
        }
        
        this.player2 = window.prompt("And now the Name of the 2nd Player :");
        
        if(!this.player2){
          return
        }

        if(this.player1 === this.player2){
          window.alert('The players cannot have the same name :( . Please restart')
          return
        }

        // PLAY VOICE
        this.fightAudio.play();

        // DISABLE PLAY BUTTON WHEN PLAY STARTS
        this.playBtn.disabled = true;

        // CREATING 1ST PLAYER CARD
        this.firstPlayerCard.innerHTML = `
            <div id="firstcard" class="card border-0" style="width: 22rem;">
              <div class="card-body bg-slate text-light">
                <h3 class="card-title text-center pb-5"><img class="me-3" src="/images/mk-logo.png" alt="mk" width="40" height="40"> ${this.player1.charAt(0).toUpperCase()+ this.player1.slice(1)} </h3>
                  <div id="linecolorplayer1"></div>
                <h6 id="player1" class="card-text text-center py-5">You start</h6>
                <h6 id="player1message" class="card-text text-center py-5"></h6>
                <h4 id="winner1" class="card-text text-center py-5 fw-5"></h4>
              </div>
            </div>
          `;

        // CREATING 2ST PLAYER CARD
        this.secondPlayerCard.innerHTML = `
        <div id="secondcard" class="card border-0" style="width: 22rem;">
          <div class="card-body bg-slate text-light">
            <h3 class="card-title text-center pb-5"><img class="me-3" src="/images/mk-logo.png" alt="mk" width="40" height="40">${this.player2.charAt(0).toUpperCase()+ this.player2.slice(1)}</h3>
              <div id="linecolorplayer2"></div>
            <h6 id="player2" class="card-text text-center py-5"></h6>
            <h6 id="player2message" class="card-text text-center py-5"></h6>
            <h4 id="winner2" class="card-text text-center py-5 fw-5"></h4>
          </div>
        </div>`;

        // ENABLE GAME PAD WHEN GAME STARTS
        document.querySelector('#game table').classList.remove('disabled')
      });
    }

    // QUIT METHOD
    quit() {
      document.querySelector('#quit').addEventListener('click', () => {
        return this.initiate();
      });
    }

    // ADDING A COLOR TO THE CASE
    play(column) {

      // FIND THE FIRST EMPTY CASE ON THE BOARD
      let row;
      for (let i = 0; i < this.rows; i++) {
        if (this.board[i][column] == 0) {
          row = i;
          break;
        }
      }
      if (row === undefined) {
        return null;
      } else {
        // CREATE A MOVE
        this.set(row, column, this.turn);

        // RETURN THE LINE WHERE WE PLAYED
        return row;
      }
    }

    handle_click(event) {
      // CHECK IF PLAYERS NAMES ARE GIVEN
      
      if (this.player1 || this.player2) {
    
        // CHECK IF THE PARTY IS RUNNING
        if (this.winner !== null) {
          if (window.confirm("Game over!\n\nDo you want to restart?")) {
            this.reset();
            this.render();
          }
          return;
        }
    
        let column = event.target.dataset.column;
    
        if (column !== undefined) {
          // CHANGING THE DATASET VALUES INTO AN INTEGER
          column = parseInt(column);
          let row = this.play(parseInt(column));
    
          if (row === null) {
            window.alert("Column is full!");
            this.reset();
          } else {
            // CHECK IF THERE'S A WINNER OR THE PARTY IS OUT
            if (this.win(row, column, this.turn)) {
              this.winner = this.turn;
            } else if (this.moves >= this.rows * this.columns) {
              this.winner = 0;
            }
            // PASSING THE MOVE: 3 - 2 = 1, 3 - 1 = 2
            this.turn = 3 - this.turn;
    
            // UPDATE THE VISUAL
            this.render();
    
            switch (this.winner) {
              case 0:
                window.alert("Null game!!");
                break;
                // 1ST WINNER EVENTS
              case 1:
                if (this.player1) {
                  document.querySelector('section#connect4').classList.remove('blue')
                  document.querySelector('section#connect4').classList.add('red')
                  document.querySelector('#toasty').play();
                  document.querySelector('#player1message').innerHTML = ''
                  document.querySelector('#winner1').innerHTML = 'WINNER!'
                  document.querySelector('#firstcard').classList.add('wave-card');
                  setTimeout(() => {
                    window.alert(`${this.player1} wins!`);
                  }, 400)

                  document.querySelector('#canvas').style.display = "block";
                  setTimeout(() => {
                    document.querySelector('#canvas').style.display = "none";
                  }, 3000);
                }
                break;

                // 2ND WINNER EVENTS
              case 2:
                if (this.player2) {
                  document.querySelector('section#connect4').classList.remove('blue')
                  document.querySelector('section#connect4').classList.add('yellow')
                  document.querySelector('#toasty').play();
                  document.querySelector('#player2message').innerHTML = ''
                  document.querySelector('#winner2').innerHTML = 'WINNER!'
                  document.querySelector('#secondcard').classList.add('wave-card');
                  setTimeout(() => {
                    window.alert(`${this.player2} wins!`);
                  }, 400)
                  document.querySelector('#canvas').style.display = "block";
                  setTimeout(() => {
                    document.querySelector('#canvas').style.display = "none";
                  }, 3000);
                }
                break;
            }
    
            // ALERTING MESSAGES WHEN ONE OF PLAYERS WON (OR NULL)
          }
        }
        return;
      }
    }

    // THIS FONCTION IS TO CHECK IF THE MOVE IS WINNING

    // RETURNS TRUE IF THE MOVE IS WINNING OR FALSE IF THE GAME GOES ON
    win(row, column, player) {
      // HORIZONTAL CHECK
      let count = 0;

      let horizontalResult = this.board[row].filter((element) => {
        if (element === player) {
          count++;
        } else {
          count = 0;
        }
        if (count === 3) {
          if (player === 1) {
            document.querySelector("#player1message").innerHTML =
              "Almost there...";
          } else {
            document.querySelector("#player2message").innerHTML =
              "Almost there...";
          }
        }
        if (count === 4) {
          return true;
        }
      });
      if (horizontalResult.length) {
        return true;
      }

      // VERTICAL CHECK
      count = 0;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i][column] === player) {
          count++;
        } else {
          count = 0;
        }
        if (count === 3) {
          if (player === 1) {
            document.querySelector("#player1message").innerHTML =
              "Almost there...";
          } else {
            document.querySelector("#player2message").innerHTML =
              "Almost there...";
          }
        }
        if (count === 4) {
          return true;
        }
      }

      // DIAGONAL CHECK
      count = 0;
      let rowStart = row;
      let columnStart = column;
    
      // Move to the top-left of the diagonal
      while (rowStart > 0 && columnStart > 0) {
        rowStart--;
        columnStart--;
      }
    
      // CHECK THE DIAGONAL FROM TOP-LEFT TO BOTTOM-RIGHT
      while (rowStart < this.board.length && columnStart < this.board[0].length) {
        if (this.board[rowStart][columnStart] === player) {
          count++;
        } else {
          count = 0;
        }
        // IF COUNT IS 3 SHOW MESSAGE TO THE PLAYERS "ALMOST THERE"
        if (count === 3) {
          if (player === 1) {
            document.querySelector("#player1message").innerHTML = "Almost there...";
          } else {
            document.querySelector("#player2message").innerHTML = "Almost there...";
          }
        }
        // YOU WON IF 4 GOOD MOVE
        if (count === 4) {
          return true;
        }
        rowStart++;
        columnStart++;
      }
    
      // DIAGONAL CHECK
      count = 0;
      // BOTTOM LEFT MOVE
      while (row < this.board.length - 1 && column > 0) {
        row++;
        column--;
      }
    
      // BOTTOM LEFT & TOP RIGHT
      while (row >= 0 && column < this.board[0].length) {
        if (this.board[row][column] === player) {
          count++;
        } else {
          count = 0;
        }
        if (count === 3) {
          if (player === 1) {
            document.querySelector("#player1message").innerHTML = "Almost there...";
          } else {
            document.querySelector("#player2message").innerHTML = "Almost there...";
          }
        }
        if (count === 4) {
          return true;
        }
        row--;
        column++;
      }

      return false;
    }

    // RESET THE PARTY
    reset() {
      this.laughAudio = document.querySelector("#laugh");

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.board[i][j] = 0;
        }
      }
      this.move = 0;
      this.winner = null;
      this.playBtn.disabled = false;
      document.querySelector('#player1message').innerHTML = ''
      document.querySelector('#player2message').innerHTML = ''
      document.querySelector('#winner1').innerHTML = ''
      document.querySelector('#winner2').innerHTML = ''
      document.querySelector('section#connect4').classList.remove('red')
      document.querySelector('section#connect4').classList.remove('yellow')
      document.querySelector('section#connect4').classList.add('blue')
      this.laughAudio.play();
    }
  }
  
  // INITIALIZE THE GAME
  let p4 = new Connect4('#game');