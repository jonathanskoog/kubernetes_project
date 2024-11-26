import {Navbar, NavbarBrand} from "@nextui-org/react";
import {AcmeLogo} from "./AcmeLogo.jsx";

export default function Navigationbar() {
  return (
    <Navbar isBordered isBlurred maxWidth="full" >
      <NavbarBrand >
        <AcmeLogo />
        <p className="font-bold text-inherit">Audiofy</p>
      </NavbarBrand>
  
    </Navbar>
  );
}