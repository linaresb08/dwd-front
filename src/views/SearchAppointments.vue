<template>
  <section>
    <header>Appointment list by day</header>

    <form @submit.prevent="getAppointments(selectedDate)">
      <div class="input-group">
        <label for="date">Select a date</label>
        <input
          id="date"
          v-model="selectedDate"
          type="date"
          class="form-control"
        />
        <button
          type="submit"
          class="btn btn--primary"
          :disabled="disableButton"
        >
          <fa-icon v-if="disableButton" icon="circle-notch" size="sm" class="fa-spin mr-1" />
          <fa-icon v-else icon="search" size="sm" class="mr-1" />Search
        </button>
      </div>
    </form>
    <div v-if="!appointments.length" class="display-2">
      There are no appointments for this day
    </div>
    <ul v-if="appointments && appointments.length">
      <li
        v-for="appointment in appointments"
        :key="`${appointment.date.split('T')[0]}-${appointment.startTime}`"
      >
        <fa-icon icon="check-circle" class="mr-1" />
        <p>
          <span class="fw-bold mr-1">{{ appointment.date.split("T")[0] }}</span>
          -
          <span class="mr-1">{{ appointment.startTime }} hrs</span>
          <small class="d-block fs-italic">{{ appointment.email }}</small>
        </p>
        <div>
          <button class="btn--primary" @click="showAlertDelete(appointment._id)">
            <fa-icon icon="trash" size="sm" class="mr-1" />Delete
          </button>
          <button
            class="btn--outlined"
            @click="
              showAlert({
                icon: 'warning',
                title: 'Sorry...',
                text: 'This action is not available from the client side.',
              })
            "
          >
            <fa-icon icon="pen" size="sm" class="mr-1" />Edit
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "axios";
import { globalUrl } from "@/constants/constants";
export default {
  name: "SearchAppointments",
  data() {
    return {
      appointments: [],
      date: this.$route.params.date,
      disableButton: false,
      selectedDate: "",
    };
  },
  mounted() {
    this.getAppointments(this.date);
  },
  methods: {
    getAppointments(date = "") {
      let endpoint = `${globalUrl}appointments`;
      if (date.length) {
        endpoint = `${endpoint}/${date}`;
      }

      this.disableButton = true;

      axios.get(`${endpoint}`).then((res) => {
        if (res.data.status === "success") {
          this.appointments = res.data.appointments;
        }
      });
      this.disableButton = false;
    },
    showAlert(options) {
      // Use sweetalert2
      this.$swal(options);
    },
    showAlertDelete(id) {
      // Use sweetalert2
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`${globalUrl}appointment/${id}`).then((res) => {
            if (res.data.status === "success") {
              this.showAlert({
                icon: "success",
                title: "Deleted!",
                text: "Your appointment has been deleted.",
                timer: 2000,
              });
            }
            this.getAppointments();
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === this.$swal.DismissReason.cancel
        ) {
          this.showAlert({
            icon: "error",
            title: "Cancelled!",
            text: "Don't worry there was no changes.",
            timer: 2000,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
section {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #fbfbfb;
  border-radius: 1.7rem;
  margin: 2rem auto;
  min-height: calc(
    100vh - 86px - 98px
  ); /* Less MainNavigation and MainFooter */
  padding: 2.25rem clamp(1.7rem, 5%, 2.7rem);
  width: clamp(260px, 80%, 700px);
}

section > header {
  color: var(--primary);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.display-2 {
  color: var(--base-tint);
  font-size: clamp(1.5rem, 5%, 2.5rem);
  font-style: italic;
  font-weight: 600;
  text-align: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  color: var(--base);
  display: flex;
  flex-flow: row wrap;
  word-break: break-all;
  word-wrap: break-word;
}

li p {
  flex-grow: 3;
}

ul li + li {
  margin-top: 1.5rem;
}

/*
 * Responsive breakpoints
 */
@media screen and (min-width: 992px) {
  section {
    min-height: calc(
      100vh - 72px - 58px - 4rem
    ); /* Less MainNavigation, MainFooter and Vmargins */
  }
}
</style>