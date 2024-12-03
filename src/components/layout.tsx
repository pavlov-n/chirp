import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center overflow-y-auto">
      <div className="h-fit w-full md:max-w-2xl shadow-md shadow-white">
        {props.children}
      </div>
    </main>
  );
};
