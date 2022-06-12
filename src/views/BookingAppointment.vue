<template>
  <main>
    <header>
      <span class="subtitle">Let's set the</span>
      <h2>APPOINTMENT</h2>
      <p>And have the chance to learn to dance with the master</p>
    </header>
    <form class="form__card" @submit.prevent="saveAppointment()">
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
        <fa-icon icon="calendar-check" size="sm" class="mr-1" />
        Save date
      </button>
    </form>
    <div class="image__container">
      <img src="/imgs/dwd.png" alt="Dancing with the Death" class="image" />
    </div>
  </main>
</template>

<script>
import axios from "axios";
import Appointment from "@/models/Appointment";
import { emailRegex, globalUrl, workingHours } from "@/constants/constants";

export default {
  name: "BookingAppointment",
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
          text: "We are not working on weekends",
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
              text: "Appointment saved. See you soon",
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

.radio__buttons {
  border: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  row-gap: 0.5rem;
}

.radio__buttons > .option {
  cursor: pointer;
  padding: 0.5rem 0;
  white-space: nowrap;
}
.radio__buttons > .option.option--selected {
  color: var(--primary-shade);
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