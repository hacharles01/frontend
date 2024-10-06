import React, { createContext } from "react";

/**
 * @ignore - internal component.
 */
const TreeViewContext = createContext({});

if (process.env.NODE_ENV !== "production") {
  TreeViewContext.displayName = "TreeViewContext";
}

export default TreeViewContext;
