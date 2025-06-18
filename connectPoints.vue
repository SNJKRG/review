<template>
    <div class="main-content">
      <div class="grid-container" :style="containerStyle">
        <div
          v-for="r in rowCount"
          :key="'h' + r"
          class="horizontal-line"
          :style="{ top: (r * cellY) + 'px' }"
        ></div>

        <div
          v-for="c in colCount"
          :key="'v' + c"
          class="vertical-line"
          :style="{ left: (c * cellX) + 'px' }"
        ></div>

        <div
          v-for="(dot, index) in parsedDots"
          :key="index"
          class="dot"
          :style="{
            top: (dot.row * cellY) + 'px',
            left: (dot.col * cellX) + 'px'
          }"
        ></div>
    
        <svg
          :width="containerWidth"
          :height="containerHeight"
          class="line-overlay"
          @click="onSvgClick"
          @mousemove="onSvgMouseMove"
          @mouseleave="onSvgMouseLeave"
          style="cursor: pointer;"
        >

          <polyline
            :points="polylinePointsAttr"
            stroke="blue"
            fill="none"
            stroke-width="7"
          />

          <circle
            v-for="(pt, index) in polylinePoints"
            :key="'pt' + index"
            :cx="pt.x"
            :cy="pt.y"
            r="7"
            :class="{'first-point': index === 0, 'point-marker': true}"
          />

          <circle
            v-if="showHoverPoint"
            :cx="hoverPoint.x"
            :cy="hoverPoint.y"
            r="7"
            class="hover-dot"
          />
        </svg>
      </div>
    

      <div class="controller">
        <button class="control-button" @click="resetBoard">Сбросить</button>
        <button class="control-button" @click="goBackOneMove">Назад</button>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    model: {
    prop: 'answer',
    event: 'updateAnswer'
  },
    name: 'GridIntersections',
    props: ["problemParams"],
    data() {
      return {
        rowCount: 7,
        colCount: 7,
        cellX: 100,
        cellY: 80,
        polylinePoints: [],
        hoverPoint: null
      }
    },
    computed: {
      parsedDots() {
        return this.problemParams.config.map(item => {
          const [row, col] = item.split('-').map(Number);
          return { row, col };
        });
      },
      containerStyle() {
        return {
          position: 'relative',
          width: this.containerWidth + 'px',
          height: this.containerHeight + 'px',
          border: '1px solid #000'
        }
      },
      containerWidth() {
        return this.colCount * this.cellX;
      },
      containerHeight() {
        return this.rowCount * this.cellY;
      },
      polylinePointsAttr() {
        return this.polylinePoints
          .map(point => `${point.x},${point.y}`)
          .join(' ');
      },
      showHoverPoint() {
        return this.hoverPoint && this.polylinePoints.length < 6;
      },
    },
    methods: {
      resetBoard() {
        this.polylinePoints = [];
      },
      goBackOneMove() {
        if (this.polylinePoints.length > 1) {
          this.polylinePoints.pop();
        }
      },
      onSvgClick(event) {
        if (this.polylinePoints.length >= 6) {
          return;
        }
    
        const rect = event.target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
    
        const col = Math.round(offsetX / this.cellX);
        const row = Math.round(offsetY / this.cellY);
    
        const x = col * this.cellX;
        const y = row * this.cellY;
    
        this.polylinePoints.push({ x, y });
        this.updateAnswer(this.polylinePoints)

      },
      onSvgMouseMove(event) {
        if (this.polylinePoints.length >= 6) {
          this.hoverPoint = null;
          return;
        }
    
        const rect = event.target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
    
        const col = Math.round(offsetX / this.cellX);
        const row = Math.round(offsetY / this.cellY);
    
        const x = col * this.cellX;
        const y = row * this.cellY;
    
        this.hoverPoint = { x, y };
      },
      onSvgMouseLeave() {
        this.hoverPoint = null;
      },
      updateAnswer() {
      this.$emit('updateAnswer', [this.parsedDots, this.polylinePoints])
    }
    }
  }
  </script>