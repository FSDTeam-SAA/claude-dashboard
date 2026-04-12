import DashboardHeader from '@/components/ui/dashboard-header'
import React from 'react'
import NewsletterManagementContainer from './_components/newsletter-management-container'

const NewsletterManagementPage = () => {
  return (
    <div>
        <DashboardHeader title="Newsletter Management" desc="Ready to compete in your next match?"/>
        <NewsletterManagementContainer/>
    </div>
  )
}

export default NewsletterManagementPage