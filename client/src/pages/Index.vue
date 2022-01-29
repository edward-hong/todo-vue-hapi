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
    <div class="todo-container">
      <h1 class="heading">Todo List</h1>
      <el-input
        v-model="newTodo.todo"
        placeholder="Add todo"
        @keydown.enter="handleAdd"
      >
        <template #append>
          <el-button
            :icon="plus"
            @click="handleAdd"
            :disabled="isDisabled"
          ></el-button>
        </template>
      </el-input>
      <ul class="unordered-list">
        <li class="list-item" v-for="(todo, i) in todos" :key="todo._rev">
          <template v-if="todo.isEdit">
            <el-input
              v-model="tempEditTodo"
              placeholder="Edit todo"
              @keydown.enter="handleEdit(i)"
            >
              <template #append>
                <el-button-group class="edit-button-group">
                  <el-button :icon="edit" @click="handleEdit(i)"></el-button>
                  <el-button
                    :icon="close"
                    @click="handleEditMode(i)"
                  ></el-button>
                </el-button-group>
              </template>
            </el-input>
          </template>
          <template v-else>
            {{ todo.todo }}
            <el-button-group>
              <el-button
                type="primary"
                :icon="check"
                @click="handleComplete(i)"
              ></el-button>
              <el-button
                type="primary"
                :icon="edit"
                @click="handleEditMode(i)"
              ></el-button>
              <el-button
                type="primary"
                :icon="deleteIcon"
                @click="handleDelete(i, todo.completed)"
              ></el-button>
            </el-button-group>
          </template>
        </li>
      </ul>
      <template v-if="completedTodos.length !== 0">
        <h2 class="subheading">Completed</h2>
        <ul class="unordered-list">
          <li
            class="list-item completed"
            v-for="(todo, i) in completedTodos"
            :key="todo._rev"
          >
            {{ todo.todo }}
            <el-button
              type="primary"
              :icon="deleteIcon"
              @click="handleDelete(i, todo.completed)"
              :disabled="isDisabled"
            ></el-button>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .heading {
    margin-bottom: 2rem;
  }

  .subheading {
    margin: 2rem 0;
    text-align: center;
    font-size: 2rem;
    color: var(--el-color-primary);
  }

  .todo-container {
    max-width: 600px;
    margin: auto;
  }

  .unordered-list {
    margin: 20px 0;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    padding: 0 11px;
    margin-bottom: 3px;
  }

  .completed {
    text-decoration: line-through;
  }

  .edit-button-group {
    width: 51px;
  }
</style>

<script>
  import { shallowRef } from 'vue'
  import axios from 'axios'
  import { Plus, Check, Edit, Delete, Close } from '@element-plus/icons-vue'

  import router from '../routes'
  import { isAuth } from '../utils/helpers'
  import {
    TODOS_URL,
    ADD_TODO_URL,
    COMPLETE_TODO_URL,
    EDIT_TODO_URL,
    DELETE_TODO_URL,
  } from '../constants'

  const userEmail = JSON.parse(localStorage.getItem('user'))?.email

  export default {
    data() {
      return {
        todos: [],
        completedTodos: [],
        newTodo: {
          todo: '',
          isEdit: false,
          completed: false,
          email: userEmail,
        },
        tempEditTodo: '',
        plus: shallowRef(Plus),
        check: shallowRef(Check),
        edit: shallowRef(Edit),
        deleteIcon: shallowRef(Delete),
        close: shallowRef(Close),
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
      async handleAdd() {
        if (this.newTodo.todo) {
          try {
            const { data } = await axios({
              method: 'POST',
              url: ADD_TODO_URL,
              data: { email: this.newTodo.email, todo: this.newTodo.todo },
            })

            this.success = true
            this.successText = data.message

            data.todo.isEdit = false
            this.todos = [...this.todos, data.todo]

            this.newTodo = {
              todo: '',
              isEdit: false,
              completed: false,
              email: userEmail,
            }
          } catch (err) {
            this.error = true
            this.errorText = err.message
          }
        }
      },
      handleEditMode(i) {
        this.tempEditTodo = this.todos[i].isEdit ? '' : this.todos[i].todo
        this.todos = [
          ...this.todos.slice(0, i),
          { ...this.todos[i], isEdit: !this.todos[i].isEdit },
          ...this.todos.slice(i + 1),
        ]
      },
      async handleEdit(i) {
        try {
          const { data } = await axios({
            method: 'PUT',
            url: EDIT_TODO_URL,
            data: {
              email: this.todos[i].email,
              todo: this.todos[i].todo,
              editedTodo: this.tempEditTodo,
            },
          })

          this.success = true
          this.successText = data.message

          this.todos = [
            ...this.todos.slice(0, i),
            {
              ...this.todos[i],
              todo: this.tempEditTodo,
              isEdit: !this.todos[i].isEdit,
            },
            ...this.todos.slice(i + 1),
          ]
        } catch (err) {
          this.error = true
          this.errorText = err.message
        }
      },
      async handleComplete(i) {
        try {
          const { data } = await axios({
            method: 'PUT',
            url: COMPLETE_TODO_URL,
            data: {
              email: this.todos[i].email,
              todo: this.todos[i].todo,
            },
          })

          this.success = true
          this.successText = data.message

          this.todos = [...this.todos.slice(0, i), ...this.todos.slice(i + 1)]
          this.completedTodos = [...this.completedTodos, data.completedTodo]
        } catch (err) {
          this.error = true
          this.errorText = err.message
        }
      },
      async handleDelete(i, completed) {
        try {
          const deleteTodo = completed ? this.completedTodos[i] : this.todos[i]

          const { data } = await axios({
            method: 'DELETE',
            url: DELETE_TODO_URL,
            data: { email: deleteTodo.email, todo: deleteTodo.todo },
          })

          this.success = true
          this.successText = data.message

          if (completed) {
            this.completedTodos = [
              ...this.completedTodos.slice(0, i),
              ...this.completedTodos.slice(i + 1),
            ]
          } else {
            this.todos = [...this.todos.slice(0, i), ...this.todos.slice(i + 1)]
          }
        } catch (err) {
          this.error = true
          this.errorText = err.message
        }
      },
    },
    computed: {
      isDisabled() {
        for (const todo of this.todos) {
          if (todo.isEdit) {
            return true
          }
        }
        return false
      },
    },
    beforeCreate() {
      if (!isAuth()) {
        router.push('/signin')
      }
    },
    async beforeMount() {
      const { data } = await axios.get(TODOS_URL)

      const userTodos = data
        .filter(({ email }) => {
          return email === userEmail
        })
        .map(todo => {
          todo.isEdit = false
          return todo
        })

      this.todos = userTodos.filter(({ completed }) => !completed)

      this.completedTodos = userTodos.filter(({ completed }) => completed)
    },
  }
</script>
