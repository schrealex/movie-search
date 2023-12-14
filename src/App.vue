<script setup lang="ts">
import Search from './components/Search.vue'
</script>

<template>
  <div id="app" class="flex flex-col bg-black/70">
    <Search class="min-h-[calc(100vh-80px)]"/>
    <footer class="fixed right-0 bottom-0 flex justify-end">
      <img id="moviedb-logo" class="hidden lg:block h-20 mr-1.5" src="@/assets/powered-by-rectangle-green.png" alt="large-moviedb-logo"/>
      <img id="moviedb-small-logo" class="hidden xs:block lg:hidden h-20 mr-1.5" src="@/assets/tmdb.png" alt="small-moviedb-logo"/>
    </footer>
  </div>
</template>
