<template>
  <v-card class="mt-3">
    <v-card-title>
      <v-icon>mdi-database</v-icon>
      Data from &nbsp;
      <a href="http://localhost:4000" target="_blank">
        database
        <v-icon size="16">mdi-open-in-new</v-icon>
      </a>
    </v-card-title>
    <v-card-text>
      <p>
        <a
          href="http://localhost:4000/console/data/schema/public"
          target="_blank"
        >
          Create a table
        </a>
        called 'todos' on the database with 4 columns: 'id'(Integer),
        'title'(Text) and 'is_publish'(Boolean), 'is_completed'(Boolean).
      </p>

      <h4>Num 'todos' subscription: {{ todosCount }}</h4>
      <v-form @submit.prevent="addTodo">
        <v-text-field
          v-model="newTodo"
          label="Add todo (Optimistic UI)"
          required
        ></v-text-field>
      </v-form>

      <v-list dense>
        <v-list-item v-for="todo in todos" :key="todo.id">
          <v-list-item-content>
            {{ todo.title }}
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="deleteTodo(todo.id)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'

// const SUBSCRIPTION_NUM_TODOS= gql`
// `

export const GET_PUBLIC_TODOS = gql`
  query getMyTodos {
    todos(where: { is_public: { _eq: true } }, order_by: { created_at: desc }) {
      id
      title
      created_at
      is_completed
    }
  }
`
const TODOS_COUNT_SUBSCRIPTION = gql`
  subscription todos_aggregate {
    todos_aggregate {
      aggregate {
        count
      }
    }
  }
`
const ADD_TODO = gql`
  mutation insert_todos($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic }) {
      affected_rows
      returning {
        id
        title
        is_completed
        is_public
        created_at
      }
    }
  }
`

const DELETE_TODO = gql`
  mutation deleteTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`
export default {
  name: 'Todos',
  data: () => ({
    newTodo: '',
    todosCount: 0,
    type: 'public',
  }),
  apollo: {
    todos: {
      // graphql query
      query: GET_PUBLIC_TODOS,
      error(error) {
        this.error = JSON.stringify(error.message)
      },
    },

    // Subscriptions
    $subscribe: {
      // When a tag is added
      todosCount: {
        query: TODOS_COUNT_SUBSCRIPTION,
        result({ data }) {
          this.todosCount = data?.todos_aggregate?.aggregate?.count
        },
      },
    },
  },
  methods: {
    addTodo() {
      // insert new todo into db
      const title = this.newTodo
      this.$apollo.mutate({
        mutation: ADD_TODO,
        variables: {
          todo: title,
          isPublic: this.type === 'public',
        },
        // eslint-disable-next-line camelcase
        update: (cache, { data: { insert_todos } }) => {
          // Read the data from our cache for this query.
          try {
            if (this.type === 'public') {
              // readQuery will never make a request to your GraphQL server
              const data = cache.readQuery({
                query: GET_PUBLIC_TODOS,
              })
              const insertedTodo = insert_todos.returning
              data.todos.splice(0, 0, insertedTodo[0])
              cache.writeQuery({
                query: GET_PUBLIC_TODOS,
                data,
              })
              this.newTodo = ''
            }
          } catch (e) {
            console.error(e)
          }
        },
      })
    },

    deleteTodo(id) {
      console.log('🎹', id)
      this.$apollo.mutate({
        mutation: DELETE_TODO,
        variables: {
          id,
        },
        update: (store, { data, data: { delete_todos } }) => {
          console.log('🎹', store, data)
          if (delete_todos.affected_rows) {
            if (this.type === 'public') {
              const data = store.readQuery({
                query: GET_PUBLIC_TODOS,
              })
              data.todos = data.todos.filter((t) => {
                return t.id !== id
              })
              store.writeQuery({
                query: GET_PUBLIC_TODOS,
                data,
              })
            }
          }
        },
      })
    },
  },
}
</script>
