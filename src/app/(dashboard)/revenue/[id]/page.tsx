import DashboardHeader from '@/components/ui/dashboard-header'
import React from 'react'
import RevenueDetailsContainer from './_components/revenue-details-container'

const RevenueDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <DashboardHeader title="Revenue Details" desc="View detailed payment information" />
      <RevenueDetailsContainer id={params?.id} />
    </div>
  )
}

export default RevenueDetailsPage
