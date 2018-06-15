<template>
  <div>
    <b-navbar fixed="top"
              type="primary"
              variant="faded"
              toggleable>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand class="brand-logo">
        <img src="../../assets/imgs/logo-small.png">
      </b-navbar-brand>
      <b-collapse is-nav
                  id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item-dropdown right
                               text="User">
            <b-dropdown-item href="#">Account</b-dropdown-item>
            <b-dropdown-item href="#">Settings</b-dropdown-item>
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
    name: 'Header',
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
@import '../../assets/style/common.less';
.brand-logo {
    float: left;
    margin-left: 36px;
    margin-top: 12px;
}
.navbar-toggler {

    :after {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: .255em;
        vertical-align: .255em;
        content: "";
        border-top: .3em solid;
        border-right: .3em solid transparent;
        border-bottom: 0;
        border-left: .3em solid transparent;
    }

}

</style>