'use client'

import { useMemo, useState } from 'react'
import { Download, DollarSign, Clock, XCircle, CheckCircle, Eye, RefreshCw, Search, ReceiptText } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockTenants, mockTransactions } from '@/lib/mock-data'
import { Transaction } from '@/lib/types'

const GATEWAYS = ['stripe', 'paypal', 'paystack', 'flutterwave'] as const

type Gateway = (typeof GATEWAYS)[number]
type StatusFilter = 'all' | Transaction['status']
type GatewayFilter = 'all' | Gateway

type TransactionRow = Transaction & {
  displayId: string
  tenantName: string
  gateway: Gateway
}

type FilterState = {
  startDate: string
  endDate: string
  tenantId: string
  gateway: GatewayFilter
  status: StatusFilter
}

function getTodayISO() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getISOFromDaysAgo(days: number) {
  const now = new Date()
  now.setDate(now.getDate() - days)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseISODate(value: string, endOfDay = false) {
  const date = new Date(`${value}T00:00:00`)
  if (endOfDay) {
    date.setHours(23, 59, 59, 999)
  }
  return date
}

function deriveGateway(transactionId: string): Gateway {
  const index = Number(transactionId.split('_')[1] || 0) % GATEWAYS.length
  return GATEWAYS[index]
}

function formatDateCompact(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}${mm}${dd}`
}

export default function TransactionsPage() {
  const defaultFilters: FilterState = {
    startDate: getISOFromDaysAgo(29),
    endDate: getTodayISO(),
    tenantId: 'all',
    gateway: 'all',
    status: 'all',
  }

  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters)
  const [filterError, setFilterError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [receiptTransaction, setReceiptTransaction] = useState<TransactionRow | null>(null)
  const [refundTransaction, setRefundTransaction] = useState<TransactionRow | null>(null)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [refundError, setRefundError] = useState('')

  const transactions = useMemo<TransactionRow[]>(() => {
    const tenantMap = new Map(mockTenants.map((tenant) => [tenant.id, tenant.name]))

    return mockTransactions.map((transaction) => ({
      ...transaction,
      tenantName: tenantMap.get(transaction.tenantId) || 'Unknown Tenant',
      gateway: deriveGateway(transaction.id),
      displayId: `TRX-${formatDateCompact(new Date(transaction.createdAt))}-${transaction.tenantId}-${transaction.id.toUpperCase()}`,
    }))
  }, [])

  const filteredTransactions = useMemo(() => {
    const start = parseISODate(appliedFilters.startDate)
    const end = parseISODate(appliedFilters.endDate, true)
    const query = searchQuery.trim().toLowerCase()

    return transactions.filter((transaction) => {
      if (transaction.createdAt < start || transaction.createdAt > end) return false
      if (appliedFilters.tenantId !== 'all' && transaction.tenantId !== appliedFilters.tenantId) return false
      if (appliedFilters.gateway !== 'all' && transaction.gateway !== appliedFilters.gateway) return false
      if (appliedFilters.status !== 'all' && transaction.status !== appliedFilters.status) return false
      if (
        query &&
        !transaction.displayId.toLowerCase().includes(query) &&
        !transaction.tenantName.toLowerCase().includes(query) &&
        !transaction.id.toLowerCase().includes(query)
      ) {
        return false
      }
      return true
    })
  }, [appliedFilters, searchQuery, transactions])

  const completedTransactions = filteredTransactions.filter((transaction) => transaction.status === 'completed')
  const pendingTransactions = filteredTransactions.filter((transaction) => transaction.status === 'pending')
  const failedTransactions = filteredTransactions.filter((transaction) => transaction.status === 'failed')

  const totalAmount = completedTransactions.reduce((sum, transaction) => {
    return sum + (transaction.type === 'refund' ? -transaction.amount : transaction.amount)
  }, 0)

  const handleApplyFilters = () => {
    const start = parseISODate(draftFilters.startDate)
    const end = parseISODate(draftFilters.endDate, true)
    if (start > end) {
      setFilterError('Start date cannot be later than end date.')
      return
    }
    setFilterError('')
    setAppliedFilters(draftFilters)
  }

  const handleViewReceipt = (transactionId: string) => {
    const transaction = filteredTransactions.find((item) => item.id === transactionId)
    if (!transaction) return
    setReceiptTransaction(transaction)
  }

  const handleRefund = (transactionId: string) => {
    const transaction = filteredTransactions.find((item) => item.id === transactionId)
    if (!transaction) return
    setRefundTransaction(transaction)
    setRefundAmount(String(transaction.amount))
    setRefundReason('')
    setRefundError('')
  }

  const handleSubmitRefund = () => {
    if (!refundTransaction) return
    const amount = Number(refundAmount)
    if (!amount || amount <= 0) {
      setRefundError('Enter a valid refund amount.')
      return
    }
    if (amount > refundTransaction.amount) {
      setRefundError('Refund amount cannot exceed transaction amount.')
      return
    }
    if (!refundReason.trim()) {
      setRefundError('Refund reason is required.')
      return
    }
    console.log('Refund transaction:', {
      transactionId: refundTransaction.id,
      amount,
      reason: refundReason.trim(),
    })
    setRefundTransaction(null)
  }

  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'displayId' as const,
      cell: (value: string, row: TransactionRow) => (
        <div className="space-y-1">
          <p className="font-medium leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{row.id.toUpperCase()}</p>
        </div>
      ),
    },
    {
      header: 'Tenant',
      accessor: 'tenantName' as const,
      cell: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      cell: (value: number, row: TransactionRow) => {
        const sign = row.type === 'refund' ? '-' : '+'
        const color = row.type === 'refund' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
        return <span className={`font-semibold ${color}`}>{sign}${value.toLocaleString()}</span>
      },
    },
    {
      header: 'Gateway',
      accessor: 'gateway' as const,
      cell: (value: Gateway) => (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase">{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: Transaction['status']) => {
        const colors: Record<Transaction['status'], string> = {
          completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        }
        return <span className={`capitalize rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[value]}`}>{value}</span>
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (value: string, row: TransactionRow) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleViewReceipt(value)}>
            <Eye className="mr-1 h-3.5 w-3.5" />
            View Receipt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefund(value)}
            disabled={row.status !== 'completed' || row.type !== 'payment'}
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            Refund
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="All payment transactions across the platform"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground">Filtered results</p>
            </div>
            <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
              <DollarSign className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-xl font-bold">${totalAmount.toLocaleString()}</div>
          <p className="mt-1.5 text-xs text-muted-foreground">{completedTransactions.length} completed</p>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-xs text-muted-foreground">Awaiting completion</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-1.5 dark:bg-yellow-900/30">
              <Clock className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-xl font-bold">
            ${pendingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toLocaleString()}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{pendingTransactions.length} transactions</p>
        </Card>

        <Card className="border-red-200 p-3 hover:shadow-md transition-shadow dark:border-red-900">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed</p>
              <p className="text-xs text-muted-foreground">Requires action</p>
            </div>
            <div className="rounded-full bg-red-100 p-1.5 dark:bg-red-900/30">
              <XCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            ${failedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toLocaleString()}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{failedTransactions.length} transactions</p>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-xs text-muted-foreground">Filtered results</p>
            </div>
            <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
              <CheckCircle className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-xl font-bold">
            {filteredTransactions.length
              ? ((completedTransactions.length / filteredTransactions.length) * 100).toFixed(1)
              : '0.0'}
            %
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Current filtered period</p>
        </Card>
      </div>

      <Card className="border border-border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto] xl:items-end">
          <div className="grid gap-2">
            <Label htmlFor="transactions-start-date">Start Date</Label>
            <Input
              id="transactions-start-date"
              type="date"
              value={draftFilters.startDate}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, startDate: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transactions-end-date">End Date</Label>
            <Input
              id="transactions-end-date"
              type="date"
              value={draftFilters.endDate}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, endDate: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Tenant</Label>
            <Select
              value={draftFilters.tenantId}
              onValueChange={(value) =>
                setDraftFilters((current) => ({ ...current, tenantId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {mockTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Gateway</Label>
            <Select
              value={draftFilters.gateway}
              onValueChange={(value: GatewayFilter) =>
                setDraftFilters((current) => ({ ...current, gateway: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateway</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="paystack">Paystack</SelectItem>
                <SelectItem value="flutterwave">Flutterwave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={draftFilters.status}
              onValueChange={(value: StatusFilter) =>
                setDraftFilters((current) => ({ ...current, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleApplyFilters} className="w-full xl:w-auto">Apply</Button>
          </div>
        </div>

        {filterError ? <p className="mt-3 text-sm text-red-600">{filterError}</p> : null}
      </Card>

      <Card className="border border-border hover:shadow-md transition-shadow">
        <div className="border-b px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">Transaction Records</p>
              <p className="text-xs text-muted-foreground">
                {filteredTransactions.length} result(s) from applied filters
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by transaction ID or tenant"
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredTransactions}
          pageSize={10}
          emptyMessage="No transactions found for the selected filters"
        />
      </Card>

      <Dialog open={Boolean(receiptTransaction)} onOpenChange={(open) => !open && setReceiptTransaction(null)}>
        <DialogContent className="!fixed !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] relative max-h-[calc(100vh-2rem)] overflow-y-auto overflow-hidden sm:max-w-lg">
          <div className="pointer-events-none absolute inset-0 z-0">
            <ReceiptText
              className="absolute top-1 right-1 h-40 w-40 translate-x-1/4 -translate-y-1/4 text-emerald-100/45"
              aria-hidden="true"
            />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle>Transaction Receipt</DialogTitle>
            <DialogDescription>Payment receipt details for this transaction.</DialogDescription>
          </DialogHeader>
          {receiptTransaction ? (
            <div className="relative z-10 space-y-3 text-sm">
              <div>
                <p className="text-sm font-semibold">Official Payment Receipt</p>
                <p className="text-xs text-muted-foreground">Verified transaction summary</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Receipt ID</span>
                <span className="font-medium">{receiptTransaction.displayId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">{receiptTransaction.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tenant</span>
                <span className="font-medium">{receiptTransaction.tenantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gateway</span>
                <span className="font-medium uppercase">{receiptTransaction.gateway}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${receiptTransaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{receiptTransaction.status}</span>
              </div>
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1">{receiptTransaction.description}</p>
              </div>
            </div>
          ) : null}
          <DialogFooter className="relative z-10">
            <Button variant="outline" onClick={() => setReceiptTransaction(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(refundTransaction)} onOpenChange={(open) => !open && setRefundTransaction(null)}>
        <DialogContent className="!fixed !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] relative overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
          <div className="pointer-events-none absolute inset-0 z-0">
            <RefreshCw
              className="absolute top-1 right-1 h-40 w-40 translate-x-1/4 -translate-y-1/4 text-blue-100/45"
              aria-hidden="true"
            />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>Create a refund request for this transaction.</DialogDescription>
          </DialogHeader>
          {refundTransaction ? (
            <div className="relative z-10 space-y-4">
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="font-medium">{refundTransaction.displayId}</p>
                <p className="text-xs text-muted-foreground">{refundTransaction.tenantName}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refund-amount">Refund Amount</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  min={0}
                  step="0.01"
                  value={refundAmount}
                  onChange={(event) => setRefundAmount(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refund-reason">Reason</Label>
                <Textarea
                  id="refund-reason"
                  value={refundReason}
                  onChange={(event) => setRefundReason(event.target.value)}
                  placeholder="Explain why this refund is being issued."
                />
              </div>
              {refundError ? <p className="text-sm text-red-600">{refundError}</p> : null}
            </div>
          ) : null}
          <DialogFooter className="relative z-10">
            <Button variant="outline" onClick={() => setRefundTransaction(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRefund}>Confirm Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
