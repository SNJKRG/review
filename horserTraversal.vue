<template>
  <div class="game-container">
    <p>Нажмите на свободную клетку для размещения коня </p>
    <div class="top-zone" v-if="!knightPlaced">
      <img src="/problem_assets/chess/horse_w.png" alt="Белый конь" class="initial-knight" />
    </div>

    <div class="game-layout" ref="chessboard">
      <div class="chessboard">
        <table>
          <tr v-for="rowIndex in L" :key="rowIndex">
            <td
              v-for="colIndex in W"
              :key="colIndex"
              @click="onCellClick(rowIndex - 1, colIndex - 1)"
              :class="[
                ((rowIndex - 1 + colIndex - 1) % 2 === 0 ? 'white-cell' : 'orange-cell'),
                cellClass(rowIndex - 1, colIndex - 1)
              ]"
            >
              <div v-if="knightPlaced && knightPosition.row === (rowIndex - 1) && knightPosition.col === (colIndex - 1)">
                <img src="/problem_assets/chess/horse_w.png" alt="Белый конь" class="knight-on-board" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="controller">
      <button class="control-button" @click="resetBoard">Сбросить</button>
      <button class="control-button" @click="goBackOneMove">Назад</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    problemParams: {
      type: Object,
      default() {
        return {};
      }
    },
    xhrData: {
      type: Object,
      default() {
        return {};
      }
    },
    newXhr: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      knightPosition: null,
      additionalVisitedCells: []
    };
  },
  computed: {
    L() {
      return this.problemParams.length;
    },
    W() {
      return this.problemParams.width;
    },
    initialVisitedCells() {
      return this.problemParams.visitedCells || [];
    },
    visitedCells() {
      return [...new Set([...this.initialVisitedCells, ...this.additionalVisitedCells])];
    },
    knightPlaced() {
      return this.knightPosition !== null;
    }
  },
  watch: {
    xhrData: {
      handler() {
        this.$nextTick(() => {
          if (this.visitedCells.length === this.L * this.W) {
            this.$emit('xhrRequest', { type: 'end' });
          }
        });
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    onCellClick(row, col) {
      const key = this.visitedKey(row, col);
      if (this.visitedCells.includes(key)) return;

      if (!this.knightPlaced) {
        this.knightPosition = { row, col };
        this.additionalVisitedCells.push(key);
        this.$emit('xhrRequest', { type: 'first_move', row, col });
      } else {
        const current = this.knightPosition;
        const dr = Math.abs(row - current.row);
        const dc = Math.abs(col - current.col);
        if (!((dr === 2 && dc === 1) || (dr === 1 && dc === 2))) return;
        
        this.knightPosition = { row, col };
        this.additionalVisitedCells.push(key);
        this.$emit('xhrRequest', { type: 'move', row, col });
      }
    },
    visitedKey(row, col) {
      return `${row}-${col}`;
    },
    cellClass(row, col) {
      const key = this.visitedKey(row, col);
      if (this.visitedCells.includes(key)) {
        return 'visited-cell';
      }
      if (this.knightPlaced) {
        const current = this.knightPosition;
        const dr = Math.abs(row - current.row);
        const dc = Math.abs(col - current.col);
        if ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)) {
          return 'allowed-move';
        }
      }
      return '';
    },
    resetBoard() {
      this.knightPosition = null;
      this.additionalVisitedCells = [];
      this.$emit('xhrRequest', { type: 'reset' });
    },
    goBackOneMove() {
      if (this.additionalVisitedCells.length > 0) {
        this.additionalVisitedCells.pop();
        if (this.additionalVisitedCells.length > 0) {
          const lastKey = this.additionalVisitedCells[this.additionalVisitedCells.length - 1];
          const [row, col] = lastKey.split('-').map(Number);
          this.knightPosition = { row, col };
          this.$emit('xhrRequest', { type: 'back' });
        } else {
          this.knightPosition = null;
        }
      }
    }
  },
};
</script>