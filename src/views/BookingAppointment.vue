<template>
  <main>
    <header>
      <span class="subtitle">Let's set the</span>
      <h2>APPOINTMENT</h2>
      <p>And have the chance to learn to dance with the master</p>
    </header>
    <appointment-form class="form__card" />
    <div class="image__container">
      <img src="/imgs/dwd.png" alt="Dancing with the Death" class="image" />
    </div>
  </main>
</template>

<script>
import AppointmentForm from '@/components/AppointmentForm.vue'

export default {
  name: "BookingAppointment",
  components: {
    AppointmentForm
  },
};
</script>

<style scoped>
/*
 * Main content
 */
main {
  margin: 0 auto;
  min-height: calc(
    100vh - 86px - 98px
  ); /* Less MainNavigation and MainFooter */
  padding-top: 2.15rem;
  width: clamp(260px, 80%, 370px);
}

/*
 * Header
 */
header > * {
  color: #fff;
}
.subtitle {
  font-size: 1.25rem;
  font-weight: 600;
}
h2 {
  font-size: 1.953rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/*
 * Form
 */
.form__card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #fbfbfb;
  border-radius: 1.7rem;
  margin: 2.25rem clamp(-1.55rem, -20%, 0rem);
  padding: 2.25rem clamp(1.7rem, 20%, 2.7rem);
}

/*
 * Image container
 */
.image__container {
  margin: -4rem auto -2rem;
}
.image {
  height: auto;
  width: 100%;
  max-width: 350px;
}

/*
 * Responsive breakpoints
 */
@media screen and (min-width: 992px) {
  main {
    display: grid;
    grid-template-columns: 43% 370px;
    grid-template-rows: 0.6fr 1.4fr;
    gap: 0px clamp(50px, 10%, 190px);
    grid-template-areas:
      "heading form"
      "image form";
    min-height: calc(
      100vh - 72px - 58px
    ); /* Less MainNavigation and MainFooter */
    width: clamp(260px, 80%, 900px);
  }
  main > header {
    align-self: center;
    grid-area: heading;
  }
  main > form {
    align-self: center;
    grid-area: form;
  }
  main > div.image__container {
    align-self: end;
    grid-area: image;
    justify-self: end;
  }

  .form__card {
    margin: 0 clamp(-2.7rem, -20%, -1.7rem);
    position: relative;
  }

  .image__container {
    margin: -2.5rem -3rem 0 0;
  }
}
@media screen and (min-width: 1200px) and (min-height: 880px) {
  .image {
    max-width: 410px;
  }
}
</style>