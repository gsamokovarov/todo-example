$(document).ready(function(event) {

  var todoData = [];

  var constructNewTodoItem = (function() {
    var i = 1;
    return function(text) {
      return {
        id : i++,
        description : text,
        completed : false
      };
    };
  })();

  var constructNewTodoHtml = function(todoObject) {
    var liClass = "";
    var checked = "";
    if (todoObject.completed) {
      liClass = "completedTask";
      checked = "checked";
    }

    var htmlTemplate = [
      "<li data-id='<%- todoId %>' class='<%- liClass %>'>",
      "  <label>",
      "    <input type='checkbox' <%- checked %> />",
      "    <%- todoDescription %>",
      "  </label>",
      "</li>"
    ].join("\n");

    return _.template(htmlTemplate, {
      todoDescription: todoObject.description,
      todoId: todoObject.id,
      liClass: liClass,
      checked: checked
    });
  };

  var todoInput = $('#todoListToolbar input[type="text"]');

  var render = function() {
    $("#todoListBody").empty();
    _.each(todoData, function(item) {
      var html = constructNewTodoHtml(item);
      $("#todoListBody").append(html);
    });
  };

  todoInput.keyup(function(event) {
    if (event.keyCode === 13) {
      if (!todoInput.val()) {
        return false;
      }
      var newTodoObject = constructNewTodoItem(todoInput.val());
      todoData.push(newTodoObject);
      todoInput.val("");
      render();
    }
  });

  $(document).on("click", "#todoListBody input[type='checkbox']", function() {
    var taskId = $(this).closest('li').data("id");
    console.log(taskId);

    todoData[taskId - 1].completed = !todoData[taskId - 1].completed;
    render();
  });

});
