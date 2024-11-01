import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chess',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent {
  selectedColor: string = 'red';
  redCountSmall: number = 0;
  blueCountSmall: number = 0;
  redCountLarge: number = 0;
  blueCountLarge: number = 0;

  rowColorCountSmall: number[][] = Array(8).fill(0).map(() => [0, 0]);
  colColorCountSmall: number[][] = Array(8).fill(0).map(() => [0, 0]);
  rowColorCountLarge: number[][] = Array(25).fill(0).map(() => [0, 0]);
  colColorCountLarge: number[][] = Array(25).fill(0).map(() => [0, 0]);

  message: string = "";  

  selectColor(color: string) {
    this.selectedColor = color;
  }

  paintSquare(row: number, col: number) {
    const square = document.querySelectorAll('.chess-board .square')[(row * 8) + col];
    if (!square) return;

    const currentColor = square.getAttribute('data-color');

    if (currentColor !== this.selectedColor) {
      this.updateCounts(row, col, 'small', this.selectedColor, currentColor);
      square.setAttribute('style', `background-color: ${this.selectedColor};`);
      square.setAttribute('data-color', this.selectedColor);  
      
       this.checkSameRedCount('small');
    }
  }

   

  checkSameRedCount(boardType: string) {
    const rowCount = boardType === 'small' ? this.rowColorCountSmall : this.rowColorCountLarge;
    const colCount = boardType === 'small' ? this.colColorCountSmall : this.colColorCountLarge;

    const rowMatches: { [key: number]: number[] } = {};
    const colMatches: { [key: number]: number[] } = {};

    // Verifica filas
    for (let i = 0; i < rowCount.length; i++) {
      const redCount = rowCount[i][0];
      if (redCount > 0) {
        if (!rowMatches[redCount]) {
          rowMatches[redCount] = [];
        }
        rowMatches[redCount].push(i + 1);  
      }
    }

    // Verifica columnas
    for (let i = 0; i < colCount.length; i++) {
      const redCount = colCount[i][0];
      if (redCount > 0) {
        if (!colMatches[redCount]) {
          colMatches[redCount] = [];
        }
        colMatches[redCount].push(i + 1);  
      }
    }

     const rowMessages: string[] = [];
    for (const count in rowMatches) {
      if (rowMatches[count].length > 1) {
        rowMessages.push(`Las filas ${rowMatches[count].join(', ')} tienen la misma cantidad de rojo (${count}).`);
      }
    }

     const colMessages: string[] = [];
    for (const count in colMatches) {
      if (colMatches[count].length > 1) {
        colMessages.push(`Las columnas ${colMatches[count].join(', ')} tienen la misma cantidad de rojo (${count}).`);
      }
    }

     this.message = [...rowMessages, ...colMessages].join(' ');
    
     if (this.message === "") {
      this.message = '';
    }
  }

  updateCounts(row: number, col: number, boardType: string, newColor: string, oldColor: string | null) {
    const newColorIndex = newColor === 'red' ? 0 : 1;
    const oldColorIndex = oldColor === 'red' ? 0 : oldColor === 'blue' ? 1 : -1;

    if (boardType === 'small') {
      if (oldColorIndex !== -1) { // Resta el color anterior si existía
        oldColorIndex === 0 ? this.redCountSmall-- : this.blueCountSmall--;
        this.rowColorCountSmall[row][oldColorIndex]--;
        this.colColorCountSmall[col][oldColorIndex]--;
      }

      // Suma el nuevo color
      newColorIndex === 0 ? this.redCountSmall++ : this.blueCountSmall++;
      this.rowColorCountSmall[row][newColorIndex]++;
      this.colColorCountSmall[col][newColorIndex]++;
    } else {
      if (oldColorIndex !== -1) {
        oldColorIndex === 0 ? this.redCountLarge-- : this.blueCountLarge--;
        this.rowColorCountLarge[row][oldColorIndex]--;
        this.colColorCountLarge[col][oldColorIndex]--;
      }

      newColorIndex === 0 ? this.redCountLarge++ : this.blueCountLarge++;
      this.rowColorCountLarge[row][newColorIndex]++;
      this.colColorCountLarge[col][newColorIndex]++;
    }
  }

  resetBoard(boardType: string) {
    const squares = boardType === 'small' 
      ? document.querySelectorAll('.chess-board .square')
      : document.querySelectorAll('.large-chess-board .large-square');
      
    squares.forEach(square => {
      square.removeAttribute('style');  
      square.removeAttribute('data-color');  
    });

     if (boardType === 'small') {
      this.redCountSmall = 0;
      this.blueCountSmall = 0;
      this.rowColorCountSmall = Array(8).fill(0).map(() => [0, 0]);
      this.colColorCountSmall = Array(8).fill(0).map(() => [0, 0]);
    } else {
      this.redCountLarge = 0;
      this.blueCountLarge = 0;
      this.rowColorCountLarge = Array(25).fill(0).map(() => [0, 0]);
      this.colColorCountLarge = Array(25).fill(0).map(() => [0, 0]);
    }

    this.message = "";  
  }
  setSquareColor(row: number, col: number, color: string) {
    const square = document.querySelectorAll('.chess-board .square')[(row * 8) + col];
    if (square) {
      square.setAttribute('style', `background-color: ${color};`);
      square.setAttribute('data-color', color);
    }
  }
  generatePattern() {
    // Reinicia el tablero
    this.resetBoard('small');

    let validPattern = false;
    const rowRedCounts = new Set<number>();
    const colRedCounts = new Set<number>();

     for (let retries = 0; retries < 100; retries++) {
        // Reinicia contadores
        this.rowColorCountSmall = Array(8).fill(0).map(() => [0, 0]);
        this.colColorCountSmall = Array(8).fill(0).map(() => [0, 0]);

         rowRedCounts.clear();
        colRedCounts.clear();
        validPattern = true;

         for (let row = 0; row < 8; row++) {
             const redCountInRow = row + 1;   

            if (rowRedCounts.has(redCountInRow)) {
                validPattern = false;
                break;
            }
            rowRedCounts.add(redCountInRow);

             let currentRedCount = 0;

            for (let col = 0; col < 8; col++) {
                // Alterna entre rojo y azul para cumplir con los requisitos
                const color = currentRedCount < redCountInRow ? 'red' : 'blue';
                this.setSquareColor(row, col, color);

                 const colorIndex = color === 'red' ? 0 : 1;
                this.rowColorCountSmall[row][colorIndex]++;
                this.colColorCountSmall[col][colorIndex]++;
                
                 if (color === 'red') currentRedCount++;
            }
        }

         for (let col = 0; col < 8; col++) {
            const colRedCount = this.colColorCountSmall[col][0];
            if (colRedCounts.has(colRedCount)) {
                validPattern = false;
                break;
            }
            colRedCounts.add(colRedCount);
        }

         if (validPattern) break;
    }

     if (validPattern) {
        this.redCountSmall = this.rowColorCountSmall.reduce((sum, row) => sum + row[0], 0);
        this.blueCountSmall = this.rowColorCountSmall.reduce((sum, row) => sum + row[1], 0);
        this.message = "";
    }  
}


}
