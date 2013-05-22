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
  url: '/todo'
});

var TodoListView = Backbone.View.extend({
  events: {
    'click .toggle': 'toggleTodoCompletion',
    'keyup #new-todo': 'enterNewTodo',
    'click .destroy': 'removeTodo'
  },

  initialize: function() {
    this.listenTo(this.collection, 'add change remove', this.render);
  },

  toggleTodoCompletion: function(event) {
    var todoId = $(event.target).closest('li').data('id');
    var todo = this.collection.get(todoId);

    if (!todo) throw 'Could not find a todo with id of ' + todoId;
    todo.toggleCompleted();
  },

  enterNewTodo: function(event) {
    var todoInput = this.$('#new-todo');

    if (event.keyCode !== 13 || !todoInput.val()) {
      event.preventDefault();
      return;
    }

    var todo = this.collection.create({description: todoInput.val()});
    if (!todo) throw 'Todo creation to failed, please investigate';

    todoInput.val('');
  },

  removeTodo: function(event) {
    event.stopPropagation();

    var todoId = $(event.target).closest('li').data('id');
    var todo = this.collection.get(todoId);

    if (!todo) throw 'Could not find a todo with id of ' + todoId;
    todo.destroy();
  },

  render: function() {
    var todosContainer = this.$('#todo-list');

    todosContainer.empty();
    this.collection.each(function(todo) {
      var content = JST['todo-template']({todo: todo});
      todosContainer.append(content);
    }, this);
  }
});

$(function() {
  window.JST = _.reduce($('script[type="text/template"]'), function(jst, el) {
    jst[$(el).attr('id')] = _.template($(el).html());
    return jst;
  }, {});

  window.todoCollection = new TodoCollection();

  window.todoCollection
    .fetch({update: true})
    .done(function() {
      window.todoListView = new TodoListView({
        collection: window.todoCollection,
        el: $('#todoapp')
      });
      window.todoListView.render();
    })
    .fail(function() {
      throw 'Something went wrong while fetching the todos';
    });
});
