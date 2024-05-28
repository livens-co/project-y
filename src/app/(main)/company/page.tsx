import CompanyDetails from "@/components/forms/company-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  // for invitation users
  const companyId = await verifyAndAcceptInvitation();
  console.log(companyId);

  // get user details
  const user = await getAuthUserDetails();
  if (companyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (
      user?.role === "COMPANY_OWNER" ||
      user?.role === "COMPANY_ADMIN"
    ) {
      if (searchParams.plan) {
        return redirect(
          `/company/${companyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateCompanyId = searchParams.state.split("___")[1];
        if (!stateCompanyId) return <div>Not authorized</div>;
        return redirect(
          `/company/${stateCompanyId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/company/${companyId}`);
    } else {
      return <div>Not authorized</div>;
    }
  }

  const authUser = await currentUser()

  return (
    <div className="flex justify-center items-center mt-4">
    <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
      <h1 className="text-4xl"> Create a Company</h1>
      <CompanyDetails
        data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
      />
    </div>
  </div>
  )
};

export default Page;
