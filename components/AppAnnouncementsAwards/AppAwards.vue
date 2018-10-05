<template>
  <div class="bg-white p-4">
    <h2>Awards</h2>
    <p
      v-for="award in awards"
      :key="award.img">
      <img
        :src="award.img"
        alt="firstAward">
    </p>
  </div>
</template>

<script>
export default {
  /**
   * @todo replace with real data/prop
   * @return {{ awards: {img: string}[]}}
   */
  data() {
    return {
      awards: [
        {
          img: "assets/img/award1.png"
        },
        {
          img: "assets/img/award2.png"
        }
      ]
    };
  }
};
</script>
<style scoped>
</style>
