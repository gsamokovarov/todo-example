class Todo extends Backbone.Model
  defaults:
    completed: false

  toggleCompleted: ->
    @save completed: !@get('completed')

class TodoCollection extends Backbone.Collection
  model: Todo
  localStorage: new Backbone.LocalStorage 'TodoCollection'

class TodoListView extends Backbone.View
  events:
    'click .toggle': 'toggleTodoCompletion'
    'keyup #new-todo': 'enterNewTodo'
    'click .destroy': 'removeTodo'

  initialize: ->
    @listenTo @collection, 'add change remove', @render

  toggleTodoCompletion: (event) ->
    todoId = $(event.target).closest('li').data('id')
    todo = @collection.get todoId

    throw "Expected to find a todo with id of #{todoId}" unless todo
    todo.toggleCompleted()

  enterNewTodo: (event) ->
    todoInput = @$('#new-todo')

    if event.keyCode isnt 13 or not todoInput.val()
      event.preventDefault()
      return

    todo = @collection.create description: todoInput.val()
    throw 'Expected new todo creation to succeed' unless todo

    todoInput.val ''

  removeTodo: (event) ->
    event.stopPropagation()

    todoId = $(event.target).closest('li').data('id')
    todo = @collection.get todoId

    todo?.destroy()
    throw 'Expected todo removal to succeed' unless todo

  render: ->
    todosContainer = @$('#todo-list')

    todosContainer.empty()
    @collection.each (todo) ->
      content = JST['todo-template'] {todo}
      todosContainer.append content
    , this

$ ->
  window.JST = _.reduce $('script[type="text/template"]'), (jst, el) ->
    jst[$(el).attr('id')] = _.template $(el).html()
    jst
  , {}

  window.todoCollection = new TodoCollection

  window.todoCollection
    .fetch(update: true)
    .done ->
      window.todoListView = new TodoListView
        collection: window.todoCollection
        el: $('#todoapp')
      todoListView.render()
    .fail ->
      throw 'Something went wrong while fetching the todos'
