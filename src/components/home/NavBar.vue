<template>
  <div>
    <b-navbar fixed="top"
              type="light"
              variant="faded"
              toggleable>
      <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
      <b-navbar-brand class="brand-logo">
        <img src="../../assets/imgs/logo-small.png">
      </b-navbar-brand>
      <b-collapse is-nav
                  visible
                  id="nav_dropdown_collapse">
        <b-navbar-nav>
          <b-nav-item-dropdown text="User"
                               class="user-account">
            <b-dropdown-item href="#">Account</b-dropdown-item>
            <b-dropdown-item href="#">Settings</b-dropdown-item>
            <b-dropdown-item href="#">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>

</template>

<script>
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand'
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown'
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item'

export default {
    name: 'NavBar',
    components: {
        bNavbar,
        bNavbarNav,
        bNavbarBrand,
        bNavbarToggle,
        bCollapse,
        bNavItemDropdown,
        bDropdownItem
    }
}
</script>

<style scoped>
.brand-logo {
    float: left;
    margin-left: 20px;
    margin-top: 4px;
}
</style>
