import DashboardHeader from '@/components/ui/dashboard-header'
import React from 'react'
import CouponManagementContainer from './_components/coupon-management-container'

const CouponManagementPage = () => {
  return (
    <div>
        <DashboardHeader title="Coupon Management" desc="Manage your coupons efficiently"/>
        <CouponManagementContainer/>
    </div>
  )
}

export default CouponManagementPage