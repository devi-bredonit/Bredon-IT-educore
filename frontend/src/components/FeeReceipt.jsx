import React from 'react';

const FeeReceipt = ({ student, school, paymentData, receiptNo, date }) => {
    // Default school info if not provided
    const schoolInfo = school || {
        name: 'ABC PUBLIC SCHOOL',
        address: '123, Main Road, City, State - 123456',
        phone: '98765 43210',
        email: 'info@abcshool.com',
        logo: null
    };

    const feeDetails = paymentData?.feeBreakup || [
        { head: 'Tuition Fee', amount: student?.tuition || 15000 },
        { head: 'Transport Fee', amount: student?.transport || 3000 },
        { head: 'Exam Fee', amount: student?.exam || 1500 },
        { head: 'Miscellaneous', amount: student?.misc || 500 }
    ];

    const totalAmount = feeDetails.reduce((sum, item) => sum + item.amount, 0);
    const discount = paymentData?.discount || 1000;
    const lateFee = paymentData?.lateFee || 200;
    const netPayable = totalAmount - discount + lateFee;
    const amountPaid = paymentData?.amountPaid || netPayable;
    const dueAmount = netPayable - amountPaid;

    return (
        <div id="fee-receipt-container" className="fee-receipt-wrapper">
            <div className="fee-receipt">
                {/* Header Section */}
                <div className="receipt-header">
                    <h1 className="school-name">{schoolInfo.name}</h1>
                    <p className="school-address">{schoolInfo.address}</p>
                    <p className="school-contact">
                        Phone: {schoolInfo.phone} | Email: {schoolInfo.email}
                    </p>
                    <div className="receipt-title-box">
                        <h2 className="receipt-title">FEE RECEIPT</h2>
                    </div>
                </div>

                {/* Receipt Meta (No, Date) */}
                <div className="receipt-meta">
                    <div className="meta-item">
                        <strong>Receipt No.:</strong> {receiptNo || '2022/05678'}
                    </div>
                    <div className="meta-item text-right">
                        <strong>Date:</strong> {date || '15/04/2022'}
                    </div>
                </div>

                <div className="receipt-content-grid">
                    {/* Left Column: Student & Payment Details */}
                    <div className="receipt-left-col">
                        <div className="details-section">
                            <h3 className="section-subtitle">Student Details:</h3>
                            <div className="details-grid">
                                <span>Student Name</span> <span>: {student?.name || 'Rajesh Kumar'}</span>
                                <span>Admission No</span> <span>: {student?.admissionNo || 'A10234'}</span>
                                <span>Class / Section</span> <span>: {student?.class || '5th'} / {student?.section || 'B'}</span>
                                <span>Academic Year</span> <span>: {paymentData?.academicYear || '2021-2022'}</span>
                                <span>Parent Name</span> <span>: {student?.parentName || 'Suresh Kumar'}</span>
                                <span>Contact Number</span> <span>: {student?.contactNumber || '98765 12345'}</span>
                            </div>
                        </div>

                        <div className="payment-details-section">
                            <div className="details-grid mt-4">
                                <span className="font-bold">Amount Paid</span> <span className="font-bold">: ₹ {amountPaid.toLocaleString()}</span>
                                <span>Payment Mode</span> <span>: {paymentData?.paymentMode || 'UPI'}</span>
                                <span>Transaction ID</span> <span>: {paymentData?.transactionId || 'UP19876543210'}</span>
                                <span>Payment Date</span> <span>: {paymentData?.paymentDate || '15/04/2022'}</span>
                                <span>Due Amount</span> <span>: ₹ {dueAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Fee Details Table */}
                    <div className="receipt-right-col">
                        <h3 className="section-subtitle">Fee Details:</h3>
                        <table className="fee-table">
                            <thead>
                                <tr>
                                    <th>Fee Head</th>
                                    <th className="text-right">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeDetails.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.head}</td>
                                        <td className="text-right">{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="row-total">
                                    <td><strong>Total Amount</strong></td>
                                    <td className="text-right"><strong>{totalAmount.toLocaleString()}</strong></td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td className="text-right">{discount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Late Fee</td>
                                    <td className="text-right">{lateFee.toLocaleString()}</td>
                                </tr>
                                <tr className="row-net">
                                    <td><strong>Net Payable</strong></td>
                                    <td className="text-right"><strong>{netPayable.toLocaleString()}</strong></td>
                                </tr>
                                <tr className="row-paid-highlight">
                                    <td><strong>Amount Paid</strong></td>
                                    <td className="text-right"><strong>{amountPaid.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="amount-paid-line mt-4">
                            <strong>Amount Paid : ₹ {amountPaid.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="receipt-footer">
                    <div className="remarks-box">
                        <strong>Remarks :</strong>
                        <div className="remarks-line"></div>
                    </div>
                    
                    <div className="signatures-row">
                        <div className="sig-box">
                            <div className="sig-line"></div>
                            <span>Authorized Signatory</span>
                        </div>
                        <div className="seal-box">
                            <div className="seal-circle"></div>
                            <span>School Seal</span>
                        </div>
                    </div>
                </div>

                <div className="system-footer">
                    *This is a system-generated receipt*
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;
