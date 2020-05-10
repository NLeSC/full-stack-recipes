<template>
  <v-card class="mt-3">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
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

export const GET_TODOS = gql`
  query getMyTodos($isPublic: Boolean!, $ownerId: String) {
    todos(
      where: { is_public: { _eq: $isPublic }, owner_id: { _eq: $ownerId } }
      order_by: { created_at: desc }
    ) {
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
  mutation insert_todos($todo: String!, $isPublic: Boolean!, $ownerId: String) {
    insert_todos(
      objects: { title: $todo, is_public: $isPublic, owner_id: $ownerId }
    ) {
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
  props: {
    title: { type: String, default: 'Todos title' },
    type: { type: String, default: 'public' },
  },
  data: () => ({
    newTodo: '',
    todosCount: 0,
  }),
  computed: {
    isPublic() {
      return this.type === 'public'
    },
  },
  apollo: {
    todos: {
      // graphql query
      query: GET_TODOS,
      variables() {
        return {
          isPublic: this.isPublic,
          ownerId: this.isPublic ? null : this.$store?.state?.user?.user?.uid,
        }
      },
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
      // insert new item into db
      const title = this.newTodo
      this.$apollo.mutate({
        mutation: ADD_TODO,
        variables: {
          todo: title,
          isPublic: this.isPublic,
          ownerId: this.isPublic ? null : this.$store.state.user.user.uid,
        },
        update: (cache, { data: { insert_todos } }) => {
          // Read the data from our cache for this query.
          try {
            // readQuery will never make a request to your GraphQL server
            const data = cache.readQuery({
              query: GET_TODOS,
              variables: {
                isPublic: this.isPublic,
                ownerId: this.isPublic ? null : this.$store.state.user.user.uid,
              },
            })
            const insertedTodo = insert_todos.returning
            data.todos.splice(0, 0, insertedTodo[0])
            cache.writeQuery({
              query: GET_TODOS,
              variables: {
                isPublic: this.isPublic,
                ownerId: this.isPublic ? null : this.$store.state.user.user.uid,
              },
              data,
            })
            this.newTodo = ''
          } catch (e) {
            console.error(e)
          }
        },
      })
    },

    deleteTodo(id) {
      this.$apollo.mutate({
        mutation: DELETE_TODO,
        variables: {
          id,
        },
        update: (store, { data, data: { delete_todos } }) => {
          if (delete_todos.affected_rows) {
            const data = store.readQuery({
              query: GET_TODOS,
              variables: {
                isPublic: this.isPublic,
                ownerId: this.isPublic ? null : this.$store.state.user.user.uid,
              },
            })
            data.todos = data.todos.filter((t) => {
              return t.id !== id
            })
            store.writeQuery({
              query: GET_TODOS,
              variables: {
                isPublic: this.isPublic,
                ownerId:
                  this.type === 'public'
                    ? null
                    : this.$store.state.user.user.uid,
              },
              data,
            })
          }
        },
      })
    },
  },
}
</script>
