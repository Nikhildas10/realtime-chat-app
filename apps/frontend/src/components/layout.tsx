import { Outlet } from "react-router-dom"

export const Layout = () => {
  return (
    <div className="bg-background  min-w-screen ">
      <Outlet />
    </div>
  )
}