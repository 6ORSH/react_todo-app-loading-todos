import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/enums';

type Props = {
  todos: Todo[];
  currentFilter: TodosFilter;
  handleFilterChange: (filter: TodosFilter) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  handleFilterChange,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodosFilter).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
