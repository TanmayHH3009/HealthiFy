"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getAppointmentSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import CustomFormField from "../ui/CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormFieldType } from "./PatientForm";
import { SelectItem } from "../ui/select";

import { Doctors } from "@/constants";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({userId, patientId, type,appointment, setOpen}:{
    userId:string,
    patientId:string,
    type:"create"|"cancel"|"schedule",
    appointment?:Appointment,
    setOpen:(value:boolean)=>void
}) => {
  // 1. Define your form.
const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
     primaryPhysician:appointment && appointment.primaryPhysician,
     schedule: appointment ? new Date(appointment?.schedule):new Date(Date.now()),
     reason:appointment ? appointment.reason:'',
     note:appointment ? appointment.note:'',
     cancellationReason: appointment?.cancellationReason || '',



    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {

    setIsLoading(true);

    let status;
    switch(type){
        case 'schedule':
            status='scheduled';
            break;
        case 'cancel':
            status='cancelled';
            break;

         
        default:
            status='pending';

            break;

    }
    try {
       
    if(type==='create' && patientId){
        const appointmentData = {
            userId,
            patient:patientId,
            primaryPhysician:values.primaryPhysician,
            schedule:new Date(values.schedule),
            status: status as Status,
            reason:values.reason!,
            note:values.note,
            
        }
       
        const appointment = await createAppointment(appointmentData);
        if(appointment){
            form.reset();
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
    }
    else{
      const appointmentToUpdate = {
        userId, 
        appointmentId: appointment?.$id!,
        appointment:{
          primaryPhysician: values?.primaryPhysician,
          schedule:new Date(values?.schedule),
          status: status as Status,
          cancellationReason: values?.cancellationReason,
        },
        type

      }
      const updatedAppointment = await updateAppointment (appointmentToUpdate)
      if(updatedAppointment){
        setOpen && setOpen(false)
        form.reset();
      }
    }


    } catch (error) {
        console.log('helloerr')
      console.log(error)
      //console.log("hello")
    }
setIsLoading(false);
  }

let buttonLebel;switch(type){
    case 'cancel':
        buttonLebel = 'Cancel Appointment'
        break;
    case 'create':
        buttonLebel = 'Create Appointment'
        break;
    case 'schedule':
        buttonLebel = 'Schedule Appointment'
        break;
    default:
        break;

}








  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      {type==='create' && <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700"> Request Appointment in 10 seconds</p>
        </section>}

        {type !=="cancel" &&(
            <>
  <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a Physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-fullborder border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Expected Appointment Date and Time"
          showTimeSelect
          dateFormat="MM/dd/yyyy - h:mm aa"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason for Appointment"
            placeholder="Enter reason for Appointment"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="note"
            label="Notes"
            placeholder="Enter notes"
          />
          </div>
            </>
        )}

{type ==="cancel" &&(
    <>
     <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter the reason for Cancellation"
          />
    </>
)}
        <SubmitButton isLoading={isLoading}  className={`${type==='cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLebel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
