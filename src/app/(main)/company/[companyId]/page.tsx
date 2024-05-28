import React from "react";

const Page = ({ params }: { params: { companyId: string } }) => {
  return <div>{params.companyId}</div>;
};

export default Page;
