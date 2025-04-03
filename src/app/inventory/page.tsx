import Layout from "../components/Layout";
import AddProduct from "../components/AddProduct";
// const stockStatus = ["In-Stock", "Out of Stock", "Low Stock"];

export default function InventoryPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-3 mr-3">
        {/* Overall Inventory -- Block 1 */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h1 className="text-lg pb-2 tracking-wide">Overall Inventory</h1>
          <div className="flex flex-row justify-between gap-3 mt-3 font-semibold">
            <div className="flex flex-col gap-1">
              <h3 className="text-blue-600">Categories</h3>
              <div className="flex flex-row justify-between">
                <p>14</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Last 7 days</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-yellow-700">Total Products</h3>
              <div className="flex flex-row justify-between">
                <p>14</p>
                <p>Rp14</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Last 7 days</p>
                <p>Revenue</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-indigo-600">Top Selling</h3>
              <div className="flex flex-row justify-between">
                <p>14</p>
                <p>Rp14</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Last 7 days</p>
                <p>Costs</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-red-400">Low Stocks</h3>
              <div className="flex flex-row justify-between">
                <p>14</p>
                <p>14</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Last 7 days</p>
                <p>Not in Stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          {/* Products -- Block 2 */}
          <div className="flex flex-row justify-between items-center gap-3">
            <h1 className="text-lg pb-2 tracking-wide">Products</h1>
            {/* Button -- Add , Filter, Download */}
            <div className="flex flex-row gap-4 tracking-wide">
              <AddProduct />
              <button className="cursor-pointer rounded-md py-2 px-4 border border-gray-500 flex items-center gap-3 relative group">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                    stroke="#5D6679"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Filters
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
              <button className="cursor-pointer rounded-md py-2 px-4 border border-gray-500">
                Download All
              </button>
            </div>
          </div>
          {/* Data Products -- Block 3 */}
          <div className="pt-2">
            <table className="min-w-full bg-white text-left">
              {/* Title of Column */}
              <thead>
                <tr>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Product Type</th>
                  <th className="py-2 px-4">Buying Price</th>
                  <th className="py-2 px-4">Selling Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Availability</th>
                </tr>
              </thead>
              {/* Data of Column */}
              <tbody className="border-t border-gray-300">
                <tr>
                  <td className="py-2 px-4">Product Name</td>
                  <td className="py-2 px-4">Product Name</td>
                  <td className="py-2 px-4">Rp123</td>
                  <td className="py-2 px-4">Rp123</td>
                  <td className="py-2 px-4">12 Units</td>
                  <td className="py-2 px-4">In-stock</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-between pt-4">
            <button
              //   disabled={currentPage === 1}
              //   onClick={() => setCurrentPage(currentPage - 1)}
              className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {/* <span className="px-4 py-2">Page {currentPage} of {totalPages}</span> */}
            <span className="px-4 py-2">Page 1 of 10</span>
            <button
              //   disabled={currentPage === totalPages}
              //   onClick={() => setCurrentPage(currentPage + 1)}
              className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
