var Todo = Backbone.Model.extend({
  defaults: {
    completed: false
  },

  toggleCompleted: function() {
    this.set('completed', !this.get('completed'));
  }
});

var TodoCollection = Backbone.Collection.extend({
  model: Todo
});

var TodoListView = Backbone.View.extend({
  todoTemplate: _.template([
    "<li data-id='<%- todo.cid %>' <%- todo.get('completed') ? 'class=completedTask' : '' %>>",
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

    var todo = new Todo({description: todoInput.val()});
    this.collection.add(todo);

    todoInput.val('');
  },

  render: function() {
    var todosContainer = $('#todoListBody');

    todosContainer.empty();
    this.collection.each(function(todo) {
      var content = this.todoTemplate({todo: todo});
      todosContainer.append(content);
    }, this);
  }
});

$(function() {
  window.todoCollection = new TodoCollection();
  window.todoListView = new TodoListView({
    collection: todoCollection,
    el: $('#todoListContainer')
  });
});
