blobs = []

function createBlob(pieceType,cell){
  blob = {
    piece:pieceType,
    cells:[cell],
    eyes:[],
    connections:[],
    eyePosition:createVector(
      cubeSize * (cell.pos.x+1-0.2),
      cubeSize * (cell.pos.y+1-0.2)),
    blinking:0
  }
  blobs.push(blob)
  cell.blob = blob
}

function addCellToBlob(blob,cell){
  blob.cells.push(cell)
  cell.blob = blob
  setEyesPosition(blob)
}

function joinBlobs(blob1,blob2){
  blob2.cells.forEach(function(cell){
    cell.blob = blob1
  })
  blob1.cells = blob1.cells.concat(blob2.cells);
  blob1.eyes = blob1.eyes.concat(blob2.eyes);
  blob1.connections = blob1.connections.concat(blob2.connections);
  for( var i = 0; i < blobs.length; i++){ 
   if ( blobs[i] === blob2) {
     blobs.splice(i, 1); 
     break
   }
  }
  setEyesPosition(blob1)
}

function removeEyeFromBlob(blob,cell){
  for( var i = 0; i < blob.eyes.length; i++){ 
   if ( blob.eyes[i] === cell) {
     blob.eyes.splice(i, 1); 
     break
   }
  }
}

function addConnectionToBlob(blob,pos){
  blob.connections.push(pos)
}

function isSurrounded(blob){
  val = true
  blob.cells.forEach(function(cell){
    cell.neighbors.forEach(function(neighbor){
      if (neighbor.piece==PIECE_NONE) val = false
    })
  })
  return val
}

function destroyBlob(blob){
  blob.cells.forEach(function(cell){
    cell.blob = null
    cell.piece = PIECE_NONE
  })
  for( var i = 0; i < blobs.length; i++){ 
   if ( blobs[i] === blob) {
     blobs.splice(i, 1); 
     break
   }
  }
}

function checkBlobForEyes(blob){
  blob.cells.forEach(function(cell){
    cell.neighbors.forEach(function(neighbor){
      if (neighbor.checkIfEye(blob)){
        if (containsObject(neighbor, blob.eyes)==false){
          blob.eyes.push(neighbor)
          neighbor.blob = blob
        }
      }
    })
  })
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}
  
function setEyesPosition(blob){
  blob.piece==PIECE_BLACK ? fill(0) : fill(255)
  topMost = boardSize
  leftMost = boardSize
  blob.cells.forEach(function(cell){
    if (cell.pos.y<topMost){
      topMost = cell.pos.y
      leftMost = cell.pos.x
    } else if (cell.pos.y==topMost){
      if (cell.pos.x<leftMost){
        topMost = cell.pos.y
        leftMost = cell.pos.x
      }
    }
  })
  var cell = blob.cells[Math.floor(Math.random()*blob.cells.length)];
  leftMost = cell.pos.x
  topMost = cell.pos.y
  blob.eyePosition.x = cubeSize * (leftMost+1-0.2)
  blob.eyePosition.y = cubeSize * (topMost+1-0.2)
}
  
function drawBlob(blob){
  blob.piece==PIECE_BLACK ? fill(0) : fill(255)
  blob.cells.forEach(function(cell){
    ellipse(cubeSize * (cell.pos.x + 1), cubeSize * (cell.pos.y + 1), pieceSize, pieceSize);
  })
  blob.connections.forEach(function(connection){
    rect(cubeSize * (connection.x + 1), cubeSize * (connection.y + 1), pieceSize, pieceSize);
  })
  
  
  blob.piece==PIECE_BLACK ? fill(255) : fill(0)
  if (blob.blinking==0){
    ellipse(blob.eyePosition.x-3,blob.eyePosition.y,3,3)
    ellipse(blob.eyePosition.x+3,blob.eyePosition.y,3,3)
    if (random(100)<1) blob.blinking = 5
    if (random(1000)<1) setEyesPosition(blob)
  } else {
    blob.blinking -= 1
    blob.piece==PIECE_BLACK ? stroke(255) : stroke(0)
    line(blob.eyePosition.x+2,blob.eyePosition.y,blob.eyePosition.x+4,blob.eyePosition.y)
    line(blob.eyePosition.x-2,blob.eyePosition.y,blob.eyePosition.x-4,blob.eyePosition.y)
    noStroke()
  }
}
  