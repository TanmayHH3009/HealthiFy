
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({params:{userId}}:SearchParamProps) {
    const patient = await getPatient(userId)
  return (
    <div className="flex h-screen max-h-screen">
   
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
            src="/assets/icons/hlf.png"
            height={1000}
            width={1000}
            alt="patient"
            priority={false}
            className="h-20 w-fit -my-18"
          />
         <AppointmentForm type="create" userId={userId} patientId={patient.$id} />
         <p className="copyright mt-10 py-12">
              © HelthCentre
            </p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom "
      />
    </div>
  );
}
