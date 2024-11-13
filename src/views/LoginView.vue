<!-- src/views/LoginView.vue -->
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" v-model="valid">
              <v-text-field
                v-model="username"
                :rules="[(v) => !!v || 'Username is required']"
                label="Username"
                prepend-icon="mdi-account"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[(v) => !!v || 'Password is required']"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="!valid">
              Login
            </v-btn>
          </v-card-actions>

          <v-alert v-if="error" type="error" class="ma-3">
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      valid: false,
      loading: false,
      error: null,
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.valid) return

      this.loading = true
      this.error = null

      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        })
        this.$router.push('/')
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
