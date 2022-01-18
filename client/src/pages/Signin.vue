<template>
  <div>
    <h1 class="heading">Signin</h1>
    <el-form class="form" ref="formRef" :model="form" label-width="80px">
      <el-form-item :required="true" label="Email">
        <el-input v-model="form.email" type="email"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="Password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="onSubmit">Signin</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
  .heading {
    text-align: center;
    margin-top: 2rem;
    font-size: 3rem;
    color: #409eff;
  }
  .form {
    text-align: center;
    margin: 2rem auto;
    max-width: 600px;
  }
  .el-form-item__content {
    justify-content: center;
  }
</style>

<script setup>
  import { reactive } from 'vue'

  // do not use same name with ref
  const form = reactive({
    email: '',
    password: '',
  })

  const onSubmit = () => {
    console.log('submit!')
  }
</script>
