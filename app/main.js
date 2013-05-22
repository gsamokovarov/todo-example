(function() {
  var Todo, TodoCollection, TodoListView, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo = (function(_super) {
    __extends(Todo, _super);

    function Todo() {
      _ref = Todo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Todo.prototype.defaults = {
      completed: false
    };

    Todo.prototype.toggleCompleted = function() {
      return this.save({
        completed: !this.get('completed')
      });
    };

    return Todo;

  })(Backbone.Model);

  TodoCollection = (function(_super) {
    __extends(TodoCollection, _super);

    function TodoCollection() {
      _ref1 = TodoCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    TodoCollection.prototype.model = Todo;

    TodoCollection.prototype.localStorage = new Backbone.LocalStorage('TodoCollection');

    return TodoCollection;

  })(Backbone.Collection);

  TodoListView = (function(_super) {
    __extends(TodoListView, _super);

    function TodoListView() {
      _ref2 = TodoListView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    TodoListView.prototype.events = {
      'click .toggle': 'toggleTodoCompletion',
      'keyup #new-todo': 'enterNewTodo',
      'click .destroy': 'removeTodo'
    };

    TodoListView.prototype.initialize = function() {
      return this.listenTo(this.collection, 'add change remove', this.render);
    };

    TodoListView.prototype.toggleTodoCompletion = function(event) {
      var todo, todoId;

      todoId = $(event.target).closest('li').data('id');
      todo = this.collection.get(todoId);
      if (!todo) {
        throw "Expected to find a todo with id of " + todoId;
      }
      return todo.toggleCompleted();
    };

    TodoListView.prototype.enterNewTodo = function(event) {
      var todo, todoInput;

      todoInput = this.$('#new-todo');
      if (event.keyCode !== 13 || !todoInput.val()) {
        event.preventDefault();
        return;
      }
      todo = this.collection.create({
        description: todoInput.val()
      });
      if (!todo) {
        throw 'Expected new todo creation to succeed';
      }
      return todoInput.val('');
    };

    TodoListView.prototype.removeTodo = function(event) {
      var todo, todoId;

      event.stopPropagation();
      todoId = $(event.target).closest('li').data('id');
      todo = this.collection.get(todoId);
      if (todo != null) {
        todo.destroy();
      }
      if (!todo) {
        throw 'Expected todo removal to succeed';
      }
    };

    TodoListView.prototype.render = function() {
      var todosContainer;

      todosContainer = this.$('#todo-list');
      todosContainer.empty();
      return this.collection.each(function(todo) {
        var content;

        content = JST['todo-template']({
          todo: todo
        });
        return todosContainer.append(content);
      }, this);
    };

    return TodoListView;

  })(Backbone.View);

  $(function() {
    window.JST = _.reduce($('script[type="text/template"]'), function(jst, el) {
      jst[$(el).attr('id')] = _.template($(el).html());
      return jst;
    }, {});
    window.todoCollection = new TodoCollection;
    return window.todoCollection.fetch({
      update: true
    }).done(function() {
      window.todoListView = new TodoListView({
        collection: window.todoCollection,
        el: $('#todoapp')
      });
      return todoListView.render();
    }).fail(function() {
      throw 'Something went wrong while fetching the todos';
    });
  });

}).call(this);
