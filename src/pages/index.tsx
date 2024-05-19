// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Footer from "comps/Footer";
import Dashboard from "comps/Dashboard";
import { Button } from "~/lib/ui/components/ui/button";

export default function Home() {

  return (
    <>
      <Dashboard />
      <Footer />
      <Button>Hellow WOrld</Button>
    </>
  );
}
