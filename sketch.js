board = []

boardSize = 9
cubeSize = 50;
pieceSize = 45

highlightCell = null

function setup() {
  noCursor()
  rectMode(CENTER);
  createCanvas(cubeSize * (boardSize+1), cubeSize * (boardSize+1));
  for (i = 0; i < boardSize; i++) {
    board[i] = []
    for (j = 0; j < boardSize; j++) {
      board[i][j] = new Cell(i,j)
    }
  }
  for (i = 0; i < boardSize; i++) {
    for (j = 0; j < boardSize; j++) {
      board[i][j].setNeighbors()
    }
  }
}

function draw() {
  background(120, 150, 180);
  stroke(255);
  for (i = 1; i <= boardSize; i++) {
    for (j = 1; j <= boardSize; j++) {
      line(i * cubeSize, cubeSize, i * cubeSize, boardSize * cubeSize)
      line(cubeSize, j * cubeSize, boardSize * cubeSize, j * cubeSize)
    }
  }
  noStroke()
  
  
  blobs.forEach(function(blob){
   drawBlob(blob)
  })
  
  fill(255,0,0,50);
  if (highlightCell!=null){
    ellipse(cubeSize * (highlightCell.pos.x + 1), cubeSize * (highlightCell.pos.y + 1), pieceSize*0.3, pieceSize*0.3);
  }
  
  whiteTurn ? fill(255) : fill(0)
  ellipse(mouseX,mouseY,pieceSize*0.5,pieceSize*0.5)
}

whiteTurn = true;
function mousePressed() {
  x = round(mouseX / cubeSize) - 1
  y = round(mouseY / cubeSize) - 1
  if (x>=0 && x<boardSize &&y>=0 && y<boardSize){
    selectedCell = board[x][y]
    if (selectedCell.piece == PIECE_NONE) {
      if (whiteTurn) {
        selectedCell.setPiece(PIECE_WHITE)
      } else {
        selectedCell.setPiece(PIECE_BLACK)
      }
      whiteTurn = !whiteTurn
      
      highlightCell = selectedCell
      
      blobs.forEach(function(blob){
        if (isSurrounded(blob)){
          destroyBlob(blob)
        }
      })
      checkBlobForEyes(selectedCell.blob)
    }
  }
}