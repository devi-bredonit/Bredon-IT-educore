import React from 'react';

const FeeReceipt = ({ student, school, paymentData, receiptNo, date, isPreview = false }) => {
  // Default values to match the screenshot exactly if data is missing
  const schoolInfo = school || {
    name: 'ABC PUBLIC SCHOOL',
    address: '123, Main Road, City, State - 123456',
    phone: '98765 43210',
    email: 'info@abcshool.com',
  };

  const studentInfo = student || {
    name: 'Rajesh Kumar',
    admission_number: 'A10234',
    current_class: '5th',
    section: 'B',
    father_name: 'Suresh Kumar',
    father_phone: '98765 12345',
  };

  const paymentInfo = paymentData || {
    academicYear: '2021-2022',
    amountPaid: 19200,
    paymentMode: 'UPI',
    transactionId: 'UP19876543210',
    paymentDate: '15/04/2022',
    discount: 1000,
    lateFee: 200,
    remarks: '',
    feeBreakup: [
      { head: 'Tuition Fee', amount: 15000 },
      { head: 'Transport Fee', amount: 3000 },
      { head: 'Exam Fee', amount: 1500 },
      { head: 'Miscellaneous', amount: 500 },
    ],
  };

  const feeDetails = paymentInfo.feeBreakup;
  const totalAmount = feeDetails.reduce((sum, item) => sum + item.amount, 0);
  const discount = paymentInfo.discount || 0;
  const lateFee = paymentInfo.lateFee || 0;
  const netPayable = totalAmount - discount + lateFee;
  const amountPaidValue = paymentInfo.amountPaid || 0;
  const dueAmount = netPayable - amountPaidValue;

  return (
    <div
      id={isPreview ? "fee-receipt-preview" : "fee-receipt-capture-id"}
      style={{
        width: '850px',
        margin: '0 auto',
        padding: '30px 40px',
        background: '#fff',
        color: '#003366',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        border: '1.5px solid #003366',
        boxSizing: 'border-box',
        position: 'relative',
        minHeight: isPreview ? 'auto' : '1000px',
        boxShadow: isPreview ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .receipt-header {
            text-align: center;
            margin-bottom: 5px;
        }
        .school-name {
            font-size: 32px;
            font-weight: 800;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            color: #003366;
            letter-spacing: 1px;
        }
        .school-info {
            font-size: 14px;
            color: #334155;
            margin: 2px 0;
            font-weight: 500;
        }
        .hr-main {
            border: none;
            height: 1.5px;
            background-color: #003366;
            margin: 15px 0 5px 0;
            opacity: 0.9;
        }
        .receipt-title-container {
            border-top: 2px solid #003366;
            border-bottom: 2px solid #003366;
            padding: 8px 0;
            margin: 10px 0 15px 0;
            text-align: center;
        }
        .receipt-title {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 8px;
            margin: 0;
            text-transform: uppercase;
            color: #003366;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            padding: 0 5px;
        }
        .meta-label {
            font-weight: 700;
        }
        .section-divider {
            border-bottom: 2px solid #003366;
            margin: 10px 0 20px 0;
        }
        .main-grid {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 40px;
        }
        .col-header {
            font-weight: 800;
            font-size: 16px;
            margin-bottom: 15px;
            color: #003366;
            padding-bottom: 5px;
            padding-left: 2px;
        }
        .details-table {
            width: 100%;
            font-size: 15px;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 5px 0;
            vertical-align: top;
        }
        .label-cell {
            width: 150px;
            font-weight: 600;
            color: #003366;
        }
        .value-cell {
            font-weight: 600;
            color: #1e293b;
        }
        .fee-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14.5px;
            border: 1.5px solid #003366;
        }
        .fee-table th {
            background-color: #003366;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-weight: 700;
        }
        .fee-table td {
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
            color: #1e293b;
            font-weight: 600;
        }
        .row-total {
            font-weight: 800;
            background: #f1f5f9;
        }
        .row-discount {
            color: #2563eb;
            font-weight: 600;
        }
        .row-payable {
            background-color: #003366;
            color: white !important;
            font-weight: 800;
        }
        .row-payable td {
            color: white !important;
            border-color: #003366 !important;
        }
        .text-right {
            text-align: right;
        }
        .amount-highlight {
            font-size: 18px;
            font-weight: 800;
            color: #1e293b;
            margin-top: 15px;
            text-align: left;
            padding-left: 5px;
        }
        .remarks-container {
            margin-top: 40px;
        }
        .remarks-line {
            border-bottom: 1.5px solid #cbd5e1;
            height: 35px;
            margin-top: 5px;
            color: #475569;
            font-style: italic;
            padding-left: 10px;
        }
        .footer-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 80px;
            align-items: flex-end;
            padding: 0 20px;
        }
        .signature-box {
            text-align: center;
            width: 240px;
        }
        .sig-line {
            border-top: 2px solid #003366;
            margin-top: 10px;
            padding-top: 10px;
            font-weight: 700;
            font-size: 15px;
            color: #003366;
        }
        .seal-circle {
            width: 140px;
            height: 140px;
            border: 2px dashed #cbd5e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            color: #94a3b8;
            position: relative;
        }
        .seal-circle::after {
            content: 'School Seal';
            position: absolute;
            bottom: -30px;
            font-weight: 700;
            color: #003366;
        }
        .system-msg {
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            font-style: italic;
            color: #1e293b;
            margin-top: 70px;
        }

        @media print {
            @page {
                size: A4 landscape;
                size: A4 portrait;
                margin: 10mm;
            }
            body {
                margin: 0;
                padding: 0;
                background: white;
            }
            #fee-receipt-preview {
                display: none !important;
            }
            #fee-receipt-capture-id {
                flex-direction: column !important;
                padding: 0 !important;
                border: none !important;
            }
            .half-page-receipt {
                width: 100% !important;
                height: 50% !important; /* Exactly half A4 */
                padding: 10mm 15mm !important;
                box-sizing: border-box !important;
                border-bottom: 2px dashed #003366 !important;
                page-break-inside: avoid !important;
            }
            /* Scale contents to fit the half-height */
            .school-name { font-size: 20px !important; margin-bottom: 2px !important; }
            .school-info { font-size: 11px !important; }
            .receipt-title { font-size: 16px !important; letter-spacing: 4px !important; }
            .main-grid { gap: 15px !important; margin-top: 5px !important; height: auto !important; }
            .details-table td, .fee-table td, .fee-table th { padding: 4px 8px !important; font-size: 12px !important; }
            .footer-signatures { margin-top: 15px !important; }
            .seal-circle { width: 70px !important; height: 70px !important; }
            .system-msg { margin-top: 10px !important; font-size: 10px !important; }
        }
        `}
      </style>

      {/* School Header */}
      <div className="receipt-header">
        <h1 className="school-name">{schoolInfo.name}</h1>
        <p className="school-info">{schoolInfo.address}</p>
        <p className="school-info">
          Phone: {schoolInfo.phone} | Email: {schoolInfo.email}
        </p>
      </div>

      <hr className="hr-main" />

      <div className="receipt-title-container">
        <h2 className="receipt-title">FEE RECEIPT</h2>
      </div>

      {/* Meta Row */}
      <div className="meta-row">
        <div>
          <span className="meta-label">Receipt No.:</span> {receiptNo || '2022/05678'}
        </div>
        <div>
          <span className="meta-label">Date:</span> {paymentInfo.paymentDate}
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="main-grid">
        {/* Left Column: Student Details */}
        <div className="left-col">
          <div className="col-header" style={{ borderBottom: '1px solid #003366', display: 'inline-block' }}>Student Details:</div>
          <table className="details-table">
            <tbody>
              <tr>
                <td className="label-cell">Student Name</td>
                <td className="value-cell">: {studentInfo.name}</td>
              </tr>
              <tr>
                <td className="label-cell">Admission No</td>
                <td className="value-cell">: {studentInfo.admission_number}</td>
              </tr>
              <tr>
                <td className="label-cell">Class / Section</td>
                <td className="value-cell">: {studentInfo.current_class} / {studentInfo.section}</td>
              </tr>
              <tr>
                <td className="label-cell">Academic Year</td>
                <td className="value-cell">: {paymentInfo.academicYear}</td>
              </tr>
              
              <tr>
                <td colSpan="2" style={{ padding: '8px 0' }}>
                  <div style={{ borderBottom: '2px solid #cbd5e1' }}></div>
                </td>
              </tr>

              <tr>
                <td className="label-cell">Parent Name</td>
                <td className="value-cell">: {studentInfo.father_name}</td>
              </tr>
              <tr>
                <td className="label-cell">Contact Number</td>
                <td className="value-cell">: {studentInfo.father_phone}</td>
              </tr>

              <tr>
                <td colSpan="2" style={{ height: '30px' }}></td>
              </tr>

              <tr style={{ fontSize: '18px' }}>
                <td className="label-cell" style={{ fontWeight: 800 }}>Amount Paid</td>
                <td className="value-cell" style={{ fontWeight: 800 }}>: ₹ {amountPaidValue.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="label-cell">Payment Mode</td>
                <td className="value-cell">: {paymentInfo.paymentMode}</td>
              </tr>
              <tr>
                <td className="label-cell">Transaction ID</td>
                <td className="value-cell">: {paymentInfo.transactionId}</td>
              </tr>
              <tr>
                <td className="label-cell">Payment Date</td>
                <td className="value-cell">: {paymentInfo.paymentDate}</td>
              </tr>
              <tr>
                <td className="label-cell">Due Amount</td>
                <td className="value-cell" style={{ color: dueAmount > 0 ? '#b91c1c' : '#1e40af', fontWeight: 800 }}>: ₹ {dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Fee Details */}
        <div className="right-col">
          <div className="col-header" style={{ borderBottom: '1px solid #003366', display: 'inline-block' }}>Fee Details:</div>
          <table className="fee-table">
            <thead>
              <tr>
                <th style={{ width: '65%' }}>Fee Head</th>
                <th className="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((fee, idx) => (
                <tr key={idx}>
                  <td>{fee.head}</td>
                  <td className="text-right">{fee.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="row-total">
                <td>Total Amount</td>
                <td className="text-right">{totalAmount.toLocaleString()}</td>
              </tr>
              <tr className="row-discount">
                <td style={{ color: '#2563eb' }}>Discount</td>
                <td className="text-right" style={{ color: '#2563eb' }}>{discount.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Late Fee</td>
                <td className="text-right">{lateFee.toLocaleString()}</td>
              </tr>
              <tr className="row-payable">
                <td>Net Payable</td>
                <td className="text-right">{netPayable.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="amount-highlight">
            Amount Paid : ₹ {amountPaidValue.toLocaleString()}
          </div>

          <div className="remarks-container">
            <div className="col-header" style={{ marginLeft: 0, paddingLeft: 0 }}>Remarks :</div>
            <div className="remarks-line">{paymentInfo.remarks}</div>
            <div className="remarks-line"></div>
          </div>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="footer-signatures">
        <div className="signature-box">
          <div className="sig-line">Authorized Signatory</div>
        </div>
        
        <div className="signature-box" style={{ width: 'auto' }}>
          <div className="seal-circle"></div>
        </div>
      </div>

      <div className="system-msg">
        *This is a system-generated receipt*
      </div>
    </div>
  );
};

export default FeeReceipt;
