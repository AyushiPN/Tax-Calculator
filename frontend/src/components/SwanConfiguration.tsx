import {
  getRootClassNames,
  SwanHead,
  SwanProvider,
  SWAN_STYLE_KEY_MAP,
  useBrowserClasses,
} from "@vp/swan";
import * as React from "react";

import { Helmet } from "react-helmet";

const eagerlyLoadedStyles = [
  SWAN_STYLE_KEY_MAP.button,
  SWAN_STYLE_KEY_MAP.accordion,
  SWAN_STYLE_KEY_MAP.grid,
];

type SwanConfigProps = {
  children: React.ReactNode;
};

export const SwanConfiguration = ({ children }: SwanConfigProps) => {
  const browser = useBrowserClasses();
  const rootClassName = getRootClassNames();
  // const { tenant, locale } = getTenantAndLocale() // Illustration function. Actual implementation will differ
  return (
    <SwanProvider swanTenant={"vistaprint"} swanLocale={"en-GB"}>
      <Helmet
        htmlAttributes={{ class: browser }}
        bodyAttributes={{ class: rootClassName }}
      />
      <SwanHead
        renderStyleContentAsChildren
        renderWith={Helmet}
        styleSheetKeys={eagerlyLoadedStyles}
      />
      {/* Optionally, if you need, wrap ScreenProvider at this level */}
      {children}
    </SwanProvider>
  );
};
