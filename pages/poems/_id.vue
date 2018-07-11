<template>
  <div>
    <h1>Poems</h1>
    <div>
      {{ $store.state.poems }}
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
