import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";

export const TestWrapper = ({ children }: React.PropsWithChildren) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
