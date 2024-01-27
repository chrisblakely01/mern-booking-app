import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");
  const typeInactive = ' flex gap-2 items-center justify-center rounded-md bg-gray-50 h-10  py-3 mt-5 cursor-pointer    w-[177px]  h-[89px]  scale-90 duration-700 ease-in-out'
  const typeActive = ' bg-white shadow-lg border-solid border-2 border-sky-100 h-10 relative bottom-1 scale-100 duration-300 ease-in-out'

  const typesContainer = document.getElementById('typesContainer');
  const itemSize = 177;
  const scrollLft = () => typesContainer?.scrollBy({ left: -itemSize, behavior: 'smooth' });
  const scrollRight = () => typesContainer?.scrollBy({ left: itemSize, behavior: 'smooth' });

  const slideOnClick = (e: React.MouseEvent) => {
    if (e.clientX < document.body.clientWidth / 2) return scrollLft()
    return scrollRight()
  }

  return (
    <>
      <hr className="mb-4" />
      <div className="flex justify-between">
        <h3 className=" flex text-gray-500 relative px-3 before:absolute top-0  before:w-2 before:h-6   before:left-0   before:bg-blue-200   font-bold ">
          Select Types
        </h3>
        <label className="flex gap-2">
          <span className="w-[30px] h-[30px]   text-white text-center font-bold rounded-full cursor-pointer" onClick={scrollLft}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-sky-600 w-[25px] h-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </span>
          <span className="w-[30px] h-[30px]  text-white text-center font-bold rounded-full cursor-pointer" onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-sky-600 w-[25px] h-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </label>
      </div>


      <div onClick={slideOnClick} id="typesContainer" className="w-200 overflow-y-hidden overflow-x-scroll pr-5	 ">
        <div className="flex  gap-5 w-fit py-5 scroll-smooth focus:scroll-auto transition-all">

          {hotelTypes.map((type, k: number) => (
            <label key={k} className={
              typeWatch === type.title ? typeInactive + typeActive : typeInactive
            }>

              {type.icon && <img className={typeWatch === type.title ? "transition-all w-[33px] h-[33px]  duration-400  absolute opacity-1 top-[-15px] m-auto" : "transition-all w-[33px] h-[33px]  duration-400  absolute top-10	 opacity-0 "} src={type.icon} />}
              {type.icon && <img className={typeWatch === type.title ? " translate-x-4 opacity-0 absolute	" : "transition-all w-[33px] h-[33px]  duration-400 translate-x-0  opacity-1 "} src={type.icon} />}
              <input className="hidden" type="radio" value={type.title} {...register('type', {
                required: 'This field is Required'
              })} />
              <span className="flex gap-2">
                {typeWatch === type.title && <>
                  <span className="relative flex h-5 w-5 top-2" >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                  </span>

                </>}
                {type.title}


              </span>
            </label>

          ))}
        </div >
      </div >
      {errors.type && <span className=" block mt-3 text-sm  text-red-500"> {errors.type.message}</span>}

    </>
  );
};

export default TypeSection;
