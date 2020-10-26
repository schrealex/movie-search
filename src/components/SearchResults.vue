<template>
  <div class="results">
    <ul v-if="results">
      <template v-for="result in results">
        <li v-if="result.mediaType === 'movie'" :key="result.id"
            @click="$emit('getMediaInformation', 'movie', result.id)">
          <font-awesome-icon :icon="['fal', 'film']" size="lg"/>
          {{ result.title }} ({{ result.year | formatDate('YYYY') }})
        </li>
        <li v-if="result.mediaType === 'tv'" :key="result.id" @click="$emit('getMediaInformation', 'tv', result.id)">
          <font-awesome-icon :icon="['far', 'tv-retro']" size="lg"/>
          {{ result.title }} ({{ result.firstAirDate | formatDate('YYYY') }})
        </li>
        <li v-if="result.mediaType === 'person'" :key="result.id" @click="$emit('getActorInformation', result.id)"
            class="result">
          <font-awesome-icon v-if="!result.adult" :icon="['fas', 'user']" size="lg"/>
          <div v-else class="adult">
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
          </div>
          {{ result.title }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss">
.results {
  align-self: center;
  font-weight: bold;
  margin-top: -15px;
  z-index: 10;

  @media screen and (max-width: 420px) {
    margin-top: -30px;
  }

  .result {
    display: flex;

    .adult {
      margin-right: 8px;
    }
  }

  ul {
    position: absolute;
    text-align: left;
    padding: 5px;
    margin-left: 25px;
    background-color: rgba(0, 0, 0, 0.5);
    left: calc(50% - 325px);
    width: 600px;

    @media screen and (max-width: 992px) {
      width: 390px;
      left: calc(50% - 240px);
    }

    @media screen and (max-width: 420px) {
      left: calc(50% - 196px);
      width: 346px;
    }

    li {
      padding: 5px;

      &:hover {
        cursor: pointer;
        color: #000000;
        background-color: gold;
      }
    }
  }
}
</style>
