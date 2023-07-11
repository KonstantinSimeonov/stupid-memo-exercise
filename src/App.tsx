import * as React from "react";
import "./App.css";

/*
 * 1. Don't re-render search input when adding/removing items in list
 * 2. Don't re-render page size input when adding/removing items in list
 * 3. Don't re-render the list when showing/hiding header
 *
 * memo - https://react.dev/reference/react/memo
 * useCallback - https://react.dev/reference/react/useCallback
 * useMemo - https://react.dev/reference/react/useMemo
 */

const RenderIndicator: React.FC<React.PropsWithChildren> = (
  props
) => {
  return (
    <div style={{ position: `relative` }}>
      {props.children}
      <div key={Math.random()} className="indicator" />
    </div>
  );
};

const SearchInput: React.FC<{
  onChange: (term: string) => void;
}> = (props) => {
  const [term, setTerm] = React.useState(``);

  return (
    <RenderIndicator {...props}>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Write stuff to filter stuff"
      />
      <button onClick={() => props.onChange(term)}>Search</button>
    </RenderIndicator>
  );
}

const PageSizeInput: React.FC<{ onChange: (pageSize: number) => void }> =
  (props) => {
    const [size, setSize] = React.useState(10);

    return (
      <RenderIndicator {...props}>
        <input
          type="number"
          value={size}
          min={0}
          max={20}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <button onClick={() => props.onChange(size)}>Save page size</button>
      </RenderIndicator>
    );
  }

const List: React.FC<{
  list: readonly string[];
  onAddEntry: (name: string) => void;
  onRemoveEntry: (name: string) => void;
}> = (props) => {
  const [newName, setNewName] = React.useState(``);

  return (
    <RenderIndicator {...props}>
      <ul>
        {props.list.map((x, i) => (
          <li key={`${x}${i}`}>
            <span>{x}</span>
            <button onClick={() => props.onRemoveEntry(x)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button disabled={!newName} onClick={() => props.onAddEntry(newName)}>
          Add
        </button>
      </div>
    </RenderIndicator>
  );
}

function App() {
  const [options, setOptions] = React.useState({
    filter: ``,
    pageSize: 10,
    showHeader: true,
  });

  const setFilter = 
    (filter: string) => setOptions((current) => ({ ...current, filter }))

  const setPageSize = 
    (pageSize: number) => setOptions((current) => ({ ...current, pageSize }))

  const setShowHeader: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => setOptions((current) => ({ ...current, showHeader: target.checked }));

  const [list, setList] = React.useState([
    `loan`,
    `otravaliev`,
    `mani`,
    `ecok`,
  ]);

  const onAddEntry = (name: string) =>
    setList((current) => current.concat(name))

  const onRemoveEntry = (name: string) =>
    setList((current) => {
      const index = current.indexOf(name);
      return current.filter((_, i) => i !== index);
    })

  const filteredList = list
    .filter((name) => name.toLowerCase().includes(options.filter.toLowerCase()))
    .slice(0, options.pageSize)

  return (
    <div className="app">
      <header>
        <div>
          <label>
            Show header
            <input
              type="checkbox"
              checked={options.showHeader}
              onChange={setShowHeader}
            />
          </label>
        </div>
        <div style={{ display: options.showHeader ? `flex` : `none` }}>
          <SearchInput onChange={setFilter} />
          <PageSizeInput onChange={setPageSize} />
        </div>
      </header>
      <main>
        <List
          list={filteredList}
          onAddEntry={onAddEntry}
          onRemoveEntry={onRemoveEntry}
        />
      </main>
    </div>
  );
}

export default App;
