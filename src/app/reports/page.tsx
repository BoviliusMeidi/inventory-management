import Layout from "../components/Layout";

export default function ReportsPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-3 mr-3">
        <div className="flex flex-row gap-2">
          {/* Overview -- Block 1 */}
          <div className="bg-white shadow-md p-4 rounded-md flex-1">
            <h1 className="text-lg pb-2 tracking-wide">Overview</h1>
            <div className="flex flex-col justify-between gap-4 mt-3 font-semibold">
              <div className="flex flex-row justify-around">
                {[
                  {
                    title: "Total Profit",
                    price: "Rp12",
                    color: "text-gray-600",
                  },
                  {
                    title: "Revenue",
                    price: "Rp14",
                    color: "text-yellow-700",
                  },
                  {
                    title: "Sales",
                    price: "Rp14",
                    color: "text-indigo-600",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex flex-row">
                      <p>{item.price}</p>
                    </div>
                    <h3 className={`${item.color}`}>{item.title}</h3>
                  </div>
                ))}
              </div>
              <hr className="text-gray-300" />
              <div className="flex flex-row justify-between">
                {[
                  {
                    title: "Net Purchase Value",
                    price: "Rp14",
                  },
                  {
                    title: "Net Sales Value",
                    price: "Rp14",
                  },
                  {
                    title: "MoM Profit",
                    price: "Rp14",
                  },
                  {
                    title: "YoY Profit",
                    price: "Rp14",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between items-start gap-1"
                  >
                    <div>
                      <p>{item.price}</p>
                    </div>
                    <h3 className="text-gray-600">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Best Selling Category -- Block 2 */}
          <div className="bg-white shadow-md p-4 rounded-md flex-1">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-lg pb-2 tracking-wide">
                Best Selling Category
              </h1>
              <p className="text-blue-500">See All</p>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <div className="flex flex-1">
                <table className="min-w-full bg-white text-left">
                  {/* Title of Column */}
                  <thead className="text-gray-600">
                    <tr>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Turn Over</th>
                      <th className="py-2 px-4">Increase By</th>
                    </tr>
                  </thead>
                  {/* Data of Column */}
                  <tbody>
                    <tr className="border-t border-gray-300">
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Rp123</td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Rp123</td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Product Name</td>
                      <td className="py-2 px-4">Rp123</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          {/* Profit & Revenue -- Block 3 */}
          <div className="flex flex-row justify-between items-center gap-3">
            <h1 className="text-lg pb-2 tracking-wide">Profit & Revenue</h1>
            {/* Button -- Weekly */}
            <div className="flex flex-row gap-4 tracking-wide">
              <button className="cursor-pointer rounded-md py-2 px-4 border border-gray-500 flex items-center gap-3 relative group">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.3871 1.94688H16.2903V1.41591C16.2903 0.910059 16.0444 0.4426 15.6452 0.189634C15.246 -0.0632112 14.754 -0.0632112 14.3548 0.189634C13.9556 0.442636 13.7097 0.9101 13.7097 1.41591V1.94688H6.29032V1.41591C6.29032 0.910059 6.04435 0.4426 5.64516 0.189634C5.24597 -0.0632112 4.75403 -0.0632112 4.35484 0.189634C3.95565 0.442636 3.70968 0.9101 3.70968 1.41591V1.94688H1.6129C1.18518 1.94688 0.774931 2.13336 0.472332 2.4652C0.169913 2.79721 0 3.24744 0 3.7168V18.2301C0 18.6994 0.169932 19.1496 0.472332 19.4817C0.774894 19.8135 1.18518 20 1.6129 20H18.3871C18.8148 20 19.2251 19.8135 19.5277 19.4817C19.8301 19.1497 20 18.6994 20 18.2301V3.7168C20 3.24744 19.8301 2.79725 19.5277 2.4652C19.2251 2.13334 18.8148 1.94688 18.3871 1.94688ZM14.3547 1.41591C14.3547 1.16291 14.4776 0.929194 14.6772 0.802772C14.8768 0.67635 15.1228 0.67635 15.3224 0.802772C15.522 0.929194 15.645 1.16292 15.645 1.41591V3.53981C15.645 3.79281 15.522 4.02652 15.3224 4.15294C15.1228 4.27937 14.8768 4.27937 14.6772 4.15294C14.4776 4.02652 14.3547 3.7928 14.3547 3.53981V1.41591ZM4.35465 1.41591C4.35465 1.16291 4.47764 0.929194 4.67723 0.802772C4.87683 0.67635 5.1228 0.67635 5.3224 0.802772C5.52199 0.929194 5.64498 1.16292 5.64498 1.41591V3.53981C5.64498 3.79281 5.52199 4.02652 5.3224 4.15294C5.1228 4.27937 4.87683 4.27937 4.67723 4.15294C4.47764 4.02652 4.35465 3.7928 4.35465 3.53981V1.41591ZM1.61272 2.65485H3.70949V3.53981C3.70949 4.04566 3.95546 4.51312 4.35465 4.76608C4.75384 5.01893 5.24579 5.01893 5.64498 4.76608C6.04417 4.51308 6.29014 4.04562 6.29014 3.53981V2.65485H13.7095V3.53981C13.7095 4.04566 13.9555 4.51312 14.3547 4.76608C14.7538 5.01893 15.2458 5.01893 15.645 4.76608C16.0442 4.51308 16.2901 4.04562 16.2901 3.53981V2.65485H18.3869C18.6435 2.65485 18.8898 2.76673 19.0712 2.96585C19.2526 3.16496 19.3546 3.43521 19.3546 3.71678V6.37165H0.644958V3.71678C0.644958 3.43517 0.746916 3.16493 0.928369 2.96585C1.10982 2.76677 1.35609 2.65485 1.61268 2.65485H1.61272ZM18.3869 19.292H1.61272C1.3561 19.292 1.10982 19.1802 0.928405 18.981C0.746986 18.7819 0.644995 18.5117 0.644995 18.2301V7.07986H19.3547V18.2301C19.3547 18.5117 19.2527 18.782 19.0713 18.981C18.8898 19.1801 18.6435 19.292 18.3869 19.292H18.3869Z"
                    fill="#5D6679"
                  />
                </svg>
                Weekly
                <div className="absolute top-8 -left-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 pointer-events-none">
                  <ul className="flex flex-col p-2">
                    <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                      Option 1
                    </li>
                    <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                      Option 2
                    </li>
                    <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                      Option 3
                    </li>
                    <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                      Option 4
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Best Selling Product */}
        <div className="bg-white shadow-md p-4 rounded-md flex-1 mb-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-lg pb-2 tracking-wide">Best Selling Product</h1>
            <p className="text-blue-500">See All</p>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <div className="flex flex-1">
              <table className="min-w-full bg-white text-left">
                {/* Title of Column */}
                <thead className="text-gray-600">
                  <tr>
                    <th className="py-2 px-4">Product Name</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Remaining Stock</th>
                    <th className="py-2 px-4">Turn Over</th>
                    <th className="py-2 px-4">Increase By</th>
                  </tr>
                </thead>
                {/* Data of Column */}
                <tbody>
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Product Name</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                    <td className="py-2 px-4">Rp123</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
