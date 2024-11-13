<template>
  <v-container>
    <!-- Summary Section -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Account Summary</h2>
      </v-col>
    </v-row>

    <v-row>
      <!-- Total Accounts Card -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="summary-card">
          <v-card-item>
            <v-card-title class="text-subtitle-1 text-medium-emphasis">
              Total Accounts
            </v-card-title>
            <div class="text-h4 mt-2">
              {{ accounts.length }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Total Balance Card -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="summary-card">
          <v-card-item>
            <v-card-title class="text-subtitle-1 text-medium-emphasis">
              Total Balance
            </v-card-title>
            <div class="text-h4 mt-2">
              {{ formatCurrency(totalBalance) }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Average Balance Card -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="summary-card">
          <v-card-item>
            <v-card-title class="text-subtitle-1 text-medium-emphasis">
              Average Balance
            </v-card-title>
            <div class="text-h4 mt-2">
              {{ formatCurrency(averageBalance) }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Account List Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Account List</h2>

        <v-card>
          <v-data-table
            :headers="headers"
            :items="accounts"
            :loading="loading"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row" :loading="loading"></v-skeleton-loader>
            </template>

            <!-- Custom formatting for balance column -->
            <template v-slot:item.balance="{ item }">
              {{ formatCurrency(item.columns.balance) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AccountExplorer',
  data() {
    return {
      accounts: [],
      loading: true,
      error: null,
      headers: [
        {
          title: 'Account ID',
          align: 'start',
          key: 'account_id',
          sortable: true,
        },
        {
          title: 'Name',
          key: 'name',
          sortable: true,
        },
        {
          title: 'Balance',
          key: 'balance',
          align: 'end',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    totalBalance() {
      return this.accounts.reduce((sum, account) => sum + account.balance, 0)
    },
    averageBalance() {
      return this.accounts.length ? this.totalBalance / this.accounts.length : 0
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    },
    async fetchAccounts() {
      try {
        this.loading = true
        const response = await axios.get('http://localhost:8080/account/list')
        // Extract the data array from the response
        this.accounts = response.data.data
      } catch (err) {
        this.$root.$emit('show-snackbar', {
          color: 'error',
          text: 'Failed to fetch accounts: ' + err.message,
        })
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.fetchAccounts()
  },
}
</script>

<style scoped>
.summary-card {
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
}

.v-card-title {
  font-weight: 500;
}
</style>
