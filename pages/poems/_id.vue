<template>
  <div>
    <h1>{{ $store.state.poem.data.attributes.title }}</h1>
    <div>
      {{ $store.state.poem }}
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
