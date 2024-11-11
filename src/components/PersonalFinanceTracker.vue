<!-- PersonalFinanceTracker.vue -->
<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="800">
      <v-card-title class="text-h4 mb-4"> Personal Finance Tracker </v-card-title>

      <!-- Input Form -->
      <v-form @submit.prevent="addTransaction" v-model="valid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="newTransaction.description"
              label="Description"
              :rules="[(v) => !!v || 'Description is required']"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="newTransaction.amount"
              label="Amount"
              type="number"
              prefix="Rp"
              :rules="[
                (v) => !!v || 'Amount is required',
                (v) => v > 0 || 'Amount must be greater than 0',
              ]"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="primary" type="submit" block :disabled="!valid"> Add Transaction </v-btn>
      </v-form>

      <!-- Transaction List -->
      <v-card-text class="mt-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-h5">Transactions</div>
          <v-btn color="error" @click="clearAllTransactions" :disabled="!transactions.length">
            Clear All
          </v-btn>
        </div>

        <v-list v-if="transactions.length">
          <v-list-item
            v-for="(transaction, index) in transactions"
            :key="index"
            :class="{
              'bg-green-lighten-5': transaction.amount > 0,
              'bg-red-lighten-5': transaction.amount < 0,
            }"
          >
            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>
              Rp {{ Number(transaction.amount).toLocaleString() }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                @click="deleteTransaction(index)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-alert v-else type="info" text="No transactions found"></v-alert>

        <!-- Total Balance -->
        <v-card class="mt-4" :color="totalBalance >= 0 ? 'success' : 'error'" variant="outlined">
          <v-card-text class="text-h6 white--text">
            Total Balance: Rp {{ totalBalance.toLocaleString() }}
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PersonalFinanceTracker',
  data() {
    return {
      valid: false,
      transactions: [],
      newTransaction: {
        description: '',
        amount: '',
      },
    }
  },
  computed: {
    totalBalance() {
      return this.transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    },
  },
  methods: {
    addTransaction() {
      if (this.valid) {
        this.transactions.push({
          description: this.newTransaction.description,
          amount: Number(this.newTransaction.amount),
        })
        // Reset form
        this.newTransaction.description = ''
        this.newTransaction.amount = ''
      }
    },
    deleteTransaction(index) {
      this.transactions.splice(index, 1)
    },
    clearAllTransactions() {
      this.transactions = []
    },
  },
}
</script>
