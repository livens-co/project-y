import { getAuthUserDetails } from "@/lib/queries";
import React from "react";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "company" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return null;

  if (!user.Company) return;

  const details =
    type === "company"
      ? user?.Company
      : user?.Company.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledCompany = user.Company.whiteLabel;
  if (!details) return;

  let sidebarLogo = user.Company.companyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabeledCompany) {
    if (type === "subaccount") {
      sidebarLogo =
        user?.Company.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Company.companyLogo;
    }
  }

  const sidebarOpt =
    type === "company"
      ? user.Company.SidebarOption || []
      : user.Company.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subaccounts = user.Company.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        subAccounts={subaccounts}
        sidebarOpt={sidebarOpt}
        sidebarLogo={sidebarLogo}
        details={details}
        user={user}
        id={id}
      />
      <MenuOptions
        subAccounts={subaccounts}
        sidebarOpt={sidebarOpt}
        sidebarLogo={sidebarLogo}
        details={details}
        user={user}
        id={id}
      />
      
    </>
  );
};

export default Sidebar;
