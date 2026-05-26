import  ink from "../../../public/images/inka.png"
import Gaot from "../../../public/images/goat.png"
import { MdHdrEnhancedSelect } from "react-icons/md"
import Hens from "../../../public/images/Hens.png"
import Pigs from "../../../public/images/pigs.png"
const Cards = () => {
    const  products = [
        {id:1, name:"cow", price:240, image:inka, rate:4.5, description:"this is a cow",  isAvailable:true , isVerified:true, SVGComponentTransferFunctionElement},
        {id:2, name:"goat", price:120, image:Goat, rate:4.0, description:"this is a goat",  isAvailable:true , isVerified:true, SVGComponentTransferFunctionElement},
        {id:3, name:"sheep", price:100, image:Hens, rate:4.8, description:"this is a sheep",  isAvailable:false , isVerified:true, SVGComponentTransferFunctionElement},
        {id:4, name:"hen", price:50, image:Pigs, rate:3.9, description:"this is a hen",  isAvailable:true , isVerified:false, SVGComponentTransferFunctionElement},
    ]
  return (
    <div>
       <div className= " flex justify-start py-4 px-6">
         <h1 className=" text-3xl font-bold text-green-700" >easy selling, buying , and get jobs</h1>
       </div>
       <div className=" flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <div key={product.id} className=" w-64 bg-white rounded-lg shadow-md p-4">
            <img src={product.image} alt={product.name} className=" w-full h-40 object-cover rounded-md mb-4" />
            <h2 className=" text-xl font-semibold mb-2">{product.name}</h2>
            <p className=" text-gray-600 mb-2">{product.description}</p>
            <p className=" text-green-500 font-bold mb-2">${product.price}</p>
            <p className=" text-yellow-500 mb-2">Rating: {product.rate} / 5</p>
            <button className={` ${product.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-md`} disabled={!product.isAvailable}>
              {product.isAvailable ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Cards
