function Game2048 () {
  this.score = 0;
  this.board = [
    [ null, null, null, null ],
    [ null, null, null, null ],
    [ null, null, null, null ],
    [ null, null, null, null ],
  ];

  this.hasWon = false;
  this.hasLost = false;

  this._generateTile();
  this._generateTile();
}


Game2048.prototype._generateTile = function () {
  var tileValue;

  if (Math.random() < 0.8) {
    tileValue = 2;
  } else {
    tileValue = 4;
  }

  var emptyTile = this._getAvailablePosition();

  if (emptyTile !== null) {
    var row = emptyTile.x;
    var col = emptyTile.y;
    this.board[row][col] = tileValue;
  }
};


Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (cell, colIndex) {
      if (cell === null) {
        emptyTiles.push({ x: rowIndex, y: colIndex });
      }
    });
  });

  if (emptyTiles.length === 0) {
    return null;
  }

  var randomIndex = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomIndex];
};


Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row) {
    console.log(row);
  });
};


Game2048.prototype.moveLeft = function () {
  var updatedBoard = [];

  this.board.forEach(function (row) {
    // 1. Remove empties from row
    var newRow = [];

    row.forEach(function (cell) {
      if (cell !== null) {
        newRow.push(cell);
      }
    });

    // 2. Merge tiles in row that are together and the same number
    for (var i = 0; i < newRow.length; i += 1) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = null;
      }
    }

    // 3. Remove new empties in the middle
    //     e.g. when step #2 turns [8, 8, 4] into [16, null, 4]
    //          we want to end up with [16, 4]
    var moved = [];

    newRow.forEach(function (cell) {
      if (cell !== null) {
        moved.push(cell);
      }
    });


    // 4. push() nulls until row has length 4 again
    while (moved.length < 4) {
      moved.push(null);
    }

    updatedBoard.push(moved);
  });

  this.board = updatedBoard;
};


Game2048.prototype.moveRight = function () {
  var updatedBoard = [];

  this.board.forEach(function (row) {
    // 1. Remove empties from row
    var newRow = [];

    row.forEach(function (cell) {
      if (cell !== null) {
        newRow.push(cell);
      }
    });

    // 2. Merge tiles in row that are together and the same number
    for (var i = (newRow.length - 1); i >= 0; i -= 1) {
      if (newRow[i] === newRow[i - 1]) {
        newRow[i] *= 2;
        newRow[i - 1] = null;
      }
    }

    // 3. Remove new empties in the middle
    //     e.g. when step #2 turns [8, 8, 4] into [16, null, 4]
    //          we want to end up with [16, 4]
    var moved = [];

    newRow.forEach(function (cell) {
      if (cell !== null) {
        moved.push(cell);
      }
    });


    // 4. push() nulls until row has length 4 again
    while (moved.length < 4) {
      moved.unshift(null);
    }

    updatedBoard.push(moved);
  });

  this.board = updatedBoard;
};


Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};


Game2048.prototype.moveUp = function () {
  this._transposeMatrix();
  this.moveLeft();
  this._transposeMatrix();
};


Game2048.prototype.moveDown = function () {
  this._transposeMatrix();
  this.moveRight();
  this._transposeMatrix();
};
