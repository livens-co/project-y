import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { currentUser } from "@clerk/nextjs/server";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { companyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      Company: {
        id: params.companyId,
      },
    },
    include: {
      Company: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const companyDetails = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!companyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation companyId={companyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default TeamPage;
