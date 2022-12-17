import { useState, useEffect } from 'react'
import SendMoney from './SendMoney'
import axios from 'axios'
import './App.css'
import Table from './Table'

const App = () => {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [showSendComp, setShowSendComp] = useState(false)
	const [data, setData] = useState([])
	const [valueChanged, setValueChanged] = useState(false)

	useEffect(() => {
		axios
			.get('http://localhost:5000/allusers')
			.then(res => setData(res.data))
			.catch(err => console.log(err.data.msg))
	}, [valueChanged])

	return (
		<div>
			{showSendComp ? (
				<SendMoney
					email={email}
					name={name}
					data={data}
					valueChanged={valueChanged}
					setValueChanged={setValueChanged}
					setShowSendComp={setShowSendComp}
				/>
			) : null}
			<nav className='p-3 w-100 bg-warning text-white'>
				<h1>Basic Banking App</h1>
			</nav>
			<div className={showSendComp ? 'd-none' : 'px-4'}>
				<Table data={data} setEmail={setEmail} setName={setName} setShowSendComp={setShowSendComp} />
			</div>
		</div>
	)
}

export default App
