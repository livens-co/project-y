

import CompanyDetails from "@/components/forms/company-details";
import UserDetails from "@/components/forms/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: { companyId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  });

  if (!userDetails) return null;
  const companyDetails = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!companyDetails) return null;

  const subAccounts = companyDetails.SubAccount;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <CompanyDetails data={companyDetails}/>
      <UserDetails
        type="company"
        id={params.companyId}
        subAccounts={subAccounts}
        userData={userDetails}
      /> 
    </div>
  );
};

export default SettingsPage;
