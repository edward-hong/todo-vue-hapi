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
    <h1 class="heading">Reset Password</h1>
    <el-form class="form" label-width="80px">
      <el-form-item :required="true" label="Password">
        <el-input
          v-model="password"
          type="password"
          @keydown.enter.prevent="onSubmit"
          placeholder="New password"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="onSubmit">Set New Password</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  import router from '../routes'
  import { RESET_URL } from '../constants'

  export default {
    data() {
      return {
        password: '',
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
            url: RESET_URL,
            data: {
              newPassword: this.password,
              resetPasswordLink: router.currentRoute.value.params.token,
            },
          })

          this.password = ''
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
