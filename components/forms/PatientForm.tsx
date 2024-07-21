"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import CustomFormField from "../ui/CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}


const PatientForm = () => {
  // 1. Define your form.
const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
console.log("hello")
    setIsLoading(true);
    try {
      console.log("helloq")
     const userData = {name, email, phone};
     const user = await createUser(userData);
     console.log(user);
     if(user) router.push(`/patients/${user.$id}/register`)
        

    } catch (error) {
      console.log(error)
      //console.log("hello")
    }
setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header text-gray-50">Hi There 👋🏻</h1>
          <p className="text-dark-700"> Schedule Your first Appointment</p>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Ravi Kumar"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />


        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="ravikumar@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Mobile"
          placeholder="+91 67038 49348"

          iconAlt="user"
        />

        <SubmitButton isLoading={isLoading} >Get started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
