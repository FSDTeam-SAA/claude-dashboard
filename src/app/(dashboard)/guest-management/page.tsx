import React from 'react'
import GuestManagementContainer from './_components/guest-management-container'
import DashboardHeader from '@/components/ui/dashboard-header'

const GuestManagementPage = () => {
  return (
    <div>
        <DashboardHeader title="Guest Management" desc="Ready to compete in your next match?"/>
        <GuestManagementContainer/>
    </div>
  )
}

export default GuestManagementPage