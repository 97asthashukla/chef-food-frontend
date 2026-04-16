import { useEffect, useState } from "react";
import { CDN_URL, MENU_URL, RESTAURANT_LIST_URL } from "../utils/constant";
import { Shimmer } from "./Shimmer";
import { Link } from "react-router-dom";

const ResCard = ({restData}) => {
  const {name,cloudinaryImageId,cuisines,avgRating,costForTwo,sla, id}=restData.info
    return(
  <div className="res-card">
    <Link to={`/restaurant/${id}`}>
    <img
      className="res-logo"
      alt="res-logo"
      src={`${CDN_URL}/${cloudinaryImageId}`}
    />
    <h3 className="res-name">{name}</h3>
    <h4 className="res-cuisines">{cuisines.join(", ")}</h4>
    <h4 className="res-cost">{costForTwo}</h4>
    <h4 className="res-rating">{avgRating} stars</h4>
    <h4 className="res-time">{sla.deliveryTime} mins</h4>
    </Link>
  </div>
)};


export const Body = () => {
    const [MockDatas,setMockDatas] = useState([])
    const [searchText, setSearchText] = useState('')
    const [filteredRestaurant,setFilteredRestaurant] = useState([])
    useEffect(()=>{
        fetchDFata();
    },[])

     async function fetchDFata(){
        let data =  await fetch(RESTAURANT_LIST_URL)

        let resData = await data.json();
        setMockDatas(resData?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants)
        setFilteredRestaurant(resData?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants)
     }
     if(!MockDatas?.length) return <Shimmer/>
    return(
  <div className="body">
    <div className="filter">
        <div className="search">
            <input type="text" value={searchText} onChange={((e)=>setSearchText(e.target.value))}/><button onClick={()=>{const filteredList = MockDatas.filter(e=>(e.info.name).toLowerCase().includes(searchText.toLowerCase())); setFilteredRestaurant(filteredList)}}>Search</button>
        </div>
    <button className="filter-btn" onClick={()=>{const filteredList = MockDatas.filter(rest=>((rest.info.avgRating) >= 4));setMockDatas(filteredList)}} >Top Restaurants
    </button>
    </div>
    <div className="res-container">
       {filteredRestaurant?.map(rest=>
        <ResCard key={rest.info.id}
          restData={rest}
        />
        )}
    </div>
  </div>
)};

