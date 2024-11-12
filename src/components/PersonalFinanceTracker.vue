<!-- PersonalFinanceTracker.vue -->
<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="1000">
      <v-card-title class="text-h4 mb-4"> Dompetku v2 </v-card-title>

      <!-- Summary Cards -->
      <v-row class="mb-4">
        <v-col cols="12" md="3">
          <v-card color="primary" variant="tonal">
            <v-card-text>
              <div class="text-subtitle-1">Total Transactions</div>
              <div class="text-h5">{{ transactions.length }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="success" variant="tonal">
            <v-card-text>
              <div class="text-subtitle-1">Total Income</div>
              <div class="text-h5">Rp {{ totalIncome.toLocaleString() }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="error" variant="tonal">
            <v-card-text>
              <div class="text-subtitle-1">Total Expenses</div>
              <div class="text-h5">Rp {{ totalExpenses.toLocaleString() }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card :color="totalBalance >= 0 ? 'success' : 'error'" variant="tonal">
            <v-card-text>
              <div class="text-subtitle-1">Balance</div>
              <div class="text-h5">Rp {{ totalBalance.toLocaleString() }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Input Form -->
      <v-form @submit.prevent="addTransaction" v-model="valid">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="newTransaction.description"
              label="Description"
              :rules="[(v) => !!v || 'Description is required']"
              required
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="newTransaction.category"
              :items="categories"
              label="Category"
              :rules="[(v) => !!v || 'Category is required']"
              required
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="newTransaction.amount"
              label="Amount"
              type="number"
              prefix="Rp"
              :rules="[
                (v) => !!v || 'Amount is required',
                (v) => v != 0 || 'Amount cannot be zero',
              ]"
              required
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="newTransaction.type"
              :items="['Income', 'Expense']"
              label="Type"
              :rules="[(v) => !!v || 'Type is required']"
              required
              density="comfortable"
            ></v-select>
          </v-col>
        </v-row>
        <v-btn color="primary" type="submit" block :disabled="!valid" :loading="loading">
          Add Transaction
        </v-btn>
      </v-form>

      <!-- Transaction List -->
      <v-card-text class="mt-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-h5">Transactions</div>
          <v-btn color="error" @click="confirmClearAll" :disabled="!transactions.length">
            Clear All
          </v-btn>
        </div>

        <v-list v-if="transactions.length">
          <v-list-item
            v-for="(transaction, index) in transactions"
            :key="index"
            :class="{
              'bg-green-lighten-5': transaction.type === 'Income',
              'bg-red-lighten-5': transaction.type === 'Expense',
            }"
          >
            <template v-slot:prepend>
              <v-icon :color="transaction.type === 'Income' ? 'success' : 'error'">
                {{
                  transaction.type === 'Income' ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle'
                }}
              </v-icon>
            </template>

            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>
              Category: {{ transaction.category }} | Rp
              {{ Number(transaction.amount).toLocaleString() }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                @click="confirmDelete(index)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-alert v-else type="info" text="No transactions found"></v-alert>
      </v-card-text>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog.show" max-width="500px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          {{ deleteDialog.message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog.show = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="executeDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'PersonalFinanceTracker',
  data() {
    return {
      valid: false,
      loading: false,
      transactions: [],
      newTransaction: {
        description: '',
        category: '',
        amount: '',
        type: 'Expense',
      },
      categories: [
        'Food & Beverage',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills',
        'Healthcare',
        'Education',
        'Salary',
        'Investment',
        'Other',
      ],
      deleteDialog: {
        show: false,
        message: '',
        callback: null,
      },
    }
  },
  computed: {
    totalIncome() {
      return this.transactions
        .filter((t) => t.type === 'Income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    },
    totalExpenses() {
      return this.transactions
        .filter((t) => t.type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    },
    totalBalance() {
      return this.totalIncome - this.totalExpenses
    },
  },
  methods: {
    addTransaction() {
      if (this.valid) {
        this.loading = true
        const amount =
          this.newTransaction.type === 'Expense'
            ? -Math.abs(Number(this.newTransaction.amount))
            : Math.abs(Number(this.newTransaction.amount))

        const transaction = {
          description: this.newTransaction.description,
          category: this.newTransaction.category,
          amount: amount,
          type: this.newTransaction.type,
          date: new Date().toISOString(),
        }

        this.transactions.unshift(transaction)
        this.saveToLocalStorage()

        // Reset form
        this.newTransaction = {
          description: '',
          category: '',
          amount: '',
          type: 'Expense',
        }

        this.loading = false
      }
    },
    confirmDelete(index) {
      this.deleteDialog = {
        show: true,
        message: 'Are you sure you want to delete this transaction?',
        callback: () => this.deleteTransaction(index),
      }
    },
    confirmClearAll() {
      this.deleteDialog = {
        show: true,
        message: 'Are you sure you want to delete all transactions? This action cannot be undone.',
        callback: this.clearAllTransactions,
      }
    },
    executeDelete() {
      if (this.deleteDialog.callback) {
        this.deleteDialog.callback()
      }
      this.deleteDialog.show = false
    },
    deleteTransaction(index) {
      this.transactions.splice(index, 1)
      this.saveToLocalStorage()
    },
    clearAllTransactions() {
      this.transactions = []
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('dompetku-transactions', JSON.stringify(this.transactions))
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('dompetku-transactions')
      if (saved) {
        this.transactions = JSON.parse(saved)
      }
    },
  },
  mounted() {
    this.loadFromLocalStorage()
  },
}
</script>
