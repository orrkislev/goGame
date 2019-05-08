PIECE_NONE = 0
PIECE_BLACK = -1
PIECE_WHITE = 1

class Cell{
  constructor(_x,_y){
    this.pos = createVector(_x,_y)
    this.piece = PIECE_NONE;
    this.blob = null;
  }
  
  setNeighbors(){
    this.neighbors = []
    if (this.pos.x>0) this.neighbors.push(board[this.pos.x-1][this.pos.y])
    if (this.pos.y>0) this.neighbors.push(board[this.pos.x][this.pos.y-1])
    if (this.pos.x<boardSize-1) this.neighbors.push(board[this.pos.x+1][this.pos.y])
    if (this.pos.y<boardSize-1) this.neighbors.push(board[this.pos.x][this.pos.y+1])
  }
  
  setPiece(pieceType){
    if (this.isEye){
      if (this.blob.piece == pieceType){
        removeEyeFromBlob(this.blob,this)
      } else {
        if (this.blob.eyes.length==1){
          destroyBlob(this.blob)
        }
      }
      this.isEye = false;
      this.blob = null;
    }
    this.piece = pieceType
    for (i=0;i<this.neighbors.length;i++){
      let neighbor = this.neighbors[i]
      if (neighbor.piece == pieceType){
        if (this.blob==null){
          addCellToBlob(neighbor.blob,this)
        } else if (neighbor.blob != this.blob){
          joinBlobs(this.blob,neighbor.blob)
        }

        let midX = (this.pos.x+neighbor.pos.x)/2
        let midY = (this.pos.y+neighbor.pos.y)/2
        addConnectionToBlob(this.blob,createVector(midX,midY))
      }
    }

    if (this.blob==null) createBlob(this.piece,this)
  }
  
  checkIfEye(blob){
    if (this.isEye==true) return true
    this.isEye = true;
    if (this.piece!=PIECE_NONE){
      this.isEye = false
    } else {
      for (i=0;i<this.neighbors.length;i++){
        let neighbor = this.neighbors[i]
        if (neighbor.piece == PIECE_NONE ||
            neighbor.blob != blob){
          this.isEye = false
        }
      }
    }
    return this.isEye;
  }
}