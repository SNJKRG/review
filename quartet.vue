<template>
    <div class="main-content">
      <div class="empty-cards">
        <div class="table">
          <div v-for="index in 4" :key="index" class="input-container">
            <DragPlaceholder :border-width="0" :width="50" :height="50"/>
          </div>
        </div>
      </div>
      <div class="animals-cards" :style="{ display: animalsDropped ? 'none' : '' }">
        <DragStartArea>
        <DragElement>
          <img :src="`/problem_assets/quartet/monkey.svg`" alt="Monkey" id="0"/>
        </DragElement>
        <DragElement>
          <img :src="`/problem_assets/quartet/donkey.svg`" alt="Donkey" id="1" />
        </DragElement>
        <DragElement>
          <img :src="`/problem_assets/quartet/goat.svg`" alt="Goat" id="2"/>
        </DragElement>
        <DragElement>
          <img :src="`/problem_assets/quartet/bear.svg`" alt="Bear" id="3" />
        </DragElement>
      </DragStartArea>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    model: {
		prop: 'answer',
		event: 'updateAnswer'
	},
    computed:{
      animalsDropped() {
        return this.imageIds.length === 4;
    }
    },
    name: 'quartet',
    data() {
      return {
        imageIds: [] 
      };
    },
    mounted() {
      const targetNode = document.querySelector('.empty-cards');
      const config = { childList: true, subtree: true };
      this.observer = new MutationObserver(() => {
        this.imageIds = this.getImagesOrder();
      });
      if (targetNode) {
        this.observer.observe(targetNode, config);
      }
      this.imageIds = this.getImagesOrder();
    },
    beforeDestroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },
    methods: {
      getImagesOrder() {
        const containers = document.querySelectorAll('.empty-cards .input-container');
        const imageIds = [];
        containers.forEach(container => {
          const img = container.querySelector('img');
          if (img) {
            imageIds.push(img.id);
          }
        });
        return imageIds;
      },
      updateOrder(imageIds) {
        this.$emit('updateAnswer', imageIds);
      }
    },
    watch: {
      imageIds(newVal) {
        this.updateOrder(newVal);
      }
    },
  }
  </script>
