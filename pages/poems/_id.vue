<template>
  <div class="poem-page">
    <div class="poem" v-if="`${$store.state.poem}` != []">
      <h1>{{ $store.state.poem.data.attributes.title }}</h1>
      <div>
        {{ $store.state.poem }}
      </div>
    </div>
    <div class="no-poem" v-else>
      No poem found with this id.
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'poems',
}
</script>

<style>

</style>
