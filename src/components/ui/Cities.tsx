import { Button } from "../ui/button";
import React from "react";
export default function Cities() {
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('/cooking.webp?height=400&width=800')" }}
      >
        <div className="absolute top-1/2 left-1/2 w-[90%] max-w-[600px] p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-2xl font-bold">List your restaurant or shop on RestroMap</h2>
          <p className="mt-4">
            Would you like millions of new customers to enjoy your amazing food and groceries? So would we!
          </p>
          <p className="mt-2">
            It's simple: we list your menu and product lists online, help you process orders, pick them up, and deliver
            them to hungry pandas – in a heartbeat!
          </p>
          <p className="mt-2">Interested? Let's start our partnership today!</p>
          <Button className="mt-4 bg-[#ff3366] text-white">Get started</Button>
        </div>
      </div>
      <div className="mt-8 w-full  px-4">
        <h3 className="text-2xl font-bold ">Find us in these cities and many more!</h3>
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { name: "Islamabad", image: "/isl.jpg" },
            { name: "Karachi", image: "/isl.jpg" },
            { name: "Lahore", image: "/isl.jpg" },
            { name: "Faisalabad", image: "/isl.jpg" },
            { name: "Rawalpindi", image: "/isl.jpg" },
            { name: "Abbottabad", image: "/isl.jpg" },
            { name: "Bahawalpur", image: "/isl.jpg" },
            { name: "Dera Ghazi Khan", image: "/isl.jpg" },
            {
              name: "Gujranwala",
              image: "/isl.jpg",
            },
          ].map((city) => (
            <div key={city.name} className="relative overflow-hidden rounded-lg shadow-lg">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover"  height={300} width={500}/>
              <div className="absolute bottom-2 left-2 right-4 p-2 bg-white w-fit rounded-2xl">
                <p className="text-lg font-semibold">{city.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}