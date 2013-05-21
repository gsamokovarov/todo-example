var Todo = Backbone.Model.extend({
  defaults: {
    completed: false
  },

  toggleCompleted: function() {
    return this.save({completed: !this.get('completed')});
  }
});

var TodoCollection = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('TodoCollection')
});

var TodoListView = Backbone.View.extend({
  todoTemplate: _.template([
    "<li data-id='<%- todo.id %>' <%- todo.get('completed') ? 'class=completedTask' : '' %>>",
    "  <label>",
    "    <input type='checkbox' <%- todo.get('completed') ? 'checked' : '' %>>",
    "    <%- todo.get('description') %>",
    "  </label>",
    "</li>"
  ].join('\n')),

  events: {
    'click input[type=checkbox]': 'toggleTodoCompletion',
    'keyup input[type=text]': 'enterNewTodo'
  },

  initialize: function() {
    this.listenTo(this.collection, 'add change', this.render);
  },

  toggleTodoCompletion: function(event) {
    var todoId = $(event.target).closest('li').data('id');
    var todo = this.collection.get(todoId);

    if (!todo) throw 'Expected to find a todo with id of ' + todoId;
    todo.toggleCompleted();
  },

  enterNewTodo: function(event) {
    var todoInput = $('#todoListToolbar input[type="text"]');

    if (event.keyCode !== 13) return false;
    if (!todoInput.val()) return false;

    var todo = this.collection.create({description: todoInput.val()});
    if (!todo) throw "Expected new todo creation to succeed";

    todoInput.val('');
  },

  render: function() {
    var todosContainer = this.$('#todoListBody');

    todosContainer.empty();
    this.collection.each(function(todo) {
      var content = this.todoTemplate({todo: todo});
      todosContainer.append(content);
    }, this);
  }
});

$(function() {
  window.todoCollection = new TodoCollection();

  window.todoCollection
    .fetch({update: true})
    .done(function() {
      window.todoListView = new TodoListView({
        collection: window.todoCollection,
        el: $('#todoListContainer')
      });
      todoListView.render();
    })
    .fail(function() {
      throw "Something went wrong while fetching the todos";
    });
});
