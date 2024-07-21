import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'

import React from 'react'

const Register = async ({params:{userId}}:SearchParamProps) => {
    const user = await getUser(userId);



  return (

    <div className="flex h-screen max-h-screen">
     
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-cle py-10">
        <Image
            src="/assets/icons/hlf.png"
            height={1000}
            width={1000}
            alt="patient"
            priority={false}
            className="h-20 w-fit -my-18"
          />
        <RegisterForm user={user}/>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="copyright py-6">
              © HelthCentre
            </p>
          
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px] "
      />
    </div>
  )
}

export default Register
