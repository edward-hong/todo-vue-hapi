<template>
  <el-menu class="navbar" mode="horizontal" :router="true">
    <el-menu-item class="brand" index="/">Todo</el-menu-item>
    <el-menu-item class="nav-item" index="/signup">Signup</el-menu-item>
    <el-menu-item index="/signin">Signin</el-menu-item>
  </el-menu>
</template>

<style>
  .brand {
    font-size: 1.2rem;
  }
  .el-menu > .el-menu-item.nav-item {
    margin-left: auto;
  }
</style>

<script setup></script>
