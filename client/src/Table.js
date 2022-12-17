const Table = ({ data, setEmail, setName, setShowSendComp }) => {
	let i = 1

	return (
		<table className='table table-dark table-hover align-content-center'>
			<thead>
				<tr>
					<th scope='col'>#</th>
					<th scope='col'>Name</th>
					<th scope='col'>Email</th>
					<th scope='col'>Balance</th>
					<th scope='col'></th>
				</tr>
			</thead>
			<tbody>
				{data.map(record => (
					<tr key={i}>
						<th className='align-middle'>{i++}</th>
						<td className='align-middle'>{record['name']}</td>
						<td className='align-middle'>{record['email']}</td>
						<td className='align-middle'>{record['balance']}</td>
						<td className='align-middle'>
							<button
								className='btn btn-primary'
								onClick={() => {
									setEmail(record['email'])
									setName(record['name'])
									setShowSendComp(true)
								}}>
								Select Sender
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default Table
