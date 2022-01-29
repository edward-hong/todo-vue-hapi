<template>
  <div>
    <el-alert
      v-if="success"
      :title="successText"
      type="success"
      @close="turnOff('success')"
    ></el-alert>
    <el-alert
      v-if="error"
      :title="errorText"
      type="error"
      @close="turnOff('error')"
    ></el-alert>
    <h1 class="heading">Forgot Password</h1>
    <el-form class="form" label-width="80px">
      <el-form-item :required="true" label="Email">
        <el-input
          v-model="email"
          type="email"
          @keydown.enter.prevent="onSubmit"
          placeholder="Enter your email"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="onSubmit">Reset Password</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  import { FORGOT_URL } from '../constants'

  export default {
    data() {
      return {
        email: '',
        success: false,
        successText: '',
        error: false,
        errorText: '',
      }
    },
    methods: {
      turnOff(property) {
        this[property] = false
      },
      async onSubmit() {
        try {
          const { data } = await axios({
            method: 'PUT',
            url: FORGOT_URL,
            data: { email: this.email },
          })

          this.email = ''
          this.success = true
          this.successText = data.message
        } catch (err) {
          this.error = true
          this.errorText = err.message
        }
      },
    },
  }
</script>
