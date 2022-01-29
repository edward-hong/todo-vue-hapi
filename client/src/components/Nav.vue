<template>
  <el-menu class="navbar" mode="horizontal" :router="true">
    <el-menu-item class="brand" index="/">Todo</el-menu-item>
    <template v-if="!isAuth">
      <el-menu-item class="nav-item" index="/signup">Signup</el-menu-item>
      <el-menu-item index="/signin">Signin</el-menu-item>
    </template>
    <template v-else>
      <el-menu-item class="nav-item" index="/signin" @click="handleSignout"
        >Signout</el-menu-item
      >
    </template>
  </el-menu>
</template>

<style>
  .brand {
    font-size: 1.2rem;
  }
  .el-menu--horizontal > .el-menu-item {
    color: var(--el-color-primary);
  }
  .el-menu > .el-menu-item.nav-item {
    margin-left: auto;
  }
</style>

<script>
  import { isAuth, signout } from '../utils/helpers'

  export default {
    data() {
      return {
        isAuth: isAuth(),
      }
    },
    methods: {
      handleSignout() {
        signout(() => {
          this.isAuth = false
        })
      },
    },
    created() {
      const user = localStorage.getItem('user')
      user ? (this.isAuth = true) : (this.isAuth = false)
    },
  }
</script>
