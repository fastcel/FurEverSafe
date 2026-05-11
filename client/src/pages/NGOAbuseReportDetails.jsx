import NGOSidebar from "../components/NGOSidebar";
import { useParams } from "react-router-dom";

export default function NGOAbuseReportDetails() {
  const { id } = useParams();
  const caseId = id || "1001";

  // TODO: Drop in database connection here to fetch specific report details using caseId

  return (
    <div className="flex min-h-screen bg-[#f4f1ea]">
      <NGOSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 pl-10 pr-12">
        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          <button className="bg-[#c6287c] text-white px-10 py-2 rounded-xl font-bold text-xl">
            Current
          </button>
          <button className="bg-[#c6287c] text-white px-10 py-2 rounded-xl font-bold text-xl">
            Previous
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#5e174f] mb-6">
          Case#{caseId}
        </h1>

        {/* Details Card */}
        <div className="border-[3px] border-black bg-[#e8e0d0] rounded-md p-10 flex flex-col min-h-[700px]">

          <div className="flex gap-12 flex-1">
            {/* Left Column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[#d32f2f] font-bold text-2xl mb-8 flex items-center gap-3">
                  {/* TODO: Replace hardcoded urgency state with database data */}
                  <span className="text-3xl">⚠️</span> Need Urgent Attention!
                </p>

                <p className="font-bold text-xl mb-3">
                  {/* TODO: Replace hardcoded animal type with database data */}
                  Animal: <span className="text-[#c6287c]">Dog</span>
                </p>
                <p className="font-bold text-xl mb-8">
                  {/* TODO: Replace hardcoded date with database data */}
                  Reported on: <span className="text-[#c6287c]">April 27th, 2026</span>
                </p>
              </div>

              <div className="mt-auto">
                <p className="font-bold text-xl mb-3">Location</p>
                <div className="border-[3px] border-black rounded-md h-64 bg-[#d9e5f2] relative overflow-hidden flex mb-8">
                  {/* Mock Map Background */}
                  <div className="w-1/3 bg-[#c2f0c2] h-full border-r-4 border-white" />
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute grid grid-cols-3 grid-rows-3 gap-2 w-full h-full p-2 opacity-50">
                      <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                      <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                    </div>
                    <span className="text-blue-500 text-5xl z-10">📍</span>
                  </div>

                  {/* Badges on Map */}
                  <div className="absolute bottom-3 left-3 border-[3px] border-black bg-white px-3 py-1 text-sm font-bold text-[#c6287c]">
                    {/* TODO: Replace hardcoded location string with database data */}
                    Lahore, Punjab
                  </div>
                </div>

                <div className="flex mt-4">
                  <button className="bg-[#c6287c] text-white px-8 py-3 text-xl rounded-lg font-bold">
                    Open on Maps?
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col justify-between ml-6">
              <div>
                <p className="font-bold text-xl mb-3">Description of the Incident</p>
                <div className="border-[3px] border-black bg-[#e0e0e0] h-48 flex relative text-lg">
                  <div className="p-4 font-medium pr-10">
                    {/* TODO: Replace hardcoded description with database data */}
                    Saw a bunch of kids abusing a dog by throwing objects at it. The poor thing was severely injured. It was probably a stray dog and seemed extremely malnourished as well.
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 border-l-[3px] border-black bg-[#d9d9d9]">
                    <div className="h-16 bg-[#b5b5b5] border-b-[3px] border-black w-full" />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-7 mb-3"></div> {/* Invisible spacer to align perfectly with the "Location" text on the left */}
                <div className="border-[3px] border-black p-2 h-64 mb-8">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                    {/* TODO: Replace hardcoded image URLs with database data */}
                    <div className="bg-[#b3a18f] overflow-hidden"><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1" className="w-full h-full object-cover" alt="Dog 1" /></div>
                    <div className="bg-[#8c6b4a] overflow-hidden"><img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e" className="w-full h-full object-cover" alt="Dog 2" /></div>
                    <div className="bg-[#a8bfd9] overflow-hidden"><img src="https://images.unsplash.com/photo-1537151608804-ea2f14147199" className="w-full h-full object-cover" alt="Dog 3" /></div>
                    <div className="bg-[#c0c0c0] flex items-center justify-center">
                      <button className="bg-[#c6287c] text-white px-6 py-2 rounded-lg font-bold text-base">
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-6 mt-4">
                  <button className="bg-[#c6287c] text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-[#a01d60]">
                    Accept Case
                  </button>
                  <button className="bg-[#d32f2f] text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-[#b71c1c]">
                    Dismiss Case
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
