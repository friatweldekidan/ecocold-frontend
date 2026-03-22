export function FarmerPayments() {
  return (
    <div className="page">
      <h1 className="page-title">Payments</h1>
      <p className="muted">
        Payments are created and managed by the operator. Use this screen as a
        quick reference when you are with your hub operator.
      </p>
      <div className="card">
        <ul className="steps">
          <li>Confirm the number of crates received at the hub.</li>
          <li>Agree on the storage fee and payment terms.</li>
          <li>
            Ask your operator to record each payment in the operator dashboard.
          </li>
        </ul>
      </div>
    </div>
  )
}

