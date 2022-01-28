<template>
  <div>
    <el-alert
      :model="form"
      v-if="form.success"
      :title="form.successText"
      type="success"
      @close="turnOff('success')"
    ></el-alert>
    <el-alert
      :model="form"
      v-if="form.error"
      :title="form.errorText"
      type="error"
      @close="turnOff('error')"
    ></el-alert>
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
  import axios from 'axios'

  import router from '../routes'
  import { authenticate, isAuth } from '../utils/helpers'
  import { SIGNIN_URL } from '../constants'

  if (isAuth()) {
    router.push('/')
  }

  // do not use same name with ref
  const form = reactive({
    email: '',
    password: '',
    success: false,
    successText: '',
    error: false,
    errorText: '',
  })

  const turnOff = property => {
    form[property] = false
  }

  const onSubmit = async () => {
    try {
      const resp = await axios({
        method: 'POST',
        url: SIGNIN_URL,
        data: { email: form.email, password: form.password },
      })
      form.email = ''
      form.password = ''
      form.success = true
      form.successText = resp.data.message
      authenticate(resp)
      router.push('/')
    } catch (err) {
      form.error = true
      form.errorText = err.response.data.message
    }
  }
</script>
