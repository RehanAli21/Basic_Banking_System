import axios from 'axios'
import { useEffect, useState } from 'react'

const SendMoney = ({ name, email, data, valueChanged, setValueChanged, setShowSendComp }) => {
	const [balance, setBalance] = useState(0)
	const [receiverName, setReceiverName] = useState('')
	const [receiverEmail, setReceiverEmail] = useState('')
	const [receiverBalance, setReceiverBalance] = useState(0)
	const [err, setErr] = useState(0)

	useEffect(() => {
		for (let i = 0; i < data.length; i++) {
			if (data[i]['email'] == email) setBalance(parseInt(data[i]['balance']))
		}
	}, [])

	const setValues = e => {
		if (e.target.value !== 'none') {
			setReceiverEmail(e.target.value)

			for (let i = 0; i < data.length; i++) {
				if (data[i]['email'] == e.target.value) {
					setReceiverName(data[i]['name'])
					setReceiverBalance(parseInt(data[i]['balance']))
				}
			}
		} else {
			setReceiverEmail('')
			setReceiverName('')
			setReceiverBalance(0)
		}
	}

	const transferMoney = e => {
		e.preventDefault()

		if (receiverName === '' || receiverEmail === '') return alert('First Select A receiver')

		const value = parseInt(e.target[0].value)

		if (value > parseInt(balance)) return alert('You do not have Amount')

		axios
			.post('http://localhost:5000/transferMoney', {
				sender: { name: name, email: email, balance: balance },
				receiver: { name: receiverName, email: receiverEmail, balance: receiverBalance, amount: value },
			})
			.then(res => {
				removeValueFromInput()
				setValueChanged(!valueChanged)
				setBalance(res.data.remaningBalance)
				setErr(2)
			})
			.catch(err => {
				removeValueFromInput()
				setErr(1)
			})
	}

	const removeValueFromInput = () => {
		const ele = document.getElementById('transferAmount')

		if (ele) ele.value = ''
	}

	return (
		<div className='sendComp bg-dark'>
			<button className='btn btn-danger btnaa' onClick={() => setShowSendComp(false)}>
				X
			</button>
			<div className='text-white text-center row w-100' style={{ marginTop: '100px' }}>
				<div className='col-sm-12 col-md-6 col-lg-6 col-xl-6 border border-top-0 border-end-0 border-start-0 border-white'>
					<h1 className='my-5'>Sender</h1>
					<h3 className='fw-light my-5'>Name: {name}</h3>
					<h3 className='fw-light my-5'>Email: {email}</h3>
					<h3 className='fw-light my-5'>Balance: {balance}</h3>
				</div>
				<div className='col-sm-12 col-md-6 col-lg-6 col-xl-6 border border-top-0 border-end-0 border-left-0 border-white'>
					<h1 className='my-5'>Receiver</h1>
					<select className='form-select w-50 mx-auto' onChange={setValues}>
						<option value='none'>Choose for transfer</option>
						{data.map(record => (
							<option key={record['_id']} value={record['email']}>
								{record['email']}
							</option>
						))}
					</select>
					<h3 className='fw-light my-5'>Name: {receiverName}</h3>
					<h3 className='fw-light my-5'>Email: {receiverEmail}</h3>
				</div>
			</div>
			<form className='my-5 ailgn-middle mx-auto' onSubmit={transferMoney}>
				<div></div>
				<input
					id='transferAmount'
					type='number'
					min='1'
					max={balance}
					placeholder='Amount'
					required={true}
					className='form-control d-inline ailgn-middle'
				/>
				<button className='btn btn-primary ailgn-middle'>Send</button>
			</form>
			{err !== 0 ? (
				<p className={err === 1 ? 'text-danger text-center fs-2' : 'text-success text-center fs-2'}>
					{err === 1 ? 'Money transfer Failed' : 'Money transfered Successfully'}
				</p>
			) : null}
		</div>
	)
}

export default SendMoney
