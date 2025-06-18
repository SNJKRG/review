<template>
  <div class="board">
    <div
      v-for="n in 36"
      :key="n"
      class="card"
      :class="{ chosen: chosenCards.includes(n) }"
      @click="chooseCard(n)"
    >
      <img src="/problem_assets/karta.png" class="card-img" />
      <img v-if="chosenCards.includes(n)" src="/problem_assets/tick.svg" class="checkmark" alt="chosen" />
    </div>
  </div>
</template>

<script>
export default {
    model: {
        prop: 'answer',
        event: 'updateAnswer'
    },
  data() {
    return {
      chosenCards: [],
    };
  },
  methods: {
    chooseCard(n) {
      const idx = this.chosenCards.indexOf(n);
      if (idx === -1) {
        this.chosenCards.push(n);
      } else {
        this.chosenCards.splice(idx, 1);
      }
      this.$emit('updateAnswer', [...this.chosenCards]);
    },
  }
};
</script>
