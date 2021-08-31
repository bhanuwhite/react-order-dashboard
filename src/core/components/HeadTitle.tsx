import * as React from "react";
import { FC } from "react";
import { newIdGenerator } from "../utils/uniqueId";

// tslint:disable-next-line: variable-name
export const HeadTitle: FC<Props> = ({ children }) => {
  const [id] = React.useState(newId);

  React.useEffect(() => {
    if (Array.isArray(children)) {
      document.title = children.join("");
    } else {
      document.title = children;
    }
  }, [id]);
  return null;
};
interface Props {
  children: string | string[];
}

const newId = newIdGenerator("head-title");
