// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  initialValue = '',
  {serialize = JSON.parse, deserialize = JSON.stringify} = {},
) {
  const [value, setValue] = React.useState(() => {
    const data = window.localStorage.getItem(key)
    if (data) {
      return serialize(data)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (key !== prevKey) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, deserialize(value))
  }, [value, serialize, key])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  // 🐨✅  initialize the state to the value from localStorage
  // 🐨✅ Here's where you'll use `React.useEffect`.

  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
