import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Billing() {
  const [services] = useState([
    {
      id: "srv-001",
      service: "EC2 / Virtual Machines",
      usage: "3 VMs",
      rate: "₹2.00 / VM",
      cost: 6.0,
    },
    {
      id: "srv-002",
      service: "S3 Storage",
      usage: "2.4 GB",
      rate: "₹1.50 / GB",
      cost: 3.6,
    },
    {
      id: "srv-003",
      service: "RDS Database",
      usage: "1 Database",
      rate: "₹2.00 / DB",
      cost: 2.0,
    },
    {
      id: "srv-004",
      service: "PaaS Deployment",
      usage: "2 Apps",
      rate: "₹0.45 / App",
      cost: 0.9,
    },
  ]);

  const [invoices] = useState([
    {
      id: "INV-001",
      date: "01 Sep 2026",
      period: "August 2026",
      amount: "₹10.80",
      status: "Paid",
    },
    {
      id: "INV-002",
      date: "01 Aug 2026",
      period: "July 2026",
      amount: "₹8.50",
      status: "Paid",
    },
    {
      id: "INV-003",
      date: "01 Jul 2026",
      period: "June 2026",
      amount: "₹7.25",
      status: "Paid",
    },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState(
    "September 2026"
  );

  const subtotal = services.reduce(
    (total, service) => total + service.cost,
    0
  );

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const downloadInvoice = (invoice) => {
    alert(`Downloading ${invoice.id}`);
  };

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">

        {/* Navbar */}
        <Navbar />

        <main className="page-content">

          {/* Header */}
          <div className="page-header">

            <div>
              <h1>Billing</h1>

              <p>
                Track UniCloud service usage and costs
              </p>
            </div>

            <select
              className="billing-period"
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(e.target.value)
              }
            >
              <option>September 2026</option>
              <option>August 2026</option>
              <option>July 2026</option>
              <option>June 2026</option>
            </select>

          </div>

          {/* Billing Summary */}
          <div className="billing-summary">

            <div className="billing-total-card">

              <div className="billing-card-title">
                Current Bill
              </div>

              <div className="billing-total">
                ₹{total.toFixed(2)}
              </div>

              <div className="billing-period-text">
                {selectedPeriod}
              </div>

              <div className="billing-status">
                ● Estimated
              </div>

            </div>

            <div className="billing-stat-card">

              <span>Service Cost</span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>

              <small>
                Before tax
              </small>

            </div>

            <div className="billing-stat-card">

              <span>Tax</span>

              <strong>
                ₹{tax.toFixed(2)}
              </strong>

              <small>
                GST 18%
              </small>

            </div>

            <div className="billing-stat-card">

              <span>Services</span>

              <strong>
                {services.length}
              </strong>

              <small>
                Active services
              </small>

            </div>

          </div>

          {/* Service Usage */}
          <div className="card">

            <div className="card-header">

              <div>
                <h2>Service Usage</h2>

                <span>
                  Usage and estimated cost
                </span>
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Service</th>
                    <th>Usage</th>
                    <th>Rate</th>
                    <th>Cost</th>
                  </tr>

                </thead>

                <tbody>

                  {services.map((service) => (

                    <tr key={service.id}>

                      <td>
                        <div className="billing-service">

                          <div className="billing-service-icon">
                            ☁
                          </div>

                          <div>
                            <strong>
                              {service.service}
                            </strong>

                            <small>
                              {service.id}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        {service.usage}
                      </td>

                      <td>
                        {service.rate}
                      </td>

                      <td>
                        <strong>
                          ₹{service.cost.toFixed(2)}
                        </strong>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Bill Breakdown */}
          <div className="billing-bottom-grid">

            <div className="card">

              <div className="card-header">
                <h2>Bill Summary</h2>
              </div>

              <div className="bill-summary-row">
                <span>Service charges</span>
                <strong>
                  ₹{subtotal.toFixed(2)}
                </strong>
              </div>

              <div className="bill-summary-row">
                <span>GST (18%)</span>
                <strong>
                  ₹{tax.toFixed(2)}
                </strong>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-summary-total">
                <span>Total</span>

                <strong>
                  ₹{total.toFixed(2)}
                </strong>
              </div>

            </div>

            <div className="card">

              <div className="card-header">
                <h2>Payment Status</h2>
              </div>

              <div className="payment-status-box">

                <div className="payment-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    No Payment Due
                  </strong>

                  <p>
                    Your current usage is being
                    calculated for the selected period.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Invoice History */}
          <div className="card invoice-card">

            <div className="card-header">

              <div>
                <h2>Invoice History</h2>

                <span>
                  Previous billing records
                </span>
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Invoice</th>
                    <th>Billing Period</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {invoices.map((invoice) => (

                    <tr key={invoice.id}>

                      <td>
                        <strong>
                          {invoice.id}
                        </strong>
                      </td>

                      <td>
                        {invoice.period}
                      </td>

                      <td>
                        {invoice.date}
                      </td>

                      <td>
                        <strong>
                          {invoice.amount}
                        </strong>
                      </td>

                      <td>

                        <span className="invoice-paid">
                          ● {invoice.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="btn-secondary small-btn"
                          onClick={() =>
                            downloadInvoice(invoice)
                          }
                        >
                          Download
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Information */}
          <div className="card billing-info">

            <h2>UniCloud Billing</h2>

            <div className="billing-info-grid">

              <div>
                <strong>💻 EC2</strong>

                <p>
                  Charges are calculated based on
                  virtual machine usage.
                </p>
              </div>

              <div>
                <strong>💾 S3</strong>

                <p>
                  Storage charges are calculated
                  according to allocated storage.
                </p>
              </div>

              <div>
                <strong>🗄 RDS</strong>

                <p>
                  Database service usage contributes
                  to the monthly bill.
                </p>
              </div>

              <div>
                <strong>🚀 PaaS</strong>

                <p>
                  Application deployments contribute
                  to service usage.
                </p>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Billing;