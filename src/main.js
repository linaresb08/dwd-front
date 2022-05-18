import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// * Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './fa-icons'

// * Sweet Alert
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
  confirmButtonColor: '#782116',
  cancelButtonColor: '#fc8421',
};

const app = createApp(App)

app.use(router)
app.use(VueSweetalert2, options);
app.component('fa-icon', FontAwesomeIcon)

app.mount('#app');