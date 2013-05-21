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
  events: {
    'click input[type=checkbox]': 'toggleTodoCompletion',
    'keyup input[type=text]': 'enterNewTodo',
    'click .removeTodo': 'removeTodo'
  },

  initialize: function() {
    this.listenTo(this.collection, 'add change remove', this.render);
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

  removeTodo: function(event) {
    event.stopPropagation();

    var todoId = $(event.target).closest('li').data('id');
    var todo = this.collection.get(todoId);

    if (todo) {
      todo.destroy();
    } else {
      throw "Expected new todo creation to succeed";
    }
  },

  render: function() {
    var todosContainer = this.$('#todoListBody');

    todosContainer.empty();
    this.collection.each(function(todo) {
      var content = JST.todoTemplate({todo: todo});
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
        el: $('#todoListContainer')
      });
      todoListView.render();
    })
    .fail(function() {
      throw "Something went wrong while fetching the todos";
    });
});
