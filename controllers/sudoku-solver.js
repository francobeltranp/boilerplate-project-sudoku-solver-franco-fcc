class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let col = 0; col < 9; col++) {
      if (col !== column) {
        const index = rowStart + col;
        if (puzzleString[index] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r !== row) {
        const index = r * 9 + column;
        if (puzzleString[index] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;
    
    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        if (r !== row || c !== column) {
          const index = r * 9 + c;
          if (puzzleString[index] === value.toString()) {
            return false;
          }
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return validation;
    }
    
    const solution = this.solvePuzzle(puzzleString);
    if (!solution) {
      return { error: 'Puzzle cannot be solved' };
    }
    
    return { solution };
  }

  solvePuzzle(puzzleString) {
    const puzzle = puzzleString.split('');
    
    const findEmpty = () => {
      for (let i = 0; i < 81; i++) {
        if (puzzle[i] === '.') {
          return i;
        }
      }
      return -1;
    };
    
    const isValid = (index, value) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const puzzleStr = puzzle.join('');
      
      return this.checkRowPlacement(puzzleStr, row, col, value) &&
             this.checkColPlacement(puzzleStr, row, col, value) &&
             this.checkRegionPlacement(puzzleStr, row, col, value);
    };
    
    const backtrack = () => {
      const emptyIndex = findEmpty();
      
      if (emptyIndex === -1) {
        return true;
      }
      
      for (let num = 1; num <= 9; num++) {
        if (isValid(emptyIndex, num)) {
          puzzle[emptyIndex] = num.toString();
          
          if (backtrack()) {
            return true;
          }
          
          puzzle[emptyIndex] = '.';
        }
      }
      
      return false;
    };
    
    if (backtrack()) {
      return puzzle.join('');
    }
    
    return null;
  }
}

module.exports = SudokuSolver;

