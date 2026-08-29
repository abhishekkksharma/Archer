"use client";

import React from "react";
import { useParams } from "next/navigation";

function Page() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      {id}
    </div>
  );
}

export default Page;