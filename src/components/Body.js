import { useEffect, useState } from "react";
import { CDN_URL, RESTAURANT_LIST_URL } from "../utils/constant";
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
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState("")
    useEffect(()=>{
        fetchDFata();
    },[])

    const getRestaurantsFromCards = (cards = []) => {
      for (const card of cards) {
        const restaurants = card?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        if (Array.isArray(restaurants) && restaurants.length > 0) {
          return restaurants;
        }
      }

      for (const card of cards) {
        const restaurants = card?.card?.card?.restaurants;
        if (Array.isArray(restaurants) && restaurants.length > 0) {
          return restaurants;
        }
      }

      return [];
    };

     async function fetchDFata(){
        setIsLoading(true);
        setFetchError("");
        try {
          const data =  await fetch(RESTAURANT_LIST_URL);
          const resData = await data.json();
          const cards = resData?.data?.cards || [];
          const restaurants = getRestaurantsFromCards(cards);

          setMockDatas(restaurants);
          setFilteredRestaurant(restaurants);

          if (restaurants.length === 0) {
            setFetchError("No restaurants found right now. Please refresh.");
          }
        } catch (error) {
          setMockDatas([]);
          setFilteredRestaurant([]);
          setFetchError("Unable to load restaurants. Please check your network and try again.");
        } finally {
          setIsLoading(false);
        }
     }
     if(isLoading) return <Shimmer/>

     if(fetchError) {
      return (
        <div className="body">
          <div className="filter">
            <button className="filter-btn" onClick={fetchDFata}>Retry</button>
          </div>
          <h3>{fetchError}</h3>
        </div>
      );
     }
    return(
  <div className="body">
    <div className="filter">
        <div className="search">
            <input type="text" value={searchText} onChange={((e)=>setSearchText(e.target.value))}/><button onClick={()=>{const filteredList = MockDatas.filter(e=>(e.info.name).toLowerCase().includes(searchText.toLowerCase())); setFilteredRestaurant(filteredList)}}>Search</button>
        </div>
    {/* <button className="filter-btn" onClick={()=>{const filteredList = MockDatas.filter(rest=>((rest.info.avgRating) >= 4));setMockDatas(filteredList)}} >Top Restaurants
    </button> */}
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

