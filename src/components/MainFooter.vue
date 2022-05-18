<template>
  <footer>
    <div class="footer__content">
      <p>Developed by <span class="fw-bold">Betzabeth Linares</span></p>
      <p>
        <span class="fw-bold">Technological tools</span> HTML5, CSS3, VueJS,
        NodeJS, MongoDB
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "MainFooter",
};
</script>

<style scoped>
footer {
  background-color: var(--primary-tint);
  color: var(--primary-shade);
  margin-bottom: 120px;
  padding: 1rem 1.5rem;
}

.footer__content {
  margin: 0 auto;
  width: clamp(260px, 100%, 1024px);
}

.footer__content > p {
  text-align: center;
}

.footer__content > p:first-child {
  margin-bottom: 1rem;
}

@media screen and (min-width: 426px) {
  footer {
    margin-bottom: 84px;
  }
}
@media screen and (min-width: 992px) {
  footer {
    margin-bottom: 0;
  }

  .footer__content {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .footer__content > p:first-child {
    margin-bottom: 0;
  }
}
</style>