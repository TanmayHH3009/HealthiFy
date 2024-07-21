
import { DataTable } from '@/components/ui/DataTable'
import StatCard from '@/components/ui/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { columns } from '@/components/table/columns'






const admin = async() => {
    const appointments = await getRecentAppointmentList()

 
  return (
    <div className='ax-auto flex max-w-7xl flex-col space-y-14' >
<header className='admin-header'>
    <Link href='/' className='cursor-pointer'>
    <Image
            src="/assets/icons/hlf.png"
            height={1000}
            width={1000}
            alt="patient"
            priority={false}
            className="h-20 w-fit -my-18"
          /></Link>
    <p className='text-16-semibold'>Admin Dashboard</p>
</header>


<main className='admin-main'>
<section className="w-full space-y-4">
          <h1 className="header text-gray-50">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className='admin-stat'>
            <StatCard
            type='appointments'
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"/>

             <StatCard
            type='pending'
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"/>

            <StatCard
            type='cancelled'
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"/>
            
        </section>



<DataTable columns={columns} data={appointments.documents}/>



</main>
    </div>
  )
}

export default admin
