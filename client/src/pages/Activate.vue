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
    <h1 class="heading">Hi {{ name }}, ready to activate your account?</h1>
    <div class="buttonWrapper">
      <el-button type="primary" @click="handleActivate">Activate</el-button>
    </div>
  </div>
</template>

<style scoped>
  .heading {
    margin-bottom: 2rem;
  }
  .buttonWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  import axios from 'axios'
  import decode from 'jwt-decode'

  import router from '../routes'
  import { ACTIVATE_URL } from '../constants'

  export default {
    data() {
      return {
        token: router.currentRoute.value.params.token,
        name: decode(router.currentRoute.value.params.token).name,
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
      async handleActivate() {
        try {
          const resp = await axios({
            method: 'POST',
            url: ACTIVATE_URL,
            data: { token: this.token },
          })
          this.success = true
          this.successText = resp.data.message
        } catch (err) {
          this.error = true
          this.errorText = err.response.data.message
        }
      },
    },
  }
</script>
