import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  X,
  User,
  Calendar,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

export default function PendingPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const data = await adminService.getPendingBankTransfers();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    setProcessing(true);
    try {
      await adminService.approveBankTransfer(paymentId);
      toast.success('Payment approved successfully');
      setSelectedPayment(null);
      fetchPendingPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    
    setProcessing(true);
    try {
      await adminService.rejectBankTransfer(selectedPayment.id, rejectReason);
      toast.success('Payment rejected');
      setSelectedPayment(null);
      setShowRejectModal(false);
      setRejectReason('');
      fetchPendingPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Bank Transfers</h1>
          <p className="text-gray-400 mt-1">Review and approve bank transfer payments</p>
        </div>
        <div className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg flex items-center gap-2">
          <Clock size={20} />
          <span className="font-medium">{payments.length} Pending</span>
        </div>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-gray-400">No pending bank transfers to review.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Payment Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <Clock className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{payment.paymentNumber}</h3>
                      <p className="text-sm text-gray-400">
                        Submitted {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="text-gray-500" size={16} />
                      <span className="text-gray-300">{payment.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500" size={16} />
                      <span className="text-gray-300 font-medium">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500" size={16} />
                      <span className="text-gray-300">{payment.booking?.tour?.title || 'Tour'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">Booking:</span>
                      <span className="text-gray-300 font-mono text-xs">{payment.booking?.bookingNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                    View Receipt
                  </button>
                  <button
                    onClick={() => handleApprove(payment.id)}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowRejectModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedPayment && !showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Payment Receipt</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {/* Payment Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-gray-500 text-sm">Payment Number</span>
                    <p className="text-white font-medium">{selectedPayment.paymentNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Amount</span>
                    <p className="text-white font-medium">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Customer</span>
                    <p className="text-white font-medium">{selectedPayment.user?.name}</p>
                    <p className="text-gray-400 text-sm">{selectedPayment.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Booking</span>
                    <p className="text-white font-medium">{selectedPayment.booking?.bookingNumber}</p>
                    <p className="text-gray-400 text-sm">{selectedPayment.booking?.tour?.title}</p>
                  </div>
                </div>

                {/* Receipt Image */}
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  {selectedPayment.receiptData ? (
                    <img
                      src={
                        selectedPayment.receiptData.startsWith('data:')
                          ? selectedPayment.receiptData
                          : `data:image/png;base64,${selectedPayment.receiptData}`
                      }
                      alt="Payment Receipt"
                      className="w-full max-h-96 object-contain bg-gray-900"
                      onError={(e) => {
                        console.error('Image load error. Data preview:', selectedPayment.receiptData?.substring(0, 100));
                        e.target.style.display = 'none';
                        e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <ImageIcon size={48} className="mb-2" />
                      <p>No receipt uploaded</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPayment.id)}
                    disabled={processing}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    {processing ? 'Processing...' : 'Approve Payment'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Reject Payment</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to reject this payment? The customer will be notified.
                </p>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Rejection Reason (optional)</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    {processing ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
