import DashboardHeader from '@/components/ui/dashboard-header'
import React from 'react'
import ContactManagementContainer from './_components/contact-management-container'

const NewsletterManagementPage = () => {
  return (
    <div>
        <DashboardHeader title="Newsletter Management" desc="Ready to compete in your next match?"/>
        <ContactManagementContainer/>
    </div>
  )
}

export default NewsletterManagementPage