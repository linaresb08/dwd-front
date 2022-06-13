<template>
  <div>
    <section class="card__container">
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
      <p v-if="disableButton" class="display-2">
        <fa-icon icon="circle-notch" size="lg" class="fa-spin mr-1" />
        Checking appointments
      </p>
      <p v-else-if="!disableButton && !appointments.length" class="display-2">
        <fa-icon icon="calendar-times" size="lg" class="mr-1" />
        There are no appointments
        <span v-if="selectedDate" class="fs-inherit">
          for this day
        </span>
      </p>
      <ul v-if="appointments && appointments.length">
        <li
          v-for="appointment in appointments"
          :key="`${appointment.date}-${appointment.startTime}`"
        >
          <fa-icon
            v-if="appointment.date < todayDate"
            icon="check-circle" class="mr-1"
          />
          <fa-icon v-else :icon="['far', 'circle']" class="mr-1" />
          <p>
            <span class="fw-bold mr-1">{{ appointment.date }}</span>
            -
            <span class="mr-1">{{ appointment.startTime }} hrs</span>
            <small class="d-block fs-italic">{{ appointment.email }}</small>
          </p>
          <div v-if="appointment.date < todayDate">
            <button
              class="btn--outlined"
              @click="
                showAlert({
                  icon: 'success',
                  title: 'Completed class!',
                  text: `${appointment.email} has successfully completed class with master for ${appointment.date} at ${appointment.startTime} hrs until ${appointment.startTime + 1} hrs. Congratulations`,
                })
              "
            >
              <fa-icon icon="plus" size="sm" class="mr-1" />Details
            </button>
          </div>
          <div v-else>
            <button class="btn--primary" @click="showAlertDelete(appointment._id)">
              <fa-icon icon="trash" size="sm" class="mr-1" />Delete
            </button>
            <button
              class="btn--outlined"
              @click="activateEditingForm(appointment)"
            >
              <fa-icon icon="pen" size="sm" class="mr-1" />Edit
            </button>
          </div>
        </li>
      </ul>
    </section>
    <modal-editing-appointment
      :Appointment="appointment"
      :show-modal="showEditingForm"
      @close="closeEditingForm($event)"
    />
  </div>
</template>

<script>
import axios from "axios";
import { globalUrl } from "@/constants/constants";
import ModalEditingAppointment from "@/components/ModalEditingAppointment.vue";
import Appointment from "@/models/Appointment";

export default {
  name: "SearchAppointments",
  components: {
    ModalEditingAppointment,
  },
  data() {
    return {
      appointment: new Appointment("", "", ""),
      appointments: [],
      date: this.$route.params.date,
      disableButton: false,
      selectedDate: "",
      showEditingForm: false,
      todayDate: new Date().toISOString().split("T")[0],
    };
  },
  mounted() {
    this.getAppointments(this.date);
  },
  methods: {
    activateEditingForm(appointment) {
      this.showEditingForm = true;
      this.appointment = appointment;
    },
    closeEditingForm(reload = false) {
      this.showEditingForm = false;

      if (reload) {
        this.getAppointments(this.selectedDate);
      }
    },
    getAppointments(date = "") {
      let endpoint = `${globalUrl}appointments`;
      if (date.length) {
        endpoint = `${endpoint}/${date}`;
      }

      this.disableButton = true;

      axios.get(`${endpoint}`).then((res) => {
        if (res.data.status === "success") {
          this.appointments = res.data.appointments.map(appointment => {
            appointment.date = appointment.date.split("T")[0];
            appointment.startTime = Number(appointment.startTime);
            return appointment;
          });
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
.card__container {
  min-height: calc(
    100vh - 86px - 98px
  ); /* Less MainNavigation and MainFooter */
  width: clamp(260px, 80%, 700px);
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
  .card__container {
    min-height: calc(
      100vh - 72px - 58px - 4rem
    ); /* Less MainNavigation, MainFooter and Vmargins */
  }
}
</style>