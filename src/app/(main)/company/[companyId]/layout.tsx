import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { companyId: string };
};

const Layout = async ({ children, params }: Props) => {
  const companyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!companyId) {
    return redirect("/company");
  }

  if (
    user.privateMetadata.role !== "COMPANY_OWNER" &&
    user.privateMetadata.role !== "COMPANY_ADMIN"
  )
    return <Unauthorized />;

  let allNotifications: any = [];
  const notifications = await getNotificationAndUser(companyId);
  if (notifications) allNotifications = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.companyId} type="company" />
      <div className="md:pl-[300px]">
      <InfoBar
          notifications={allNotifications}
          role={allNotifications.User?.role}
        />
        <div className="relative">
          <BlurPage>
            {children}
            </BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
