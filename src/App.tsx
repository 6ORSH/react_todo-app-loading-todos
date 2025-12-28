/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

enum TodoErrors {
  FetchError = 'FetchError',
  EmptyTitleError = 'EmptyTitleError',
  AddError = 'AddError',
  DeleteError = 'DeleteError',
  UpdateError = 'UpdateError',
}

enum TodosFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
  const [todosFilter, setTodosFilter] = useState<TodosFilter>(TodosFilter.All);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [error, setError] = useState<TodoErrors | null>(null);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setDisplayedTodos(fetchedTodos);
      })
      .catch(() => {
        setIsErrorShown(true);
        setError(TodoErrors.FetchError);
        setTimeout(() => {
          setIsErrorShown(false);
        }, 3000);
      });
  }, []);

  const getErrorMessage = useCallback(() => {
    switch (error) {
      case TodoErrors.FetchError:
        return 'Unable to load todos';
      case TodoErrors.EmptyTitleError:
        return 'Title should not be empty';
      case TodoErrors.AddError:
        return 'Unable to add a todo';
      case TodoErrors.DeleteError:
        return 'Unable to delete a todo';
      case TodoErrors.UpdateError:
        return 'Unable to update a todo';
      default:
        return '';
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleCloseError = () => {
    setIsErrorShown(false);
  };

  const handleFilter = (filter: TodosFilter) => {
    setTodosFilter(filter);
    const filteredTodos = todos.filter(todo => {
      switch (filter) {
        case TodosFilter.Active:
          return !todo.completed;
        case TodosFilter.Completed:
          return todo.completed;
        case TodosFilter.All:
        default:
          return true;
      }
    });

    setDisplayedTodos(filteredTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length > 0 &&
            displayedTodos.map(todo => (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: todosFilter === TodosFilter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleFilter(TodosFilter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: todosFilter === TodosFilter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleFilter(TodosFilter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: todosFilter === TodosFilter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilter(TodosFilter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isErrorShown,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {/* show only one message at a time */}
        {getErrorMessage()}
      </div>
    </div>
  );
};
