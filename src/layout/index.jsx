import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Aside, Header, PopUpMsg } from "../components";
import { closePopUp } from "../store/reducer";

export default function Layout({ children }) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { open, message, type } = useSelector((state) => state.storeReducer);
  const dispatch = useDispatch();

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenDrawer(!openDrawer);
  };

  return (
    <div className="az_layout_99">
      <Aside open={openDrawer} toggleDrawer={toggleDrawer} />
      <div className="az_main">
        <Header toggleDrawer={toggleDrawer} />
        <main className="main_content">{children}</main>
      </div>
      <PopUpMsg
        open={open}
        type={type}
        message={message}
        handleClose={() => dispatch(closePopUp())}
      />
    </div>
  );
}
