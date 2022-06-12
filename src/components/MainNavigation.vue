<template>
  <header class="navigation">
    <nav>
      <router-link to="/" tabindex="1">
        <div class="brand">
          <span class="brand__item">D</span>
          <span class="brand__item">ANCE WITH</span>
          <span class="brand__item">EATH</span>
        </div>
      </router-link>
      <ul
        :class="[
          'menu',
          activeView === 'appointments' ? 'selected--right' : 'selected--left',
        ]"
      >
        <router-link to="/" tabindex="2">
          <li class="menu__item">
            <fa-icon icon="calendar-plus" size="sm" />
            Booking
          </li>
        </router-link>
        <router-link to="/appointments" tabindex="3">
          <li class="menu__item">
            <fa-icon icon="search" size="sm" />
            Search all
          </li>
        </router-link>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "MainNavigation",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    activeView() {
      return this.$route.path.split("/")[1];
    },
  },
};
</script>

<style scoped>
/*
 * Navigation
 */
.navigation {
  background-color: #ffffff;
  box-shadow: 0px 2px 10px rgba(48, 47, 54, 0.1);
  bottom: 0;
  position: fixed;
  padding: 0.75rem 0.25rem;
  width: 100%;
  z-index: 1;
}

.navigation nav {
  align-items: center;
  display: flex;
  flex-flow: row wrap-reverse;
  justify-content: space-around;
  margin: 0 auto;
  width: clamp(260px, 90%, 1024px);
}

/*
 * Navigation - Brand
 */
nav > a {
  text-decoration: none;
}
.navigation .brand {
  cursor: pointer;
  margin: 0.4rem 0.75rem;
  user-select: none;
  width: 100px;
  word-wrap: break-word;
}

.brand::after {
  content: "";
  clear: both;
  display: table;
}

.brand__item {
  color: var(--base);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
}

.brand__item:first-child,
.brand__item:last-child {
  color: var(--primary);
  display: block;
  white-space: nowrap;
}

.brand__item:first-child {
  float: left;
  font-size: 3rem;
  line-height: 2.5rem;
}

.brand__item:last-child {
  font-size: 1.25rem;
  letter-spacing: 0.28em;
  line-height: 0.8;
  word-break: break-all;
}

/*
 * Navigation - Menu
 */
.navigation .menu {
  display: flex;
  list-style: none;
  position: relative;
}

.menu::before {
  background-color: var(--primary-tint);
  border-radius: var(--radius);
  content: "";
  display: block;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transition: left 0.25s ease-out;
  width: 115px;
  z-index: -1;
}

.menu.selected--left::before {
  left: 0.25rem;
}

.menu.selected--right::before {
  left: calc(115px + 0.75rem);
}

.menu a {
  background-color: transparent;
  color: var(--base);
  margin: 0 0.25rem;
  text-decoration: none;
}

.router-link-active.router-link-exact-active,
.menu a:hover .menu__item,
.menu a:hover .icon {
  color: var(--primary);
}

.menu__item {
  font-size: 0.8rem;
  padding: 0.5rem;
  text-align: center;
  text-transform: uppercase;
  transition: color 0.2s ease;
  width: 115px;
}

/*
 * Responsives breakpoints
 */
@media screen and (min-width: 576px) {
  .navigation nav {
    justify-content: space-between;
  }
}

@media screen and (min-width: 992px) {
  .navigation {
    position: sticky;
    bottom: auto;
    box-shadow: 0px -2px 10px rgba(48, 47, 54, 0.1);
    top: 0;
  }

  .navigation .brand {
    margin: 0 0.75rem;
  }

  .menu::before {
    width: 140px;
  }
  .menu.selected--right::before {
    left: calc(140px + 0.75rem);
  }
  .menu__item {
    width: 140px;
  }
}
</style>
