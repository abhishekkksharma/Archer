import Navbar from "@/components/Header/Navbar"
import AddNewProject from "@/components/Projects/AddNewProject"

function page() {
  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen pt-18">
      <Navbar theme="light"/>
      <AddNewProject/>
    </div>
  )
}

export default page