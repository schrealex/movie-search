<template>
    <div class="pop-over" :style="{ top: position.y + 'px', left: position.x + 'px' }">
        <div class="pop-over__content">
            <img :src="content" />
        </div>
    </div>
</template>
<script>

export default {
  name: 'PopOver',
  props: {
    content: {
      type: String,
      default: '',
    },
    position: {
      type: Object,
      default: () => {
      },
    },
  },
};
</script>
<style lang="scss" scoped>
  .pop-over {
    width: 185px;
    position: absolute;
    z-index: 10000;
    box-shadow: 20px rgba(0, 0, 0, 0.5);

    border-radius: 8px;
    border: 2px solid rgba(243,197,0, 0.5);
    
    img {
        border-radius: 8px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      white-space: pre-line;
    }
  }
</style>
