<template>
  <div class="poem-a-day-sign-up p-4 mt-3">
    <div class="poem-a-day-sign-up__social-group">
      <span class="pl-2 pr-2">
        <a href="#">
          <b-img
            src="/social/facebook.svg"/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <b-img
            src="/social/twitter.svg"/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <b-img
            src="/social/pinterest.svg"/>
        </a>
      </span>
    </div>
    <div class="poem-a-day-sign-up__title">
      sign up for poem-a-day
    </div>
    <div class="poem-a-day-sign-up__description pt-2 pb-2">
      Receive a new poem in your inbox daily
    </div>
    <form>
      <label class="sr-only">Email Address</label>
      <input
        type="text"
        placeholder="john@example.com"
        class="form-control">
      <button
        type="button"
        class="btn btn-primary poem-a-day-button">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script>
export default {
  /**
   * @todo replace with real data/prop
   * @return {{ announcements: {date: string, title: string, link: string}[]}}
   */
  data() {
    return {};
  }
};
</script>
<style scoped lang="scss">
.poem-a-day-sign-up {
  color: var(--white);
  font-weight: 600;
  background-color: var(--black);
  .poem-a-day-sign-up__social-group {
    span {
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .poem-a-day-sign-up__title {
    font-family: "Founders Grotesk Text";
    font-size: 26px;
  }
  .poem-a-day-sign-up__description {
    font-family: "SF Pro Display";
    font-size: 14px;
    font-weight: 100;
  }
  form {
    input {
      width: 67%;
      display: inline-block;
    }
    input,
    .poem-a-day-button {
      border-radius: 0;
      vertical-align: baseline;
    }
  }
}
</style>
