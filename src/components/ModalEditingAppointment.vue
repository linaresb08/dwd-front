<template>
  <section
    v-if="showModal"
    class="modal"
    @click="$emit('close', false)"
  >

    <!-- Modal content -->
    <div
      class="modal__content card__container"
      @click.stop
    >
      <header>
        <span class="close" @click="$emit('close', false)">
          <fa-icon icon="times" />
        </span>
        <h4>Update appointment</h4>
      </header>
      <appointment-form
        :Appointment="Appointment"
        is-editing
        @close="$emit('close', true)"
      />
    </div>
  </section>
</template>

<script>
import AppointmentForm from "@/components/AppointmentForm.vue";

export default {
  name: 'ModalEditingAppointment',
  components: {
    AppointmentForm,
  },
  props: {
    Appointment: {
      type: Object,
      required: true,
    },
    showModal: {
      type: Boolean,
      default: false
    },
  },
}
</script>

<style scoped>

 /* The Modal (background) */
.modal {
  animation-name: fadeIn;
  animation-duration: 0.4s;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  height: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}


/* Modal Content Box */
.modal__content {
  animation-name: popUp;
  animation-duration: .3s;
  background-color: #fefefe;
  margin: 15% auto;
}

.card__container > header{
  margin-top: -.5rem;
}


/* Close Button */
.close {
  color: #aaa;
  cursor: pointer;
  float: right;
  font-size: 1rem;
  font-weight: bold;
  margin-right: -1rem;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


/* Animations */
@keyframes fadeIn {
  from {opacity: 0}
  to {opacity: 1}
}

@keyframes popUp {
  0% {
    transform: scale(.7);
  }
  45% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(.95);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media screen and (min-width: 400px) {
  .modal__content {
    width: 90%;
    max-width: 400px;
  }
}
</style>