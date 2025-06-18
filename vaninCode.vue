<template>
	<div class="code-grid">
	  <div class="word">
		<span style="color: #FF3D00">К</span>
		<span style="color: #0066FF">В</span>
		<span style="color: #703AC7">А</span>
		<span style="color: #C414F0">Н</span>
		<span style="color: #67C91A">Т</span>
		<span style="color: #000000">=</span>
		<span style="color: #D5B329">Л</span>
		<span style="color: #703AC7">А</span>
		<span style="color: #C414F0">Н</span>
		<span style="color: #0059FF">Д</span>
		<span style="color: #000000">✕</span>
		<span style="color: #D68E78">И</span>
		<span style="color: #08B5A0">Я</span>
	  </div>
  
	  <div class="digits">
		<div v-for="i in 13" :key="i">
		  <template v-if="i === 6">
			<span class="word-input">=</span>
		  </template>
		  <template v-else-if="i === 11">
			<span class="word-input">✕</span>
		  </template>
		  <template v-else>
			<input
			  v-model="digits[getDigitIndex(i)]"
			  @input="updateDigit(getDigitIndex(i), $event)"
			  @keydown="handleBackspace(getDigitIndex(i), $event)"
			  :input-save-value="digits[getDigitIndex(i)]"
			  type="text"
			  class="digit-input"
			  maxlength="1"
			/>
		  </template>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	model: {
		prop: 'answer',
		event: 'updateAnswer'
	},
	name: 'vaninCode',
	data() {
	  return {
		digits: Array(11).fill('')
	  };
	},
	computed: {
	  R() {
		const val = this.digits.slice(0, 5).join('');
		return val.length === 5 && !isNaN(val) ? parseInt(val, 10) : null;
	  },
	  F() {
		const val = this.digits.slice(5, 9).join('');
		return val.length === 4 && !isNaN(val) ? parseInt(val, 10) : null;
	  },
	  S() {
		const val = this.digits.slice(9, 11).join('');
		return val.length === 2 && !isNaN(val) ? parseInt(val, 10) : null;
	  }
	},
	methods: {
	  getDigitIndex(cellNumber) {
		if (cellNumber < 6) return cellNumber - 1;
		if (cellNumber > 6 && cellNumber < 11) return cellNumber - 2;
		if (cellNumber > 11) return cellNumber - 3;
	  },
  
	  updateDigit(index, event) {
		let newValue = event.target.value.replace(/\D/g, '');
		this.$set(this.digits, index, newValue);
		if (newValue && index < 10) {
		  this.$nextTick(() => {
			this.$el.querySelectorAll('.digit-input')[index + 1].focus();
		  });
		}
		this.$emit('updateAnswer', [this.R, this.F, this.S]);
	  },
  
	  handleBackspace(index, event) {
		if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
		  this.$set(this.digits, index - 1, '');
		  this.$nextTick(() => {
			this.$el.querySelectorAll('.digit-input')[index - 1].focus();
		  });
		}
	  }
	}
  };
  </script>
  