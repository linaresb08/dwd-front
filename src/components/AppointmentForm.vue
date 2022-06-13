<template>
  <form @submit.prevent="saveAppointment()">
    <div>
      <label for="date">Choose a date</label>
      <input
        type="date"
        id="date"
        v-model="appointment.date"
        placeholder="Select a date"
        :min="firstDay"
        :max="lastDay"
        required
        @input="findAvailableHours(appointment.date)"
      />
    </div>
    <small v-if="!availableHours.length && !scheduledPeople.length">
      Select a day from Monday to Friday
    </small>
    <small
      v-else-if="!availableHours.length && scheduledPeople.length"
      class="text--danger"
    >
      <fa-icon icon="exclamation-triangle" size="sm" />
      There are no available hours for that date
    </small>
    <div v-else class="mt-4">
      <fieldset class="radio__buttons">
        <legend>Choose your preffered hour at day</legend>
        <label
          v-for="hour in availableHours"
          :key="hour"
          :class="[
            'option',
            { 'option--selected': hour === appointment.startTime },
          ]"
        >
          <input
            type="radio"
            v-model.number="appointment.startTime"
            :value="hour"
            name="available-hours"
            class="d-none"
          />
          <fa-icon
            :icon="
              hour === appointment.startTime
                ? 'check-circle'
                : ['far', 'circle']
            "
          />
          {{ hour }}hrs
        </label>
      </fieldset>
    </div>
    <div v-if="appointment.startTime" class="mt-4">
      <label for="email">Tell us your email contact</label>
      <input
        type="email"
        id="email"
        v-model="appointment.email"
        placeholder="example@mail.com"
        required
      />
    </div>
    <button
      type="submit"
      class="btn--block btn--primary mt-4"
      :disabled="disableButton"
    >
      <fa-icon v-if="disableButton" icon="circle-notch" size="sm" class="fa-spin mr-1" />
      <fa-icon v-else icon="calendar-check" size="sm" class="mr-1" />
      Save date
    </button>
  </form>
</template>

<script>
import axios from "axios";
import Appointment from "@/models/Appointment";
import { emailRegex, globalUrl, workingHours } from "@/constants/constants";

export default {
  name: 'AppointmentForm',

  data() {
    return {
      appointment: new Appointment("", "", ""),
      availableHours: [],
      disableButton: false,
      scheduledPeople: [],
      workingHours,

      // * Min and max date
      firstDay: "",
      lastDay: "",
    };
  },
  mounted() {
    this.setCurrentMonth();
  },
  methods: {
    findAvailableHours(date) {
      // * Format date to YYYY-MM-DD to know if it's a working day
      const dateSplit = date.split("-");
      const dateFormatted = new Date(
        dateSplit[0],
        dateSplit[1] - 1,
        dateSplit[2]
      );
      const day = dateFormatted.getDay();

      // * If it's Sun or Sat, don't show available hours
      if (day === 0 || day === 6) {
        this.disableButton = true;
        return this.showAlert({
          icon: "warning",
          title: "Sorry,",
          text: "We are not working on weekends. Please select another date",
          timer: 2000,
        });
      }

      this.disableButton = false;

      let appointments = [];
      let availableHours = [];

      axios
        .get(`${globalUrl}appointments/${date}`)
        .then((res) => {
          if (res.data.status === "success") {
            appointments.push(...res.data.appointments);

            if (appointments.length) {
              this.scheduledPeople = appointments.map(
                (appointment) => appointment.email
              );
              const notAvailableHours = appointments.map(
                (appointment) => Number(appointment.startTime)
              );

              if (notAvailableHours.length < 9) {
                availableHours = this.workingHours.filter((hour) => {
                  if (!notAvailableHours.includes(hour)) {
                    return hour;
                  }
                });
              }
              this.availableHours = availableHours;
            } else {
              this.availableHours = workingHours;
            }
          }
        })
        .catch((error) => {
          this.showAlert({
            icon: "error",
            title: "Oops...",
            text: "We receive this error: " + error.response.data.message,
            timer: 2000,
          });
        });
    },
    saveAppointment() {
      // * Validate filled fields
      if (
        !this.appointment.date ||
        !this.appointment.startTime ||
        !this.appointment.email
      ) {
        return this.showAlert({
          icon: "warning",
          title: "Oops...",
          text: "It seems to be missing information. Please fill all the fields",
        });
      }

      // * Validate startTime
      if (!this.workingHours.includes(this.appointment.startTime)) {
        return this.showAlert({
          icon: "error",
          title: "Oh no...",
          text: "The selected hour is not available",
        });
      }

      // * Validate email format
      if (!emailRegex.test(this.appointment.email)) {
        return this.showAlert({
          icon: "error",
          title: "This is awkward but...",
          text: "Your email is not valid. Please check it",
        });
      }

      // * Validate an appointment for the same date
      if (this.scheduledPeople.includes(this.appointment.email)) {
        return this.showAlert({
          icon: "warning",
          title: "Sorry...",
          text: "You already have an appointment for this date. Please select another date",
        });
      }

      this.disableButton = true;

      axios
        .post(`${globalUrl}save`, this.appointment)
        .then((res) => {
          if (res.data.status === "success") {
            this.showAlert({
              icon: "success",
              title: "Awesome!",
              text: `Appointment saved for ${this.appointment.date} at ${this.appointment.startTime} hrs. See you soon`,
            });

            this.appointment = new Appointment("", "", "");
            this.availableHours = [];
            this.disableButton = false;
            this.scheduledPeople = [];
          } else {
            this.showAlert({
              icon: "error",
              title: "Something went wrong",
              text: "Error saving appointment",
            });
          }
        })
        .catch((error) => {
          this.showAlert({
            icon: "error",
            title: "Oops...",
            text: "We receive this error: " + error.response.data.message,
            timer: 2000,
          });
        });
    },
    setCurrentMonth() {
      // * Calculate min and max date
      const date = new Date();
      const [firstDayOfMonth] = new Date(date.getFullYear(), date.getMonth(), 0)
        .toISOString()
        .split("T");
      const [lastDayOfMonth] = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T");

      this.firstDay = firstDayOfMonth;
      this.lastDay = lastDayOfMonth;
    },
    showAlert(options) {
      // Use sweetalert2
      this.$swal(options);
    },
  },
}
</script>