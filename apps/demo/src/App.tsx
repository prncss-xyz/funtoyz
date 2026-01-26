import './App.css'
import reactLogo from './assets/react.svg'
import { useMachine } from './useMachine'

import viteLogo from '/vite.svg'

function App() {
	const { result, send } = useMachine(
		{
			init: 0,
			reduce: (_: void, last) => last + 1,
			result: (last) => (last % 2 ? 'even' : 'odd'),
		},
		{},
	)

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img alt='Vite logo' className='logo' src={viteLogo} />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img alt='React logo' className='logo react' src={reactLogo} />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => send()}>count is {result}</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export default App
